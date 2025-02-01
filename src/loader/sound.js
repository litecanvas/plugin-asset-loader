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
   * @param {(data:HTMLAudioElement?) => void} [callback]
   * @returns {Promise<HTMLAudioElement>}
   */
  const loadSound = async (src, callback) => {
    const { crossOrigin, ignoreErrors, allowSoundInterruptions, baseURL } =
      config

    src = prepareURL(src, baseURL)

    const sound = new Audio()
    const eventData = {
      asset: sound,
      type: "sound",
      src,
      id: basename(src),
    }

    return new Promise((resolve) => {
      engine.setvar("LOADING", engine.LOADING + 1)
      sound.crossOrigin = crossOrigin

      sound.onerror = () => {
        if (!ignoreErrors) {
          throw new Error("Failed to load " + src)
        }
        if (callback) callback(null)
        engine.emit("asset-error", eventData)
      }

      sound[allowSoundInterruptions ? "oncanplay" : "oncanplaythrough"] =
        () => {
          if (callback) callback(sound)
          engine.emit("asset-load", eventData)
          engine.setvar("LOADING", engine.LOADING - 1)
          resolve(sound)
        }

      engine.emit("filter-asset", sound, eventData)

      sound.src = src
    })
  }

  return {
    loadSound,
  }
}

// custom methods to stop and restart the audio object
Object.assign(HTMLAudioElement.prototype, {
  stop() {
    this.pause()
    this.currentTime = 0
    this.src = this.src
  },
  restart() {
    this.pause()
    this.currentTime = 0
    this.play()
  },
})
