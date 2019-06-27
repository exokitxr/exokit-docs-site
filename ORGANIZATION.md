# Directory Structure

Powered by [Hexo](https://hexo.io/)

- `_config.yml` - Hexo configuration.
- `scripts/` - Customization of Hexo generator and helpers.
  - `generators.js` - Configuration of Hexo generator.
  - `helpers.js` - Adding helper functions available to templates,
  - `redirects.js` - Generate redirect pages in case of moved pages.
- `COPYsrc` - Landing page files copied over after generating Hexo files.
- `src` - Content. Do not put CSS/JavaScript files here because Hexo will malform them.
  - `_data/` -
  - `community/index.md` - Community page.
  - `faq/index.md` - FAQ page.
  - `images/` - Site images
- `themes/` - Layout, CSS, releases.
  - `exokit/`
    - `layout/` - HTML and templates.
      - `layout.ejs` - Base template.
      - `index.ejs` - Homepage.
      - `partials/` - Reusable HTML partials.
    - `source/` - Site assets (CSS, fonts, images, JS). All files and folders will be copied to site root.
      - `css/` - CSS and Stylus.
      - `js/` - JavaScript files.
