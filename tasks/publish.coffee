module.exports = ->

  # All web assets start with this id range.
  START_ID = 9000000000000

  _ = require 'lodash'
  Q = require 'q'
  args = require('yargs').argv
  del = require 'del'
  fs = require 'fs'
  gulp = require 'gulp'
  logger = require 'winston'
  path = require 'path'
  readDirQ = Q.denodeify require('recursive-readdir')
  template = require 'gulp-template'

  env = require('./lib/env')()
  conf = env.config
  conf.mode = args?.mode || 'sync'
  rest = require('./lib/rest')(conf)

  logger.level = process.env.LOG_LEVEL if process.env.LOG_LEVEL?

  DEBUG = logger.debug
  INFO = logger.info
  ERROR = logger.error

  webroot =
    _id: START_ID
    name: 'Webroot'
    type: 'swgGroup'
    description: 'Root folder for all web resources'
    subtype: 'Folder'
    publist: [conf.site]

  gulp.task 'rescopy', ->
    gulp.src 'src/templates/resource.json'
      .pipe template(env)
      .pipe gulp.dest(env.dist)
    gulp.src ['bower_components/select2/select2.min.js','bower_components/jquery/dist/jquery.min.js','bower_components/jquery/dist/jquery.min.map']
      .pipe gulp.dest(env.dist + "/js")
    gulp.src ['bower_components/select2/select2.css','bower_components/select2/select2x2.png']
      .pipe gulp.dest(env.dist + "/css")

  gulp.task 'rescopy:clean', ->
    del "#{env.dist}/resource.json"

  # Intentionally not depending on the build tasks from Edward.
  # Assuming the files are already in the dist/js-templates folder.
  gulp.task 'publish', ['rescopy'], (cb) ->
    INFO "Publish task configured for host: #{conf.host}, mode: #{conf.mode}, user: #{conf.username}"
    return cb() if conf.mode is 'dry-run'

    rest.login()
      .then -> rest.findAsset(webroot.type, webroot.name)
      .then (found) ->
        if found isnt 0
          webroot._id = found
        else
          rest.createAsset webroot
      .then ->
        process.chdir env.dist
        if args?.f?
          files = if _.isArray(args.f) then args.f else [args.f]
          INFO "Request to publish only: #{files}"
          exists = (f for f in files when fs.existsSync(f))
          INFO "Publishing only these files that exist: #{exists}"
          exists
        else
          readDirQ '.', ['**/.*']
      .then (files) ->
        promises = []
        files.forEach (f) ->
          asset = rest.makeFileAsset(f, webroot)
          promises.push rest.findAsset(asset.type, asset.description, 'description').then (found) ->
            if found isnt 0
              asset._id = found
              if conf.mode is 'sync' then rest.createAsset(asset) else found
            else
              asset._id = rest.genId("#{conf.dist}/#{f}")
              rest.createAsset asset
        Q.all(promises)
      .then (assets) -> INFO "Published #{assets.length} files as assets."
      .catch (err) -> ERROR err
      .done -> cb()

  gulp.task 'publish:clean', ['rescopy:clean'], (cb) ->
    INFO "Publish clean task configured for host: #{conf.host}, mode: #{conf.mode}, user: #{conf.username}"
    rest.login()
      .then ->
        # Sort by id asc to make the Webroot parent go first so we can pluck it out of the results.
        # You cannot delete the parent until all the children are deleted
        # 500 files seems to be a sensible value for the number of files.
        rest.find({'field:id:startswith': '9', 'sortfield:id:asc', 'count': 500})
      .then (found) ->
        promises = []
        if found isnt 0
          [folder, files] = [_.head(found), _.tail(found)]
          files.forEach (asset) ->
            [type, id] = asset.id.split(':')
            promises.push rest.deleteAsset(type, id)
        Q.all(promises).then (assets) ->
          INFO "Deleted #{assets.length} file assets." if assets.length isnt 0
          [type, id] = folder.id.split(':')
          rest.deleteAsset(type, id)
      .then (asset) -> INFO "Deleted the parent folder asset."
      .catch (err) -> ERROR err
      .done -> cb()