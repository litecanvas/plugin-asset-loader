export default getSoundLoader = (
  engine,
  { basename, prepareURL },
  { allowSoundInterruptions, ignoreErrors }
) => {
  return async (src, callback) => {
    src = prepareURL(src)

    const eventData = {
      type: "sound",
      src,
      id: basename(src),
    }

    const sound = new Audio()

    sound.id = eventData.id

    engine.setvar("LOADING", engine.LOADING + 1)

    sound[allowSoundInterruptions ? "oncanplay" : "oncanplaythrough"] = () => {
      callback && callback(sound)
      eventData.asset = sound
      engine.emit("asset-load", eventData)
      engine.setvar("LOADING", engine.LOADING - 1)
    }

    sound.onerror = () => {
      if (!ignoreErrors) {
        throw new Error("Failed to load " + src)
      }
      callback && callback(null)
      engine.emit("asset-error", eventData)
    }

    engine.emit("filter-asset", sound, eventData)

    sound.src = src
    // sound.load()
  }
}

/**
 * Csutom method to stops a sound.
 */
HTMLAudioElement.prototype.stop =
  HTMLAudioElement.prototype.stop ||
  function () {
    this.pause()
    this.currentTime = 0
    this.src = this.src
  }

/**
 * Csutom method to restarts a sound.
 */
HTMLAudioElement.prototype.restart =
  HTMLAudioElement.prototype.restart ||
  function () {
    this.pause()
    this.currentTime = 0
    this.play()
  }
