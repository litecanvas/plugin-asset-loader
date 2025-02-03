import "litecanvas"
import { basename, prepareURL, defaults } from "../utils"

/**
 * @param {LitecanvasInstance} engine
 * @param {LitecanvasPluginHelpers} h
 * @param {typeof defaults} config
 * @returns {object}
 */
export default function plugin(engine, { colors }, config = {}) {
  config = Object.assign({}, defaults, config)

  engine.setvar("LOADING", engine.LOADING || 0)
  engine.setvar("ASSETS", engine.ASSETS || {})
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
      convertColors: createColorConveter(colors),
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
      engine.setvar("LOADING", ++engine.LOADING)
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
        engine.setvar("LOADING", --engine.LOADING)
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

/**
 * @param {string[]} colors the color palette
 * @returns
 */
function createColorConveter(colors) {
  /**
   * @param {HTMLImageElement|OffscreenCanvas} image
   * @param {boolean} [alpha=false] set true to preserve each pixel opacity
   * @returns {OffscreenCanvas}
   */
  return (image, alpha = false) => {
    const canvas = new OffscreenCanvas(image.width, image.height)
    const ctx = canvas.getContext("2d")

    ctx.drawImage(image, 0, 0)

    const imgData = ctx.getImageData(0, 0, image.width, image.height)
    const pixels = imgData.data
    /** @type {Map<string,string>} */
    const cache = new Map()

    // Loop over each pixel and invert the color.
    for (let i = 0, n = pixels.length; i < n; i += 4) {
      const r = pixels[i] // red
      const g = pixels[i + 1] // green
      const b = pixels[i + 2] // blue

      const currentcolor = [r, g, b]
      const key = currentcolor.join(",")
      // search in cache before
      let c = cache.get(key)
      if (!c) {
        c = closestColor(currentcolor, colors)
        cache.set(key, c)
      }

      const newcolor = c.startsWith("#") ? hex2rgb(c) : rgb2rgb(c)
      pixels[i] = newcolor[0]
      pixels[i + 1] = newcolor[1]
      pixels[i + 2] = newcolor[2]
      pixels[i + 3] = alpha ? pixels[i + 3] : 255
    }

    ctx.putImageData(imgData, 0, 0)

    return canvas
  }
}

/**
 * Convert Hex color to RGB values
 *
 * @param {string} h the hex color
 * @returns {number[]}
 */
function hex2rgb(colorCode) {
  let r = 0,
    g = 0,
    b = 0

  if (colorCode.length === 4) {
    // 3 digits (e.g. #FFF)
    r = "0x" + colorCode[1] + colorCode[1]
    g = "0x" + colorCode[2] + colorCode[2]
    b = "0x" + colorCode[3] + colorCode[3]
  } else if (colorCode.length === 7) {
    // 6 digits  (e.g. #EFEFEF)
    r = "0x" + colorCode[1] + colorCode[2]
    g = "0x" + colorCode[3] + colorCode[4]
    b = "0x" + colorCode[5] + colorCode[6]
  }

  return [~~r, ~~g, ~~b]
}

function rgb2rgb(rgb) {
  // Choose correct separator
  let sep = rgb.indexOf(",") > -1 ? "," : " "
  // Turn "rgb(r,g,b)" into [r,g,b]
  rgb = rgb.substr(4).split(")")[0].split(sep)

  let r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16)

  if (r.length === 1) r = "0" + r
  if (g.length === 1) g = "0" + g
  if (b.length === 1) b = "0" + b

  return [r | 0, g | 0, b | 0]
}

/**
 * @param {number[]} targetColor
 * @param {string[]} palette
 * @returns string
 */
function closestColor(targetColor, palette) {
  let closestDistance = Infinity
  let result = null

  // Convert target color from hex string to RGB values
  const [r1, g1, b1] = targetColor

  // Loop through the array of colors
  palette.forEach((color) => {
    // Convert current color from hex string to RGB values
    const [r2, g2, b2] = color.startsWith("#") ? hex2rgb(color) : rgb2rgb(color)

    // Calculate the Euclidean distance between the target color and current color
    const distance = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)

    // Update closest color and distance if the current distance is smaller than the closest distance
    if (distance < closestDistance) {
      closestDistance = distance
      result = color
    }
  })

  return result
}
