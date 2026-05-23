/**
 * Space Asia - Components Index
 * Центральный экспорт всех компонентов модуля
 */

// Types
export * from './types';

// Mock data is intentionally not exported from the public module barrel.
// Stage 12 requires mock/demo data to stay explicitly imported and never act as fallback/proof.

// Feed Components
export * from './Feed';

// Groups Components
export * from './Groups';

// Profile Components
export * from './Profile';

// Dashboard Components
export * from './Dashboard';

// Posts Components
export * from './Posts';

// Quests Components
export * from './Quests';

// Vouchers Components
export * from './Vouchers';

// Stage 12I-D3: mock-heavy Balance/NFT legacy views are intentionally not
// re-exported from the public Space barrel. Import explicit deferred sub-barrels
// only for compatibility or quarantine work; never wire them into app routes.

// Referrals Components
export * from './Referrals';

// Settings Components
export * from './Settings';

// Shared Components
export * from './Shared';

