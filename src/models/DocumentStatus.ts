export type DocumentStatus =
  (typeof DocumentStatus)[keyof typeof DocumentStatus];

export const DocumentStatus = {

  Pending: "PENDING",

  Rejected: "REJECTED",

  Approved: "APPROVED"

} as const;