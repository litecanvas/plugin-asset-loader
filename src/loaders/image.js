export default getImageLoader = (engine) => {
  return (src, callback) => {
    engine.setvar("LOADING", engine.LOADING + 1)
    const image = new Image()
    image.onload = () => {
      callback && callback(image)
      engine.setvar("LOADING", engine.LOADING - 1)
    }
    image.onerror = function () {
      callback && callback(null)
    }
    image.src = src
  }
}
