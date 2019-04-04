var urljoin = require('urljoin.js');

var utils = require('../node_scripts/utils');

var url_for = hexo.extend.helper.store.url_for.bind(hexo);


var transforms = {};



hexo.locals.set('data', function () {
  var obj = {};
  hexo.model('Data').forEach(function (doc) {
    obj[doc._id] = doc._id in transforms ? transforms[doc._id](doc.data) : doc.data;
  });
  return obj;
});
