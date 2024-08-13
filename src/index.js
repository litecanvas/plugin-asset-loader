/*! Asset Loader plugin for litecanvas v0.7.0 by Luiz Bills | MIT Licensed */
import getScriptLoader from "./loaders/script"
import getImageLoader from "./loaders/image"
import getFontLoader from "./loaders/font"
import getSoundLoader from "./loaders/sound"
import getJSONLoader from "./loaders/json"

window.pluginAssetLoader = plugin

/**
 *
 * @param {LitecanvasInstance} engine
 * @param {LitecanvasPluginHelpers} helpers
 * @param {*} config
 */
export function plugin(engine, helpers, config = {}) {
  const defaults = {
    crossOrigin: "anonymous",
    baseURL: null,
    allowSoundInterruptions: true,
  }

  config = Object.assign(defaults, config)

  function prepareURL(url) {
    if (config.baseURL && !hasProtocol(url)) {
      url = config.baseURL + url
    }
    return url
  }

  helpers = Object.assign(helpers, { basename, prepareURL })

  engine.setvar("LOADING", 0)

  return {
    loadScript: getScriptLoader(engine, helpers, config),
    loadImage: getImageLoader(engine, helpers, config),
    loadFont: getFontLoader(engine, helpers, config),
    loadSound: getSoundLoader(engine, helpers, config),
    loadJSON: getJSONLoader(engine, helpers, config),
  }
}

/**
 * Returns the file name (without extension) of a path.
 *
 * @param {string} path
 * @returns {string} the file name
 */
function basename(path) {
  return path.split("\\").pop().split("/").pop().split(".")[0]
}

/**
 * Checks if a url string has protocol.
 *
 * @param {string} url
 * @returns {boolean}
 */
function hasProtocol(url) {
  try {
    const u = new URL(url)
    return !!u.protocol
  } catch (e) {}
  return false
}
