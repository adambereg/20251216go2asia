import { describe, expect, it } from 'vitest';
import { CONNECT_RF_DASHBOARD_VOUCHERS_QUERY_KEY } from './connectRfQueryContract';

describe('Connect RF dashboard query contract', () => {
  it('keeps one canonical vouchers list query key', () => {
    expect(CONNECT_RF_DASHBOARD_VOUCHERS_QUERY_KEY).toStrictEqual(['rf', 'me', 'vouchers', 'connect']);
  });

  it('does not use deprecated dashboard vouchers query key segments', () => {
    const keyText = CONNECT_RF_DASHBOARD_VOUCHERS_QUERY_KEY.join('/');
    expect(keyText).not.toContain('connect-summary');
    expect(keyText).not.toContain('connect-projection');
  });
});
