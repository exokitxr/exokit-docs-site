var fs = require('fs');
var glob = require('glob');
var join = require('path').join;

var utils = require('../node_scripts/utils');

var MASTER = 'master';



hexo.extend.generator.register('site-redirects', function () {
  return expandRedirectObjs([
    ['faq/', join('docs', 'introduction', 'faq.html')]
  ]);
});

hexo.extend.generator.register('blog-redirects', function () {
  return expandRedirectObjs([
  ]);
});

hexo.extend.generator.register('community-short-url-redirects', function () {
  return expandRedirectObjs([
    ['github/', hexo.config.github.exokit.url],
    ['repo/', hexo.config.github.exokit.url],

    ['twitter/', hexo.config.twitter.url],

    ['slack/', hexo.config.slack.exokit.signup_url],
    ['chat/', hexo.config.slack.exokit.signup_url],

    ['so/', hexo.config.stack_overflow.exokit.url],
    ['stack-overflow/', hexo.config.stack_overflow.exokit.url],
    ['stackoverflow/', hexo.config.stack_overflow.exokit.url],
    ['help/', hexo.config.stack_overflow.exokit.url],
    ['ask/', hexo.config.stack_overflow.exokit.url],
    ['questions/', hexo.config.stack_overflow.exokit.url]
  ]);
});

hexo.extend.generator.register('docs-redirects', function () {
  var redirectObjs = [
    // getDocRootRedirectObjs()
  ];
  redirectObjs.push([
    ['docs/', 'docs/' + 'introduction/'],
    ['docs/guide/', 'docs/' + 'introduction/']
  ]);

  // Flatten arrays since `redirectObjs` is an array of arrays of arrays. We just want a flat
  // array of [<from>, <to>]s.
  return expandRedirectObjs([].concat.apply([], redirectObjs));
});

/**
 * To enable more convenient data structure.
 * [fromPath, toPath] to {path: fromPath, data: redirect(hexo, toPath)}
 */
function expandRedirectObjs (redirectObjs) {
  return redirectObjs.map(function expand(redirectObj) {
    return {path: redirectObj[0], data: utils.createRedirectResponse(hexo, redirectObj[1])};
  });
}

/**
 * Redirects from '/docs/<version>/' to '/docs/<version>/guide/'.
 */
// function getDocRootRedirectObjs () {
//   return aframeVersions.map(function getRedirectObj (version) {
//       return ['docs/', 'docs/'];
//   });
// }
