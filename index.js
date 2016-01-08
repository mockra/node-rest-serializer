var _ = require('lodash')

module.exports = function (k, d, o) {
  var json = {}
  json[k] = serializeData(d, o)
  return json


  function deleteWithout (obj, keys) {
    _.each(_.flatten(Array(keys)), function (key) {
      delete obj[key]
    })
  }

  function sideloadData (obj, relations) {
    _.each(relations, function(relation) {
      if (obj[relation.name]) {
        var key = relation.key || 'id'
        serializeData(obj[relation.name], relation)
        addToJson(relation.name, obj[relation.name])
        obj[relation.name] = _.pluck(obj[relation.name], key)
      }
    })
  }

  function serializeData (data, options) {
    return _.map(data, function (object) {
      if (options.without) deleteWithout(object, options.without)
      if (options.sideload) sideloadData(object, options.sideload)
      return object
    })
  }

  function addToJson (name, data) {
    if (json[name]) {
      json[name].concat(data)
    } else {
      json[name] = data
    }
  }
}
