import "litecanvas"
import { basename, prepareURL, defaults, modLoading } from "../utils"

/**
 * @param {LitecanvasInstance} engine
 * @param {LitecanvasPluginHelpers} h
 * @param {typeof defaults} config
 * @returns {object}
 */
export default function plugin(engine, h, config = {}) {
  config = Object.assign({}, defaults, config)

  engine.setvar("ASSETS", engine.ASSETS || {})
  engine.ASSETS["script"] = {}

  /**
   * @param {string} src
   * @param {(data:HTMLScriptElement?) => void} [callback]
   * @returns {Promise<HTMLScriptElement>}
   */
  const loadScript = async (src, callback) => {
    const { baseURL, ignoreErrors, crossOrigin } = config
    const id = basename(src)

    src = prepareURL(src, baseURL)

    const script = document.createElement("script")
    const eventData = {
      asset: script,
      type: "script",
      src,
      id,
    }

    return new Promise((resolve) => {
      modLoading(engine, 1)
      script.crossOrigin = crossOrigin

      script.onerror = (reason) => {
        console.error(reason)
        if (!ignoreErrors) {
          throw new Error("Failed to load " + src)
        }
        if (callback) callback()
        engine.emit("asset-error", eventData)
      }

      script.onload = () => {
        engine.ASSETS["script"][id] = script
        if (callback) callback(script)
        engine.emit("asset-load", eventData)
        modLoading(engine, -1)
        resolve(script)
      }

      engine.emit("filter-asset", script, eventData)

      script.src = src

      document.head.appendChild(script)
    })
  }

  return {
    loadScript,
  }
}
