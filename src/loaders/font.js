export default getFontLoader = (engine, { set }) => {
  return async (fontName, url, callback) => {
    const fontFace = new FontFace(fontName, `url(${url})`)

    set("LOADING", engine.LOADING + 1)

    document.fonts.add(fontFace)
    fontFace
      .load()
      .then((fontFace) => {
        callback && callback(fontFace)
        set("LOADING", engine.LOADING - 1)
      })
      .catch(() => {
        callback && callback(null)
      })
  }
}
