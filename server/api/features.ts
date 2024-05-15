import webFeatures from "web-features"

export default defineEventHandler(() => {
  return Object.entries(webFeatures).map(([key, value]) => ({
    id: key,
    ...value,
  }))
})
