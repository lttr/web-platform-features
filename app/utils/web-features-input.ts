import { z } from "zod"

const browserIdentifierSchema = z.union([
  z.literal("chrome"),
  z.literal("chrome_android"),
  z.literal("edge"),
  z.literal("firefox"),
  z.literal("firefox_android"),
  z.literal("safari"),
  z.literal("safari_ios"),
])

const baselineHighLowSchema = z.union([z.literal("high"), z.literal("low")])

const supportStatusSchema = z.object({
  baseline: z.union([baselineHighLowSchema, z.literal(false)]),
  baseline_low_date: z.string().optional(),
  baseline_high_date: z.string().optional(),
  support: z.record(browserIdentifierSchema, z.string()),
})

// groups: z.record(
//   z.string(),
//   z.object({ name: z.string(), parent: z.string().optional() }),
// )

// snapshots: z.record(
//   z.string(),
//   z.object({ name: z.string(), spec: z.string() }),
// )

const featureDataSchema = z.object({
  alias: z.union([z.string(), z.array(z.string())]).optional(),
  caniuse: z.union([z.string(), z.array(z.string())]).optional(),
  compat_features: z.array(z.string()).optional(),
  description: z.string(),
  description_html: z.string(),
  group: z.union([z.string(), z.array(z.string())]).optional(),
  name: z.string(),
  spec: z.union([z.string(), z.array(z.string())]),
  status: supportStatusSchema,
  usage_stats: z.union([z.string(), z.array(z.string())]).optional(),
})

export const WebFeatureInputSchema = featureDataSchema
export const WebFeaturesRecordInputSchema = z.record(featureDataSchema)

export type WebFeatureInput = z.infer<typeof WebFeatureInputSchema>

export interface WebFeatureInputWithId extends WebFeatureInput {
  id: string
}
