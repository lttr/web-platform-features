// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs"
import configPrettier from "eslint-config-prettier"
import pluginVueScopedCSS from "eslint-plugin-vue-scoped-css"
import pluginVueA11y from "eslint-plugin-vuejs-accessibility"

export default withNuxt()
  // Opinionated Vue rules
  // https://eslint.vuejs.org/rules/

  .override("nuxt/vue/rules", {
    name: "nuxt/vue/rules/custom",
    rules: {
      // eslint-plugin-vue uncategorized rules
      "vue/block-lang": ["error", { script: { lang: "ts" } }],
      "vue/block-order": ["error", { order: ["template", "script", "style"] }],
      "vue/block-tag-newline": [
        "error",
        { singleline: "always", multiline: "always", maxEmptyLines: 0 },
      ],
      "vue/component-api-style": ["error", ["script-setup"]],
      "vue/component-name-in-template-casing": ["error", "PascalCase"],
      "vue/custom-event-name-casing": ["error", "camelCase"],
      // This rule would be nice with exception for a component, which only
      // needs emits without arguments.
      // This `defineEmits<{ close: [] }>()` compared to this `defineEmits(["close"])`
      // is overengineering.
      // "vue/define-emits-declaration": ["error", "type-literal"],
      "vue/define-props-declaration": ["error", "type-based"],
      "vue/html-comment-content-spacing": ["error", "always"],
      "vue/no-required-prop-with-default": ["error"],
      "vue/padding-line-between-blocks": ["error", "always"],
      "vue/prefer-define-options": ["error"],
      "vue/prefer-separate-static-class": ["error"],
      "vue/prefer-true-attribute-shorthand": ["error"],
      "vue/require-macro-variable-name": ["error"],
      "vue/require-typed-ref": ["error"],
      "vue/v-for-delimiter-style": ["error", "of"],
    },
  })

  .append(pluginVueScopedCSS.configs["flat/recommended"])

  // eslint-plugin-vuejs-accessibility recommended rules
  // https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/

  .append(pluginVueA11y.configs["flat/recommended"])
  .override("vuejs-accessibility:setup:with-files-rules-and-parser", {
    name: "vuejs-accessibility/custom",
    rules: {
      "vuejs-accessibility/media-has-caption": "off",
      "vuejs-accessibility/label-has-for": "off",
    },
  })

  // eslint-config-prettier
  // https://github.com/prettier/eslint-config-prettier

  .append([
    { ...configPrettier, name: "config-prettier" },
    {
      name: "config-prettier/custom",
      rules: {
        // "curly" is disabled by eslint-config-prettier, but for "all" option there
        // is no conflict
        // https://github.com/prettier/eslint-config-prettier#curly
        curly: ["error", "all"],
        "vue/html-self-closing": [
          "error",
          {
            html: {
              // https://vuejs.org/style-guide/rules-strongly-recommended.html#self-closing-components
              component: "always",
              // https://github.com/prettier/eslint-config-prettier#vuehtml-self-closing
              void: "any",
              // The default normal: "always" conflicts with prettier since the
              // command `eslint --fix` produces `<slot/>` instead of `<slot />`.
              // Another reason to never self close normal element is to not confuse
              // those who don't know about Vue's template parser behavior, but know
              // about browser behavior (browsers expect closing tag for non-void
              // elements, otherwise the tag will not be terminated). Also Svelte
              // since version 5 favors non-self closing tags.
              // https://github.com/sveltejs/svelte/issues/11052
              // https://vuejs.org/guide/essentials/component-basics.html#self-closing-tags
              normal: "never",
            },
          },
        ],
      },
    },
  ])
