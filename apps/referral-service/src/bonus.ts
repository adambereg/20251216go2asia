export function makeReferralLockedExternalId(referrerId: string, refereeId: string): string {
  return `referral:locked:${referrerId}:${refereeId}`;
}

export function buildReferrerLockedPointsInput(input: {
  referrerId: string;
  refereeId: string;
  amount: number;
}): {
  userId: string;
  amount: number;
  action: 'referral_locked';
  externalId: string;
  sourceEventId: string;
  metadata: { refereeUserId: string; bucket: 'locked' };
} {
  const externalId = makeReferralLockedExternalId(input.referrerId, input.refereeId);
  return {
    userId: input.referrerId,
    amount: input.amount,
    action: 'referral_locked',
    externalId,
    sourceEventId: externalId,
    metadata: { refereeUserId: input.refereeId, bucket: 'locked' },
  };
}
