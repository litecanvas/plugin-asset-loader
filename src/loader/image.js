import "litecanvas"
import { basename, prepareURL, defaults, modLoading } from "../utils"

/**
 * @param {LitecanvasInstance} engine
 * @param {typeof defaults} config
 * @returns {object}
 */
export default function plugin(engine, config = {}) {
  config = Object.assign({}, defaults, config)

  modLoading(engine, 0)
  engine.def("ASSETS", engine.ASSETS || {})
  engine.ASSETS["image"] = {}

  /**
   * @param {string} src
   * @param {(image:HTMLImageElement, helpers:object) => void} callback
   * @returns {Promise<HTMLImageElement>}
   */
  const loadImage = async (src, callback) => {
    const { baseURL, ignoreErrors, crossOrigin } = config
    const helpers = {
      splitFrames,
    }
    const id = basename(src)

    src = prepareURL(src, baseURL)

    const image = new Image()
    const eventData = {
      asset: image,
      type: "image",
      src,
      id,
    }

    return new Promise((resolve) => {
      modLoading(engine, 1)
      image.crossOrigin = crossOrigin

      image.onerror = (reason) => {
        console.error(reason)
        const error = "Failed to load image from " + src
        if (!ignoreErrors) {
          throw new Error(error)
        }
        if (callback) callback()
        engine.emit("asset-error", eventData)
      }

      image.onload = () => {
        engine.ASSETS["image"][id] = image
        if (callback) callback(image, helpers)

        engine.emit("asset-load", eventData)
        modLoading(engine, -1)
        resolve(image)
      }

      engine.emit("filter-asset", image, eventData)

      image.src = src
    })
  }

  return {
    loadImage,
  }
}

/**
 * @param {HTMLImageElement|OffscreenCanvas} image
 * @param {number} frameWidth
 * @param {number} frameHeight
 * @param {number} [margin=0]
 * @param {number} [spacing=0]
 * @returns {OffscreenCanvas[]}
 */
function splitFrames(image, frameWidth, frameHeight, margin = 0, spacing = 0) {
  const frames = []

  const cols = Math.floor((image.width + spacing) / (frameWidth + spacing))
  const rows = Math.floor((image.height + spacing) / (frameHeight + spacing))

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const canvas = new OffscreenCanvas(frameWidth, frameHeight)
      canvas
        .getContext("2d")
        .drawImage(
          image,
          margin + j * frameWidth + j * spacing,
          margin + i * frameHeight + i * spacing,
          frameWidth,
          frameHeight,
          0,
          0,
          frameWidth,
          frameHeight
        )
      frames.push(canvas)
    }
  }

  return frames
}
