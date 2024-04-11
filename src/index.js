/*! Asset Loader plugin for litecanvas v0.2.0 by Luiz Bills | MIT Licensed */
import getScriptLoader from "./loaders/script"
import getImageLoader from "./loaders/image"
import getFontLoader from "./loaders/font"

window.pluginAssetLoader = plugin

export function plugin(engine, helpers) {
  engine.LOADING = 0

  return {
    loadScript: getScriptLoader(engine, helpers),
    loadImage: getImageLoader(engine, helpers),
    loadFont: getFontLoader(engine, helpers),
  }
}
