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

  /**
   * @param {string} src
   * @param {(data:any?) => void} [callback]
   * @param {RequestInit} [fetchOptions]
   * @returns {Promise<any>}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
   */
  const loadJSON = async (src, fetchOptions, callback) => {
    const { baseURL, ignoreErrors } = config

    src = prepareURL(src, baseURL)

    const eventData = {
      type: "json",
      src,
      id: basename(src),
    }

    engine.emit("filter-asset", null, eventData)
    engine.setvar("LOADING", engine.LOADING + 1)

    const request = fetch(src, fetchOptions)

    request
      .then((res) => res.json())
      .then((data) => {
        eventData.json = data
        if (callback) callback(data)
        engine.emit("asset-load", eventData)
        engine.setvar("LOADING", engine.LOADING - 1)
      })
      .catch((reason) => {
        console.error(reason)
        if (!ignoreErrors) {
          throw new Error("Failed to load JSON from " + src)
        }
        if (callback) callback()
        engine.emit("asset-error", eventData)
      })

    return request
  }

  return {
    loadJSON,
  }
}
