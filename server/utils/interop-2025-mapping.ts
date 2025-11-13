/**
 * Mapping of Interop 2025 focus areas to web-features IDs
 * Based on https://github.com/web-platform-tests/interop/blob/main/2025/README.md
 */
export const interop2025Mapping: Record<string, string[]> = {
  "backdrop-filter": ["backdrop-filter"],
  "core-web-vitals": [], // LCP/INP metrics, not feature-based
  "css-anchor-positioning": ["anchor-positioning"],
  details: ["details", "details-content"],
  layout: ["grid", "flexbox", "subgrid"],
  modules: [], // JSON module scripts - may not have web-features ID yet
  "navigation-api": ["navigation-api"],
  "pointer-and-mouse-events": ["pointer-events"],
  "remove-mutation-events": [], // Removal effort, not a feature
  scope: ["css-at-rule-scope"],
  scrollend: ["scrollend"],
  "storage-access-api": ["storage-access"],
  "text-decoration": ["text-decoration"],
  urlpattern: ["urlpattern"],
  "view-transitions": ["view-transitions", "view-transition-class"],
  webassembly: [], // Multiple WASM features
  "web-compat": [], // Multiple compat fixes
  webrtc: ["webrtc-encoded-transform"],
  "writing-modes": ["writing-modes"],
}

/**
 * Get all web-features IDs that are part of Interop 2025
 */
export function getInterop2025FeatureIds(): Set<string> {
  const ids = new Set<string>()
  for (const featureIds of Object.values(interop2025Mapping)) {
    for (const id of featureIds) {
      ids.add(id)
    }
  }
  return ids
}
