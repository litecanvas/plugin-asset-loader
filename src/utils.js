import "litecanvas"

/**
 * Returns the file name (without extension) of a path.
 *
 * @param {string} path
 * @returns {string} the file name
 */
export function basename(path) {
  return path.split("\\").pop().split("/").pop().split(".")[0]
}

/**
 * @param {string} url
 * @param {string} [baseURL]
 * @returns {string}
 */
export function prepareURL(url, baseURL) {
  if (baseURL && !hasProtocol(url)) {
    url = baseURL + url
  }
  return url
}

/**
 * @param {string} url
 * @returns {boolean}
 */
function hasProtocol(url) {
  try {
    const u = new URL(url)
    return !!u.protocol
  } catch (e) {}
  return false
}

export const defaults = {
  /** @type {string?} */
  crossOrigin: "anonymous",
  /** @type {string?} */
  baseURL: null,
  /** @type {boolean?} */
  allowSoundInterruptions: true,
  /** @type {boolean?} */
  ignoreErrors: false,
}

/**
 * @param {LitecanvasInstance} engine
 * @param {number} value
 */
export const modLoading = (engine, value) => {
  const key = "LOADING"
  engine.setvar(key, ~~engine[key] + ~~value)
}
