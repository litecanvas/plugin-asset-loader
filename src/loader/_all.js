import { defaults } from "../utils"
import {
  pluginFontLoader,
  pluginScriptLoader,
  pluginImageLoader,
  pluginSoundLoader,
  pluginJsonLoader,
} from ".."

/**
 * @param {LitecanvasInstance} engine
 * @param {LitecanvasPluginHelpers} h
 * @param {typeof defaults} [config]
 */
export default function plugin(engine, h, config = {}) {
  engine.use(pluginFontLoader, config)
  engine.use(pluginImageLoader, config)
  engine.use(pluginScriptLoader, config)
  engine.use(pluginSoundLoader, config)
  engine.use(pluginJsonLoader, config)
}
