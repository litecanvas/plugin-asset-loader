export default getScriptLoader = (engine, { set }) => {
  return (src, callback) => {
    set("LOADING", engine.LOADING + 1)
    script = document.createElement("script")
    script.onload = () => {
      callback && callback(script)
      set("LOADING", engine.LOADING - 1)
    }
    script.onerror = () => {
      callback && callback(null)
    }
    script.src = src
    document.head.appendChild(script)
  }
}
