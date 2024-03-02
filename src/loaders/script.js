export default getScriptLoader = (engine, { set }) => {
  return (src, cb) => {
    set("LOADING", engine.LOADING + 1)
    fetch(src)
      .then((response) => {
        if (!response.ok) {
          return null
        }
        return response.text()
      })
      .then((text) => {
        let script = null
        if (text) {
          script = document.createElement("script")
          script.innerHTML = text
          script.dataset.src = src
          document.head.appendChild(script)
        }
        if ("function" === typeof cb) cb(script)
        set("LOADING", engine.LOADING - 1)
      })
  }
}
