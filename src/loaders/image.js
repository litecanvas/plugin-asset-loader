export default getImageLoader = (engine, { set }) => {
  return (src, cb) => {
    set("LOADING", engine.LOADING + 1)
    const image = new Image()
    image.onload = () => {
      cb(image)
      set("LOADING", engine.LOADING - 1)
    }
    image.onerror = function () {
      cb(null)
      set("LOADING", engine.LOADING - 1)
    }
    image.src = src
  }
}
