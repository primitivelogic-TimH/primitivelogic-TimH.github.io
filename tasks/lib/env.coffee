module.exports = ->
  home = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE

  nconf = require 'nconf'
  _ = require 'lodash'

  env = process.env.NODE_ENV || 'jsk'

  nconf
     .file 'home', home + '/sitesconfig.json'
     .file 'project', './sitesconfig.json'

  nconf.add 'config',
    type: 'literal'
    store:
      jsk:
        host: 'localhost:9080'
        username: 'fwadmin'
        password: 'xceladmin'
        h1:
          host: 'localhost:9280'
        h2:
          host: 'localhost:9380'

      dev:
        host: 'wcsbatchdev'
        h1:
          host: 'wcsdelbatchdev'
        h2:
          host: 'wcsdelbatchdev2'

      test:
        host: 'wcsbatchtest'
        h1:
          host: 'wcsdelbatchtest'
        h2:
          host: 'wcsdelbatchtest2'

      uat:
        host: 'h1wcsbatchuat'
        h2auth:
          host: 'h2wcsbatchuat'
        h1:
          host: 'h1wcsdelbatchuat'
        h2:
          host: 'h2wcsdelbatchuat'

      prod:
        host: 'h1wcsbatchprod'
        h2auth:
          host: 'h2wcsbatchprod'
        h1:
          host: 'h1wcsdelbatchprod'
        h2:
          host: 'h2wcsdelbatchprod'

  nconf.defaults
    common:
      site: 'SouthwestGas'
      username: 'fwadmin'
      password: 'Passw0rd'

  conf = nconf.get env
  _.defaults conf, nconf.get 'common'

  base = _.omit conf, 'h1', 'h2', 'h2auth'
  _.defaults conf.h1, base
  _.defaults conf.h2, base

  config: conf
  prefix: 'www/'
  webprefix: ''
  dist: './dist/'
