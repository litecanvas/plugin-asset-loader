import "litecanvas"

/**
 * @param {LitecanvasInstance} engine
 * @returns {object}
 */
export default function plugin(engine) {
  engine.setvar("LOADING", engine.LOADING || 0)

  /**
   * @param {(resolve:(value?:any)=>void,reject:(reason?:any)=>void)=>void} callback
   * @returns {Promise<any>}
   */
  const load = (callback) => {
    return new Promise((resolve, reject) => {
      engine.setvar("LOADING", ++engine.LOADING)

      const _resolve = (value) => {
        engine.setvar("LOADING", --engine.LOADING)
        return resolve(value)
      }

      callback(_resolve, reject)
    })
  }

  return { load }
}
