export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost'

export type FollowupStatus = 'pending' | 'completed' | 'cancelled'

export type LeadSource =
  | 'Website'
  | 'Phone Call'
  | 'Walk-in'
  | 'Referral'
  | 'Social Media'
  | 'Email'
  | 'Other'

export const LEAD_STATUSES: LeadStatus[] = [
  'New',
  'Contacted',
  'Qualified',
  'Converted',
  'Lost',
]

export const LEAD_SOURCES: LeadSource[] = [
  'Website',
  'Phone Call',
  'Walk-in',
  'Referral',
  'Social Media',
  'Email',
  'Other',
]

export const LOSS_REASONS = [
  'Fee too high / financial constraint',
  'Joined competitor institute',
  'Location / travel distance',
  'Batch timings unsuitable',
  'Course content not aligned with goal',
  'Decided not to pursue course now',
  'Unreachable / no response after 3+ attempts',
  'Other reason',
] as const

export type LossReason = (typeof LOSS_REASONS)[number]
