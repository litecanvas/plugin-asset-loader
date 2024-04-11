export default getImageLoader = (engine, { set }) => {
  return (src, callback) => {
    set("LOADING", engine.LOADING + 1)
    const image = new Image()
    image.onload = () => {
      callback && callback(image)
      set("LOADING", engine.LOADING - 1)
    }
    image.onerror = function () {
      callback && callback(null)
    }
    image.src = src
  }
}
