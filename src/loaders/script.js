export default getScriptLoader = (engine) => {
  return (src, callback) => {
    engine.setvar("LOADING", engine.LOADING + 1)
    script = document.createElement("script")
    image.crossOrigin = "anonymous"
    script.onload = () => {
      callback && callback(script)
      engine.setvar("LOADING", engine.LOADING - 1)
    }
    script.onerror = () => {
      callback && callback(null)
    }
    script.src = src
    document.head.appendChild(script)
  }
}
