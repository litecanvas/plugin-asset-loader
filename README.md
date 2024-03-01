# Asset Loader plugin for litecanvas

Plugin to help load external assets in [litecanvas](https://github.com/litecanvas/engine) games.

## Install

**NPM**: `npm i @litecanvas/plugin-asset-loader`

**CDN**: `https://unpkg.com/@litecanvas/plugin-asset-loader/dist/dist.js`

## Usage

### Loading images

```js
import litecanvas from "@litecanvas/litecanvas"
import pluginAssetLoader from "@litecanvas/plugin-asset-loader"

litecanvas({
  plugins: [pluginAssetLoader],
})

function init() {
  images = {}

  // load a random image
  loadImage("https://random.imagecdn.app/64/64?foo", (image) => {
    images.foo = image
  })

  // load another random image
  loadImage("https://random.imagecdn.app/64/64?bar", (image) => {
    images.bar = image
  })
}

function update(dt) {}

function draw() {
  // `LOADING` is an integer global variable
  // it represents the number of assets that are loading
  if (LOADING > 0) {
    // do nothing while loading
    return
  }

  image(0, 0, images.foo)
  image(0, 64, images.bar)
}
```

### Loading JavaScript

```js
import litecanvas from "@litecanvas/litecanvas"
import pluginAssetLoader from "@litecanvas/plugin-asset-loader"

litecanvas({
  plugins: [pluginAssetLoader],
})

function init() {
  loadScript("https://code.jquery.com/jquery-3.7.1.min.js", (script) => {
    if (!script) {
      alert("cannot load jQuery")
    }
  })
}

function update(dt) {
  if (LOADING > 0) return // do nothing while loading
}

function draw() {
  clear(0)
  if (LOADING > 0) {
    text(20, 20, "Loading...", 3, 14)
  } else {
    const version = jQuery.fn.jquery
    text(20, 20, "jQuery " + version + " loaded", 3, 18)
  }
}
```
