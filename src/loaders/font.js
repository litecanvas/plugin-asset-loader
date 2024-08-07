export default getFontLoader = (engine, { basename, prepareURL }) => {
  return async (fontName, src, callback) => {
    src = prepareURL(src)

    const fontFace = new FontFace(fontName, `url(${src})`)
    const eventData = {
      type: "font",
      fontName,
      src,
      id: basename(src),
    }

    engine.emit("filter-asset", fontFace, eventData)

    document.fonts.add(fontFace)

    engine.setvar("LOADING", engine.LOADING + 1)

    fontFace
      .load()
      .then((fontFace) => {
        callback && callback(fontFace)
        eventData.fontFace = fontFace
        engine.emit("asset-load", eventData)
        engine.setvar("LOADING", engine.LOADING - 1)
      })
      .catch(() => {
        callback && callback(null)
        engine.emit("asset-error", eventData)
      })
  }
}
