module.exports = (options) ->
  _ = require 'lodash'
  Q = require 'q'
  fs = require 'fs'
  logger = require 'winston'
  path = require 'path'
  requestQ = Q.denodeify require('request')

  env = require('./env')()

  logger.level = process.env.LOG_LEVEL if process.env.LOG_LEVEL?

  DEBUG = logger.debug

  # All test assets will start in the id range if not overridden.
  startId = 900000000000

  requestHeader =
    Accept: 'application/json'
    'X-CSRF-Token': ''

  ticket = null

  login: ->
    requestOpts =
      uri: "http://#{options.host}/cas/v1/tickets"
      form: { username: options.username, password: options.password }
      method: 'POST'

    requestQ(requestOpts).then (resp) ->
      throw new Error "Cannot login, server error: #{resp[0].statusCode}" if resp[0].statusCode not in [200, 201]

      location = resp[0]?.headers?.location
      requestQ(method: 'POST', uri: location, form: { service: '*' })
        .then (resp) ->
          ticket = resp[1]
          DEBUG "Got multi-ticket #{ticket}"
          requestHeader['X-CSRF-Token'] = resp[1]

  find: (args) ->
    requestOpts =
      uri: "http://#{options.host}/cs/REST/sites/#{options.site}/search"
      qs: {multiticket: ticket}
      headers: requestHeader
      method: 'GET'

    _.merge(requestOpts.qs, args) if args?
    requestQ(requestOpts).then (resp) ->
      if resp[0].statusCode isnt 200
        ERROR 'Unable to get to Sites'
        throw new Error resp[1]
      else
        # The data for search is not a JSON object. This is different to an asset post.
        json = JSON.parse(resp[1])

        DEBUG (if json.count is 0 then "No assets found" else "Found #{json.count} assets")

        return if json.count is 0 then 0 else json.assetinfo

  findAsset: (type, term, field) ->
    field = 'name' if not field?

    requestOpts =
      uri: "http://#{options.host}/cs/REST/sites/#{options.site}/types/#{type}/search"
      qs: { multiticket: ticket }
      headers: requestHeader

    requestOpts.qs["field:#{field}:equals"] = term

    DEBUG "Searching for type: #{type}, #{field}: #{term}"

    requestQ(requestOpts).then (resp) ->
      throw new Error resp[0] if resp[0]?.statusCode isnt 200

      # The data for search is not a JSON object. This is different to an asset post.
      json = JSON.parse(resp[1])
      return 0 if json.count is 0

      # Return the first
      assetid = json?.assetinfo?[0].id?.split(":")[1]

      DEBUG "Found asset #{assetid}"
      return assetid

  getAsset: (type, id) ->
    requestOpts =
      uri: "http://#{options.host}/cs/REST/sites/#{options.site}/types/#{type}/assets/#{id}"
      qs: { multiticket: ticket }
      headers: requestHeader

    DEBUG "Getting asset of type: #{type}, id: #{id}"

    requestQ(requestOpts).then (resp) ->
      throw new Error resp[0] if resp[0]?.statusCode isnt 200

      # The data for search is not a JSON object. This is different to an asset post.
      json = JSON.parse(resp[1])

      # Return the first
      assetid = json?.id?.split(":")[1]

      DEBUG "Got asset #{assetid}"
      return json

  setStartId: (id) ->
    startId = id

  genId: (str) ->
    return 0 if not str?
    id = startId
    for ch, i in str
      num = ch.charCodeAt()
      num *= (i+1)
      id += num
    id

  makeFileAsset: (file, parent, type='swgFile', subtype='WebFile', attribute='File') ->
    filename = path.basename(file)
    asset =
      name: filename
      description: env.prefix + file
      publist: [options.site]
      subtype: subtype
      type: type
      attribute: [{
          name: attribute
          data:
            blobValue:
              filedata: fs.readFileSync(file, { encoding: 'base64' })
              filename: filename
        },{
          name: 'filename'
          data: { stringValue: filename }
        },{
          name: 'path'
          data: { stringValue: path.dirname(file) }
        },{
          name: 'template'
          data: { stringValue: '/swg/layout' }
        }]


    if parent?
      asset.parent = [
        parentDefName: parent.subtype
        asset: "#{parent.type}:#{parent._id}"
      ]

    asset

  createAsset: (asset) ->
    requestOpts =
      uri: "http://#{options.host}/cs/REST/sites/#{options.site}/types/#{asset.type}/assets"
      qs: { multiticket: ticket }
      headers: requestHeader
      body: asset
      json: true
      method: 'POST'

    requestOpts.uri = "#{requestOpts.uri}/#{asset._id}" if asset._id?

    # Don't use the asset.id, it will give you a 500 error because Sites will reject the data
    requestQ(requestOpts).then (resp) ->
      # Create = 200, Update = 201
      if resp[0].statusCode in [200, 201]
        assetid = resp[1]?.id?.split(":")[1]
        DEBUG "Asset created/updated with id #{assetid}"
        assetid
      else
        throw new Error resp[1]

  deleteAsset: (type, id) ->
    requestOpts =
      uri: "http://#{options.host}/cs/REST/sites/#{options.site}/types/#{type}/assets/#{id}"
      qs: { multiticket: ticket }
      headers: requestHeader
      method: "DELETE"

   # Don't use the asset.id, it will give you a 500 error because Sites will reject the data
    requestQ(requestOpts).then (resp) ->
      # Create = 200, Update = 201
      if resp[0].statusCode in [200, 201]
        DEBUG "Deleted asset #{type}:#{id}"
        true
      else
        throw new Error resp[1]