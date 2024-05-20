export default defineEventHandler(async (event) => {
  const webFeatures = await getWebFeaturesPackageCached(event)
  return webFeatures
})
