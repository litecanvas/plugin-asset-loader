import { defaults } from "../utils"
import {
  pluginFontLoader,
  pluginScriptLoader,
  pluginImageLoader,
  pluginSoundLoader,
  pluginJsonLoader,
  pluginGenericLoader,
} from ".."

/**
 * @param {LitecanvasInstance} engine
 * @param {typeof defaults} [config]
 */
export default function plugin(engine, config = {}) {
  engine.use(pluginFontLoader, config)
  engine.use(pluginImageLoader, config)
  engine.use(pluginScriptLoader, config)
  engine.use(pluginSoundLoader, config)
  engine.use(pluginJsonLoader, config)
  engine.use(pluginGenericLoader)
}
