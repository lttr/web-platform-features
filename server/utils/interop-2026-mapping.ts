/**
 * Mapping of Interop 2026 focus areas to web-features IDs
 * Based on https://github.com/web-platform-tests/interop/blob/main/2026/README.md
 */
export const interop2026Mapping: Record<string, string[]> = {
  "container-style-queries": ["container-style-queries"],
  "css-anchor-positioning": ["anchor-positioning"],
  "css-attr": ["attr"],
  "css-contrast-color": ["contrast-color"],
  "css-zoom": ["zoom"],
  "custom-highlights": ["highlight", "highlightsfrompoint"],
  "dialogs-and-popovers": ["dialog", "popover"],
  "fetch-uploads-and-ranges": ["fetch", "fetch-request-streams"],
  indexeddb: ["indexeddb"],
  "jspi-for-wasm": [], // WebAssembly JS Promise Integration - no web-features ID yet
  "media-pseudo-classes": ["media-pseudos"],
  "navigation-api": ["navigation"],
  "scoped-custom-element-registries": ["scoped-custom-element-registries"],
  "scroll-driven-animations": ["scroll-driven-animations"],
  "scroll-snap": ["scroll-snap"],
  "css-shape": [], // CSS shape() function - no web-features ID yet
  "view-transitions": [
    "view-transitions",
    "view-transition-class",
    "cross-document-view-transitions",
  ],
  "web-compat": [], // Multiple compat fixes
  webrtc: ["webrtc"],
  webtransport: ["webtransport"],
}

/**
 * Get all web-features IDs that are part of Interop 2026
 */
export function getInterop2026FeatureIds(): Set<string> {
  const ids = new Set<string>()
  for (const featureIds of Object.values(interop2026Mapping)) {
    for (const id of featureIds) {
      ids.add(id)
    }
  }
  return ids
}
