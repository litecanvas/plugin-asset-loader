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

  engine.setvar("LOADING", engine.LOADING || 0)
  engine.setvar("ASSETS", engine.ASSETS || {})
  engine.ASSETS["sound"] = {}

  /**
   * @param {string} src
   * @param {(data:HTMLAudioElement?) => void} [callback]
   * @returns {Promise<HTMLAudioElement>}
   */
  const loadSound = async (src, callback) => {
    const { crossOrigin, ignoreErrors, allowSoundInterruptions, baseURL } =
      config
    const id = basename(src)

    src = prepareURL(src, baseURL)

    const sound = new Audio()
    const eventData = {
      asset: sound,
      type: "sound",
      src,
      id,
    }

    return new Promise((resolve) => {
      modLoading(engine, 1)
      sound.crossOrigin = crossOrigin

      sound.onerror = (reason) => {
        console.error(reason)
        if (!ignoreErrors) {
          throw new Error("Failed to load " + src)
        }
        if (callback) callback(null)
        engine.emit("asset-error", eventData)
      }

      sound[allowSoundInterruptions ? "oncanplay" : "oncanplaythrough"] =
        () => {
          engine.ASSETS["sound"][id] = sound
          if (callback) callback(sound)
          engine.emit("asset-load", eventData)
          modLoading(engine, -1)
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
