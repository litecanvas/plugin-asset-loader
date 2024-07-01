# Asset Loader plugin for litecanvas

Plugin to help load external assets in [litecanvas](https://github.com/litecanvas/game-engine) games.

## Install

**NPM**: `npm i @litecanvas/plugin-asset-loader`

**CDN**: `https://unpkg.com/@litecanvas/plugin-asset-loader/dist/dist.js`

## Usage

### Loading images

```js
import litecanvas from "@litecanvas/litecanvas"
import pluginAssetLoader from "@litecanvas/plugin-asset-loader"

litecanvas({
  loop: { init, update, draw },
})

use(pluginAssetLoader)

function init() {
  images = {}

  // load another random image
  loadImage(
    "https://random.imagecdn.app/128/128?bar",
    (image, { convertColors }) => {
      if (!image) throw new Error("Failed to load image")
      images.original = image
      // convert colors to litecanvas palette
      images.converted = convertColors(image)
    }
  )
}

function update(dt) {}

function draw() {
  // `LOADING` is an global integer variable
  // it represents the number of assets that are loading
  if (LOADING > 0) {
    // do nothing while loading
    return
  }

  image(0, 0, images.original)
  image(0, 128, images.converted)
}
```

### Loading font

```js
import litecanvas from "@litecanvas/litecanvas"
import pluginAssetLoader from "@litecanvas/plugin-asset-loader"

litecanvas({
  loop: { init, update, draw },
})

use(pluginAssetLoader) // load the plugin

function init() {
  loadFont(
    "Pixelify Sans",
    "https://fonts.gstatic.com/s/pixelifysans/v1/CHy2V-3HFUT7aC4iv1TxGDR9DHEserHN25py2TTp0E1fZZM.woff2",
    function (res) {
      if (!res) throw new Error("Failed to load font")
      textfont("Pixelify Sans")
    }
  )
}

function draw() {
  clear(0)
  if (LOADING > 0) {
    text(20, 20, "Loading...")
  } else {
    text(20, 20, "Font loaded!")
  }
}
```

### Loading JavaScript

```js
import litecanvas from "@litecanvas/litecanvas"
import pluginAssetLoader from "@litecanvas/plugin-asset-loader"

litecanvas({
  loop: { init, update, draw },
})

use(pluginAssetLoader)

function init() {
  loadScript("https://code.jquery.com/jquery-3.7.1.min.js", (script) => {
    if (!script) throw new Error("Failed to load script")
  })
}

function update(dt) {
  if (LOADING > 0) return // do nothing while loading
}

function draw() {
  clear(0)
  if (LOADING > 0) {
    text(20, 20, "Loading...", 3)
  } else {
    const version = jQuery.fn.jquery
    text(20, 20, "jQuery " + version + " loaded")
  }
}
```
