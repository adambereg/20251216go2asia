export function makeReferralFirstLoginExternalId(referrerId: string, refereeId: string): string {
  return `referral:first_login:${referrerId}:${refereeId}`;
}

export function buildReferrerFirstLoginBonusPointsInput(input: {
  referrerId: string;
  refereeId: string;
  bonus: number;
}): {
  userId: string;
  amount: number;
  action: 'referral_bonus_referrer';
  externalId: string;
  sourceEventId: string;
  metadata: { refereeUserId: string };
} {
  const externalId = makeReferralFirstLoginExternalId(input.referrerId, input.refereeId);
  return {
    userId: input.referrerId,
    amount: input.bonus,
    action: 'referral_bonus_referrer',
    externalId,
    sourceEventId: externalId,
    metadata: { refereeUserId: input.refereeId },
  };
}



