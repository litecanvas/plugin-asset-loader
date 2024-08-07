# Asset Loader plugin for litecanvas

Plugin to help load external assets in [litecanvas](https://github.com/litecanvas/game-engine) games.

## Install

**NPM**: `npm i @litecanvas/plugin-asset-loader`

**CDN**: `https://unpkg.com/@litecanvas/plugin-asset-loader/dist/dist.js`

## Usage

### Loading images

```js
import litecanvas from "litecanvas"
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
    (image, { convertColors, splitFrames }) => {
      if (!image) throw "Failed to load image"
      images.original = image

      // `convertColors()` changes the colors of the image to use the litecanvas palette.
      // images.converted = convertColors(image)

      // `splitFrames()` splits the image into multiple frames.
      // see https://github.com/litecanvas/plugin-asset-loader/tree/main/demo/images/spritesheet.png
      /*
      images.frames = splitFrames(
        image,
        frameWidth,
        frameHeight,
        margin,
        spacing
      )
      */
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
  // image(0, 128, images.converted)
  // image(0, 256, images.frames[0])
}
```

### Loading fonts

```js
import litecanvas from "litecanvas"
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
      if (!res) throw "Failed to load font"
      textfont("Pixelify Sans")
    }
  )
}

function draw() {
  cls(0)
  if (LOADING > 0) {
    text(20, 20, "Loading...")
  } else {
    text(20, 20, "Font loaded!")
  }
}
```

### Loading JavaScript

```js
import litecanvas from "litecanvas"
import pluginAssetLoader from "@litecanvas/plugin-asset-loader"

litecanvas({
  loop: { init, update, draw },
})

use(pluginAssetLoader)

function init() {
  loadScript("https://unpkg.com/jquery/dist/jquery.js", (script) => {
    if (!script) throw "Failed to load script"
  })
}

function update(dt) {
  if (LOADING > 0) return // do nothing while loading
}

function draw() {
  cls(0)
  if (LOADING > 0) {
    text(20, 20, "Loading...", 3)
  } else {
    const version = jQuery.fn.jquery
    text(20, 20, "jQuery " + version + " loaded")
  }
}
```

## Configuration

```ts
use(pluginAssetLoader, {
  // Sets a base url used to load assets
  baseURL: string | null, // default: `null`

  // Sets the crossOrigin property for some assets
  // See: https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin
  crossOrigin: string | null, // default: "anonymous"
})
```

### Using `baseURL`

```js
// Example
use(pluginAssetLoader, {
  baseURL: "https://www.yourgame.com/assets/",
})

// this image will be loaded from https://www.yourgame.com/assets/images/hero.png
loadImage("images/hero.png")

// this image will be loaded from https://another.assets.site/images/dog.png
// baseURL is used only in URLs that do not start with a protocol (e.g. https:)
loadImage("https://www.another.assets.site/images/dog.png")
```

## Events

All loaders emit the following events

- `"asset-load"` when a asset is loaded successfully.
- `"asset-error"` when a asset fails to load.
- `"filter-asset"` to filter the asset object before it starts to load.
