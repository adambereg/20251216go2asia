export type ConnectDemoBadge = {
  code: string;
  title: string;
  description: string;
  category: 'quest' | 'referral' | 'space' | 'atlas' | 'pulse' | 'go2asia';
  iconKey: string;
};

export type ConnectDemoTransaction = {
  key: string;
  amount: number;
  action:
    | 'registration'
    | 'first_login'
    | 'referral_bonus_referrer'
    | 'event_registration'
    | 'space_post_created'
    | 'quest_completed'
    | 'rielt_listing_created'
    | 'rf_voucher_redeemed';
  sourceService: string;
  sourceEventId: string;
  createdAt: string;
  metadata: Record<string, unknown>;
};

export const CONNECT_DEMO_BADGES: ConnectDemoBadge[] = [
  {
    code: 'welcome_explorer',
    title: 'Welcome Explorer',
    description: 'Started the Go2Asia journey and opened the Connect activity center.',
    category: 'go2asia',
    iconKey: 'badges/welcome-explorer.svg',
  },
  {
    code: 'profile_starter',
    title: 'Profile Starter',
    description: 'Completed the first profile setup steps.',
    category: 'go2asia',
    iconKey: 'badges/profile-starter.svg',
  },
  {
    code: 'first_referral',
    title: 'First Referral',
    description: 'Invited the first friend to Go2Asia.',
    category: 'referral',
    iconKey: 'badges/first-referral.svg',
  },
  {
    code: 'referral_connector',
    title: 'Referral Connector',
    description: 'Helped several invited users become active.',
    category: 'referral',
    iconKey: 'badges/referral-connector.svg',
  },
  {
    code: 'content_starter',
    title: 'Content Starter',
    description: 'Created the first useful activity in the Go2Asia ecosystem.',
    category: 'space',
    iconKey: 'badges/content-starter.svg',
  },
  {
    code: 'atlas_explorer',
    title: 'Atlas Explorer',
    description: 'Explored destination content in Atlas Asia.',
    category: 'atlas',
    iconKey: 'badges/atlas-explorer.svg',
  },
  {
    code: 'pulse_visitor',
    title: 'Pulse Visitor',
    description: 'Joined activity around a Pulse Asia event.',
    category: 'pulse',
    iconKey: 'badges/pulse-visitor.svg',
  },
  {
    code: 'quest_curious',
    title: 'Quest Curious',
    description: 'Completed the first Quest Asia activity.',
    category: 'quest',
    iconKey: 'badges/quest-curious.svg',
  },
  {
    code: 'community_helper',
    title: 'Community Helper',
    description: 'Contributed a helpful action for the community.',
    category: 'space',
    iconKey: 'badges/community-helper.svg',
  },
  {
    code: 'early_spacer',
    title: 'Early Spacer',
    description: 'Joined early community activity in Space Asia.',
    category: 'space',
    iconKey: 'badges/early-spacer.svg',
  },
];

export const CONNECT_DEMO_AWARDED_BADGE_CODES = [
  'welcome_explorer',
  'profile_starter',
  'first_referral',
  'content_starter',
  'quest_curious',
] as const;

export const CONNECT_DEMO_BASE_TRANSACTIONS: ConnectDemoTransaction[] = [
  {
    key: 'welcome',
    amount: 20,
    action: 'registration',
    sourceService: 'points-service',
    sourceEventId: 'connect-demo-welcome',
    createdAt: '2026-04-16T03:00:00.000Z',
    metadata: { label: 'Welcome bonus', demo: true },
  },
  {
    key: 'first-login',
    amount: 10,
    action: 'first_login',
    sourceService: 'points-service',
    sourceEventId: 'connect-demo-first-login',
    createdAt: '2026-04-16T04:00:00.000Z',
    metadata: { label: 'First login', demo: true },
  },
  {
    key: 'profile-starter',
    amount: 15,
    action: 'space_post_created',
    sourceService: 'space-service',
    sourceEventId: 'connect-demo-profile-starter',
    createdAt: '2026-04-17T06:30:00.000Z',
    metadata: { label: 'Profile completion activity', demo: true },
  },
  {
    key: 'pulse-event',
    amount: 25,
    action: 'event_registration',
    sourceService: 'pulse-service',
    sourceEventId: 'connect-demo-pulse-event',
    createdAt: '2026-04-18T09:00:00.000Z',
    metadata: { label: 'Pulse event registration', demo: true },
  },
  {
    key: 'quest-curious',
    amount: 35,
    action: 'quest_completed',
    sourceService: 'quest-service',
    sourceEventId: 'connect-demo-quest-curious',
    createdAt: '2026-04-19T08:20:00.000Z',
    metadata: { label: 'Quest activity completed', demo: true },
  },
  {
    key: 'space-content',
    amount: 18,
    action: 'space_post_created',
    sourceService: 'space-service',
    sourceEventId: 'connect-demo-space-content',
    createdAt: '2026-04-20T05:45:00.000Z',
    metadata: { label: 'Space contribution', demo: true },
  },
  {
    key: 'rf-voucher',
    amount: 12,
    action: 'rf_voucher_redeemed',
    sourceService: 'rf-service',
    sourceEventId: 'connect-demo-rf-voucher',
    createdAt: '2026-04-21T11:00:00.000Z',
    metadata: { label: 'Russian Friendly voucher activity', demo: true },
  },
  {
    key: 'rielt-listing',
    amount: 16,
    action: 'rielt_listing_created',
    sourceService: 'rielt-service',
    sourceEventId: 'connect-demo-rielt-listing',
    createdAt: '2026-04-22T10:15:00.000Z',
    metadata: { label: 'Rielt listing activity', demo: true },
  },
];

