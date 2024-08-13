export default getJSONLoader = (engine, { basename, prepareURL }) => {
  return async (src, callback) => {
    src = prepareURL(src)

    const eventData = {
      type: "json",
      src,
      id: basename(src),
    }

    engine.setvar("LOADING", engine.LOADING + 1)

    fetch(src)
      .then((res) => res.json())
      .then((result) => {
        callback && callback(result)
        eventData.asset = result
        engine.emit("asset-load", eventData)
        engine.setvar("LOADING", engine.LOADING - 1)
      })
      .catch(() => {
        callback && callback(null)
        engine.emit("asset-error", eventData)
      })
  }
}
