import "litecanvas"
import { modLoading } from "../utils"

/**
 * @param {LitecanvasInstance} engine
 * @returns {object}
 */
export default function plugin(engine) {
  /**
   * @param {(resolve:(value?:any)=>void,reject:(reason?:any)=>void)=>void} callback
   * @returns {Promise<any>}
   */
  const load = (callback) => {
    return new Promise((resolve, reject) => {
      modLoading(engine, 1)

      const _resolve = (value) => {
        modLoading(engine, -1)
        return resolve(value)
      }

      callback(_resolve, reject)
    })
  }

  return { load }
}
