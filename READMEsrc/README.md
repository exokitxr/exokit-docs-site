# webmixedreality.github.io

Hosted static Exokit site. See the [exokit-site repo](https://github.com/webmixedreality/exokit-site).

<h1> Deployment </h1>

```sh
git clone git@github.com:webmixedreality/webmixedreality.github.io.git
cd webmixedreality.github.io

git clone git@github.com:webmixedreality/exokit-site.git
npm install --prefix exokit-site
npm run deploy --prefix exokit-site

cp -r exokit-site/public/* ./
rm -rf exokit-site

git add .
git commit -m "rebuild site"
git push
```
