import withNuxt from "./.nuxt/eslint.config.mjs"
import { wrapNuxtEslintConfig } from "@lttr/nuxt-config-eslint"

export default wrapNuxtEslintConfig(withNuxt())
