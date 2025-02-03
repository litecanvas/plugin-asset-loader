import "litecanvas"
import { basename, prepareURL, defaults } from "../utils"

/**
 * @param {LitecanvasInstance} engine
 * @param {LitecanvasPluginHelpers} h
 * @param {typeof defaults} config
 * @returns {object}
 */
export default function plugin(engine, h, config = {}) {
  config = Object.assign({}, defaults, config)

  engine.setvar("LOADING", engine.LOADING || 0)
  engine.setvar("ASSETS", engine.ASSETS || {})
  engine.ASSETS["font"] = {}

  /**
   *
   * @param {string} fontName
   * @param {string} src
   * @param {(data:fontFace?, eventData:object?) => void} [callback]
   * @returns {Promise<FontFace>}
   */
  const loadFont = async (fontName, src, callback) => {
    const { baseURL, ignoreErrors } = config
    const id = basename(src)

    src = prepareURL(src, baseURL)

    const fontFace = new FontFace(fontName, `url(${src})`)
    const eventData = {
      asset: fontFace,
      type: "font",
      fontName,
      src,
      id,
    }

    engine.emit("filter-asset", fontFace, eventData)

    document.fonts.add(fontFace)

    engine.setvar("LOADING", ++engine.LOADING)

    const loader = fontFace.load()

    loader
      .then((fontFace) => {
        ASSETS["font"][id] = fontFace
        if (callback) callback(fontFace)
        engine.emit("asset-load", eventData)
        engine.setvar("LOADING", --engine.LOADING)
      })
      .catch((reason) => {
        console.error(reason)
        if (!ignoreErrors) {
          throw new Error("Failed to load font from " + src)
        }
        if (callback) callback()
        engine.emit("asset-error", eventData)
      })

    return loader
  }

  return {
    loadFont,
  }
}
