export default getFontLoader = (engine) => {
  return async (fontName, url, callback) => {
    const fontFace = new FontFace(fontName, `url(${url})`)

    engine.setvar("LOADING", engine.LOADING + 1)

    document.fonts.add(fontFace)
    fontFace
      .load()
      .then((fontFace) => {
        callback && callback(fontFace)
        engine.setvar("LOADING", engine.LOADING - 1)
      })
      .catch(() => {
        callback && callback(null)
      })
  }
}
