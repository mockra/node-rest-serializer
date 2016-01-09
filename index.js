var _ = require('lodash')

module.exports = function (k, d, o) {
  var json = {}
  json[k] = serializeData(d, o || {})
  return json


  function deleteWithout (obj, keys) {
    _.each(_.flatten(Array(keys)), function (key) {
      delete obj[key]
    })
  }

  function sideloadData (obj, relations) {
    _.each(_.flatten(Array(relations)), function(relation) {
      if (obj[relation.name]) {
        var key = relation.key || 'id'
        serializeData(obj[relation.name], relation)
        addToJson(relation.plural || relation.name, obj[relation.name])
        if (_.isArray(obj[relation.name])) {
          obj[relation.name] = _.pluck(obj[relation.name], key)
        } else {
          obj[relation.name] = obj[relation.name][key]
        }
      }
    })
  }

  function serializeData (data, options) {
    if (_.isArray(data)) {
      return _.map(data, function (object) {
        serializeObject(object, options)
        return object
      })
    } else {
      serializeObject(data, options)
      return data
    }
  }

  function serializeObject (object, options) {
    if (options.without) deleteWithout(object, options.without)
    if (options.sideload) sideloadData(object, options.sideload)
  }

  function addToJson (name, data) {
    data = _.flatten(Array(data))
    if (json[name]) {
      json[name].concat(data)
    } else {
      json[name] = data
    }
  }
}
