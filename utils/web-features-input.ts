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

const featureDataSchema = z.object({
  name: z.string(),
  description: z.string(),
  description_html: z.string(),
  alias: z.union([z.string(), z.array(z.string())]).optional(),
  spec: z.union([z.string(), z.array(z.string())]),
  caniuse: z.union([z.string(), z.array(z.string())]).optional(),
  status: supportStatusSchema,
  compat_features: z.array(z.string()).optional(),
  usage_stats: z.union([z.string(), z.array(z.string())]).optional(),
})

export const WebFeatureInputSchema = featureDataSchema
export const WebFeaturesRecordInputSchema = z.record(featureDataSchema)

export type WebFeatureInput = z.infer<typeof WebFeatureInputSchema>

export interface WebFeatureInputWithId extends WebFeatureInput {
  id: string
}
