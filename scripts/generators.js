var urljoin = require('urljoin.js');

var utils = require('../node_scripts/utils');

hexo.extend.generator.register('examples.json', function (locals) {
  return {
    path: 'examples/index.json',
    data: JSON.stringify(locals.data.examples)
  };
});

hexo.extend.generator.register('examples', function (locals) {
  var routes = [];

  function addRoute (path, data, layout) {
    routes.push({
      path: path,
      data: data,
      layout: layout
    });
  }

  addRoute('docs/', utils.createRedirectResponse(hexo, 'docs/introduction'));
  addRoute('faq/', utils.createRedirectResponse(hexo, 'docs/introduction/faq.html'));


  return routes;
});

/**
 * Paginated blog.
 */
hexo.extend.generator.register('blog', function (locals) {
  var routes = [];
  var perPage = hexo.config.per_page;
  var posts = locals.posts.sort('date', -1);
  for (var i = 1, j = posts.length, page = 1; i < j; i += perPage, page++) {
    // blog/page/*/
    var route = {
      path: 'blog/' + page + '/',
      data: {
        blog_index: true,
        posts: posts.slice(i - 1, i - 1 + perPage),
      },
      layout: 'blog'
    };

    // Next.
    if (i + perPage < posts.length) {
      route.data.next = {
        pageNum: page + 1,
        path: '/blog/' + (page + 1) + '/',
        title: 'Next Page'
      };
    }

    // Prev.
    if (i > 1) {
      route.data.prev = {
        pageNum: page - 1,
        path: page - 1 === 1 ? 'blog/' : '/blog/' + (page - 1) + '/',
        title: 'Previous Page'
      };
    }

    // blog/ root alias of blog/page/1/.
    routes.push(route);
    if (page === 1) {
      var indexRoute = Object.assign({}, route);
      indexRoute.path = 'blog/';
      routes.push(indexRoute);
    }
  }
  return routes;
});
