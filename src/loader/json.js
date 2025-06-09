import "litecanvas"
import { basename, prepareURL, defaults, modLoading } from "../utils"

/**
 * @param {LitecanvasInstance} engine
 * @param {typeof defaults} config
 * @returns {object}
 */
export default function plugin(engine, config = {}) {
  config = Object.assign({}, defaults, config)

  engine.def("ASSETS", engine.ASSETS || {})
  engine.ASSETS["json"] = {}

  /**
   * @param {string} src
   * @param {(data:any?) => void} [callback]
   * @param {RequestInit} [fetchOptions]
   * @returns {Promise<any>}
   * @see https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
   */
  const loadJSON = async (src, callback, fetchOptions) => {
    const { baseURL, ignoreErrors } = config
    const id = basename(src)

    src = prepareURL(src, baseURL)

    const eventData = {
      type: "json",
      src,
      id,
    }

    engine.emit("filter-asset", null, eventData)
    modLoading(engine, 1)
    engine.ASSETS["json"] = {}

    const request = fetch(src, fetchOptions)

    request
      .then((res) => res.json())
      .then((data) => {
        ASSETS["json"][id] = data
        eventData.json = data
        if (callback) callback(data)
        engine.emit("asset-load", eventData)
        modLoading(engine, -1)
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
