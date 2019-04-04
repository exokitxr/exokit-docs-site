# exokit-site

Powers the **[Exokit Site](https://exokit.org/)**.

This site is built using [hexo](http://hexo.io/). Site content is written in
[Markdown](http://daringfireball.net/projects/markdown/syntax) (and located in
the [`src/`](src/) directory). Pull requests are welcome!

## Local Development

Clone [this repository](https://github.com/webmixedreality/exokit-site):

    git clone git@github.com:webmixedreality/exokit-site.git && cd exokit-site

To install the dependencies and start the local development server:

    npm install && npm run installdocs && npm start

You can set up local configuration settings:

    cp _config.local.yml.dist _config.local.yml

Then load __[`http://localhost:4000/`](http://localhost:4000/)__!

You may need to occasionally need to restart the server if you cause breaking
changes. Just proceed as usual. When developing on the site scripts,
generators, and helpers in `scripts/`, you will need to restart the server on
every change.

### Testing Documentation

Documentation lives in the [Exokit GitHub
repo](https://github.com/webmixedreality/exokit/tree/master/docs).

First, clone the Exokit GitHub repo](https://github.com/webmixedreality/exokit).

    cd exokit
    npm link

And then link `exokit-site` to `exokit`:

    cd exokit-site
    npm link exokit

Then the `master` documentation will update as you work on them from the
Exokit repository. This works because we have pointed the Exokit site, via a
soft symbolic link, to the documentation installed in
`node_modules/exokit/docs/`.


## Deployment

Push changes to GitHub, and [@a-frobot](https://github.com/a-frobot/) will
automatically deploy the site.

## Search

The documentation search service is hosted by [Algolia
DocSearch](https://community.algolia.com/docsearch/). The indexing
configuration can be found at the [DocSearch config
repo](https://github.com/algolia/docsearch-configs/blob/master/configs/exokit.json).

## Credits

Source adopted from the awesome [@vuejs](https://github.com/vuejs/)
[site](https://github.com/vuejs/vuejs.org/).

## License

Licensed under [The MIT License](LICENSE).
