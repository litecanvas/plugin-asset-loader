/*! Asset Loader plugin for litecanvas v0.3.0 by Luiz Bills | MIT Licensed */
import getScriptLoader from "./loaders/script"
import getImageLoader from "./loaders/image"
import getFontLoader from "./loaders/font"

window.pluginAssetLoader = plugin

export function plugin(engine, helpers) {
  return {
    LOADING: 0,
    loadScript: getScriptLoader(engine, helpers),
    loadImage: getImageLoader(engine, helpers),
    loadFont: getFontLoader(engine, helpers),
  }
}
