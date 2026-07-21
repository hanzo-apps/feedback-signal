import type { BaseRecord } from '@hanzo/base/react'

/** One row of the `feedback` collection (schema.sql). */
export interface Feedback extends BaseRecord {
  source: string
  body: string
  sentiment: string
  theme: string
  status: string
  received_at: string
}

/** One row of the `themes` collection (schema.sql). */
export interface Theme extends BaseRecord {
  name: string
  color: string
}
