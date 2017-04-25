# Example using mithril with static-site-generator-webpack-plugin

A repository showing how to use the [Mithril](https://mithril.js.org/) library alongside webpack and [static-site-generator-webpack-plugin](https://github.com/markdalgleish/static-site-generator-webpack-plugin) to create server-rendered, static pages based loosely off of this [issue](https://github.com/markdalgleish/static-site-generator-webpack-plugin/issues/90).


## Step 1 - Enable Mithril to render html as a string

The original issue post has this code snippet:
```javascript
import m from 'mithril';
import Landing from './landing';

import './styles/theme.scss';

m.render(document.body, m(Landing));
```
The problem with this code snippet, and what was tripping me up, was that this code expects to be executed within the context of an actual browser. However, this code is being executed from within the context of the node runtime. This [comment](https://github.com/markdalgleish/static-site-generator-webpack-plugin/issues/79#issuecomment-294590819) was really helpful in understanding that.

In order to fix this, a quick trip to google for 'mithril server rendered' led to [mithril-node-render](https://github.com/StephanHoyer/mithril-node-render) library and this adjusted code snippet:
```javascript
import m from 'mithril';
import render from 'mithril-node-render';
import Landing from './landing';

export default (locals, callback) => {
  render(m('span', 'huhu')).then(function (html) {
    callback(null, "<html><head><title>Nice</title></head><body><h1>" + html + "</h1></body></html>");
  })

}
```
Nice, so now the call to ```render()``` returns a promise which will we resolve with the html you'd like to render. This code doesn't actually work yet, because we need to give the plugin access to DOM methods it expects, namely ```window()``` and ```document()```.

## Step 2.

Following the thread of the issue comment posted by [sillero](https://github.com/sillero), led to this webpack.config.js change...
```javascript
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const dom = new JSDOM();
//.....
  plugins: [
    new webpack.ProvidePlugin({m: 'mithril'}),
    new StaticSiteGeneratorPlugin({
      entry: 'main',
      paths: [
        '/hello/',
        '/world/'
      ],
      locals: {
        greet: 'Hello'
      },
      globals: {
        window: dom.window,
        document: dom.document,
      },
    })

  ],
```
The key was passing in the elements to the globals parameter.
