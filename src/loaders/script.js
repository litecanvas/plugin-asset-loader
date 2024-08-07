export default getScriptLoader = (
  engine,
  { basename, prepareURL },
  { crossOrigin }
) => {
  return async (src, callback) => {
    src = prepareURL(src)

    const script = document.createElement("script")
    const eventData = {
      type: "script",
      src,
      id: basename(src),
    }

    script.crossOrigin = crossOrigin

    engine.setvar("LOADING", engine.LOADING + 1)

    script.onload = () => {
      callback && callback(script)
      eventData.script = script
      engine.emit("asset-load", eventData)
      engine.setvar("LOADING", engine.LOADING - 1)
    }
    script.onerror = () => {
      callback && callback(null)
      engine.emit("asset-error", eventData)
    }

    engine.emit("filter-asset", script, eventData)

    script.src = src

    document.head.appendChild(script)
  }
}
