var cheerio = require('cheerio');
var moment = require('moment');
var striptags = require('striptags');
var urljoin = require('urljoin.js');

var pkg = require('../package');
var utils = require('../node_scripts/utils');

var isUrl = utils.isUrl;

var MASTER = 'master';
var exokitCurrentSha = MASTER;
try {
  exokitCurrentSha = pkg.dependencies.exokit.split('#')[1];
} catch (e) {}

/**
 * Generate data structure for generating table of contents.
 *
 * @param {string} content - Page content.
 * @returns {array} [{title: 'Title', link: '#anchor', children: []}]
 */
hexo.extend.helper.register('table_of_contents', function (content) {
  var $ = cheerio.load(content);
  var h2Set = $('h2');
  var toc = [];

  // Get H2s.
  var items = h2Set.map(function (h2) {
    var $h2 = $(this);

    // Add H2.
    var link = $h2.find('a')[0];
    var item = {
      title: link.attribs.title,
      href: link.attribs.href.toLowerCase(),
      children: []
    };

    // Get H3s. Loop until we hit an H2 or until no more siblings.
    var links = $h2.nextUntil('h2', 'h3').find('a');
    for (var i = 0; i < links.length; i++) {
      if (links[i].attribs.href.indexOf('#') !== 0) { continue; }
      item.children.push({
        title: links[i].attribs.title,
        href: links[i].attribs.href.toLowerCase()
      });
    }
    return item;
  });

  // Convert to be `forEach`able.
  for (var i = 0; i < items.length; i++) {
    toc.push(items[i]);
  }
  return toc;
});

hexo.extend.helper.register('markdown', function (text) {
  return hexo.render.renderSync({text: text, engine: 'markdown'});
});

/**
 * #1000 -> github.com/exokitxr/exokit/pull/1000
 * abcde -> github.com/exokitxr/exokit/commit/abcde
 * exokitxr/exokit-editor|#1000 -> github.com/exokitxr/exokit-editor/pull/1000
 */
hexo.extend.helper.register('github_contribution', function (contribution, display) {
  var project = this.config.github.exokit.username + '/' + this.config.github.exokit.repo;
  var contributionSplit;
  display = display || contribution;

  if (contribution.indexOf('|') !== -1) {
    contributionSplit = contribution.split('|');
    project = contributionSplit[0];
    contribution = contributionSplit[1];
  }

  if (contribution[0] === '#') {
    contribution = contribution.substring(1);
    return '<a href="https://github.com/' + project + '/pull/' + contribution + '">' +
      display + '</a>';
  }
  return '<a href="https://github.com/' + project + '/commit/' + contribution + '">' +
    display + '</a>';
});

hexo.extend.helper.register('github_release_url', function (version) {
  version = version || ('v' + this.config.exokit_version);
  return urljoin(this.config.github.exokit.url, 'releases', 'tag', version);
});

hexo.extend.helper.register('github_file_url', function (path) {
  return urljoin(this.config.github.exokit.url, 'blob', exokitCurrentSha, path);
});

/**
 * Get GitHub edit URL.
 * - Change .html to .md.
 * - For docs, must remove the active version (e.g., docs/0.2.0/guide.html -> docs/guide.md).
 */
hexo.extend.helper.register('website_github_edit_url', function (path) {
  // For docs.
  if (path.indexOf('docs/') !== -1) {
    return urljoin(this.config.github.exokit_site.url, 'edit', MASTER,
                   path.replace('docs/', 'src/docs/').replace(/\.html$/, '.md'));
  }

});

/**
 * Like Hexo's `url_for` helper but returns an absolute URL.
 */
hexo.extend.helper.register('absolute_url_for', function (path, options) {
  var url = urljoin(this.config.url, this.url_for(path, options));
  if (options && options.secure === false) {
    url = url.replace(/^https:/, 'http:');
  }
  return url;
});

hexo.extend.helper.register('page_url', function (path, options) {
  return this.url_for(path, options).replace(/index\.html$/, '');
});

hexo.extend.helper.register('docs_url_prefix', function (item) {
  return this.page.source.split('/', 2).join('/') + '/';
});

/**
 * Sort documentation pages. Pages that have `order` go first. Then alphabetized by title.
 */
hexo.extend.helper.register('docs_nav_sort', function (pages) {
  var orderedPages = [];
  var alphabetizedPages = [];
  pages.forEach(function addOrderedPages (page) {
    if ('order' in page) {
      orderedPages.push(page);
      return;
    }
    alphabetizedPages.push(page);
  });
  orderedPages = orderedPages.sort(function sort (pageA, pageB) {
    if (pageA.order < pageB.order) { return -1; }
    if (pageA.order > pageB.order) { return 1; }
    return 0;
  });
  alphabetizedPages = alphabetizedPages.sort(function sort (pageA, pageB) {
    if (pageA.title < pageB.title) { return -1; }
    if (pageA.title > pageB.title) { return 1; }
    return 0;
  });
  return orderedPages.concat(alphabetizedPages);
});

/**
 * Retrieve first page of a version's documentation. The first page will be determined
 * using section_order + order. Generally, whichever page has `{section_order: 1, order: 1}`.
 *
 * docs_root_path(site.pages, '0.2.0')
 * >> docs/0.2.0/guide/
 *
 * @param {object} pages - site.pages.
 */
hexo.extend.helper.register('docs_root_path', function (pages, version) {
  var page = docs_version_filter(pages, version).find({parent_section: 'docs'})
                                                .sort('section_order')
                                                .sort('order').data[0];
  return '/' + page.path.replace('index.html', '');
});

/**
 * Filter documentation navigation to only include pages of the version being browsed.
 */
hexo.extend.helper.register('docs_version_filter', function (pages, version) {
  return docs_version_filter(pages, version);
});
function docs_version_filter (pages, version) {
  return pages.filter(function (page) {
    return page.path.indexOf('docs/' + version) !== -1;
  });
}

hexo.extend.helper.register('is_external_url', isUrl);

/**
 * Generate description for `<meta name="description">`.
 */
hexo.extend.helper.register('meta_description', function (page) {
  // Else, return vanilla description.
  return hexo.config.description;
});

/**
 * Infer image for `<meta property="og:image">` and Twitter card.
 */
hexo.extend.helper.register('meta_image', function (page, defaultCard) {
  // Else, return default card image.
  return defaultCard;
});
