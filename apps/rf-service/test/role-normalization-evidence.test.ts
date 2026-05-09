import { describe, expect, it } from 'vitest';

import { createRoleNormalizationEvidenceSnapshot, type RoleEvidenceInput } from '../src/roleNormalizationEvidence';

type EvidenceCase = {
  id: string;
  input: RoleEvidenceInput;
  expected: {
    gatewayRole: string;
    gatewaySource: string;
    rfRole: string;
    claimVip: boolean;
    previewVip: boolean;
    previewState: string;
    alignment: string;
    roleClaimConflictsWithRoles: boolean;
    vipAliasOnlyInRoles: boolean;
    rolesOrderSensitive: boolean;
  };
};

const stagingLikeCases: EvidenceCase[] = [
  {
    id: 'top-level-vip-alias-aligns',
    input: { role: 'vip', roles: ['member'] },
    expected: {
      gatewayRole: 'vip_spacer',
      gatewaySource: 'role',
      rfRole: 'vip_spacer',
      claimVip: true,
      previewVip: true,
      previewState: 'available',
      alignment: 'aligned',
      roleClaimConflictsWithRoles: true,
      vipAliasOnlyInRoles: false,
      rolesOrderSensitive: false,
    },
  },
  {
    id: 'role-spacer-roles-vip-alias-diverges',
    input: { role: 'spacer', roles: ['VIP'] },
    expected: {
      gatewayRole: 'spacer',
      gatewaySource: 'role',
      rfRole: 'spacer',
      claimVip: false,
      previewVip: true,
      previewState: 'available',
      alignment: 'preview_grants_claim_rejects',
      roleClaimConflictsWithRoles: true,
      vipAliasOnlyInRoles: true,
      rolesOrderSensitive: false,
    },
  },
  {
    id: 'role-spacer-roles-vip-spacer-aligns-by-claim-array-literal',
    input: { role: 'spacer', roles: ['vip_spacer'] },
    expected: {
      gatewayRole: 'spacer',
      gatewaySource: 'role',
      rfRole: 'spacer',
      claimVip: true,
      previewVip: true,
      previewState: 'available',
      alignment: 'aligned',
      roleClaimConflictsWithRoles: true,
      vipAliasOnlyInRoles: false,
      rolesOrderSensitive: false,
    },
  },
  {
    id: 'roles-order-can-hide-admin-platform-role',
    input: { roles: ['member', 'admin'] },
    expected: {
      gatewayRole: 'spacer',
      gatewaySource: 'roles[]',
      rfRole: 'spacer',
      claimVip: false,
      previewVip: false,
      previewState: 'requires_condition',
      alignment: 'aligned',
      roleClaimConflictsWithRoles: true,
      vipAliasOnlyInRoles: false,
      rolesOrderSensitive: true,
    },
  },
  {
    id: 'go2-role-precedes-public-metadata-and-roles',
    input: { go2_role: 'pro', public_metadata: { role: 'vip_spacer' }, roles: ['vip_spacer'] },
    expected: {
      gatewayRole: 'pro',
      gatewaySource: 'go2_role',
      rfRole: 'pro',
      claimVip: true,
      previewVip: true,
      previewState: 'available',
      alignment: 'aligned',
      roleClaimConflictsWithRoles: true,
      vipAliasOnlyInRoles: false,
      rolesOrderSensitive: false,
    },
  },
  {
    id: 'public-metadata-role-is-used-when-root-claims-missing',
    input: { public_metadata: { role: 'vip-spacer' }, roles: ['member'] },
    expected: {
      gatewayRole: 'vip_spacer',
      gatewaySource: 'public_metadata.role',
      rfRole: 'vip_spacer',
      claimVip: true,
      previewVip: true,
      previewState: 'available',
      alignment: 'aligned',
      roleClaimConflictsWithRoles: true,
      vipAliasOnlyInRoles: false,
      rolesOrderSensitive: false,
    },
  },
  {
    id: 'missing-role-defaults-to-spacer',
    input: {},
    expected: {
      gatewayRole: 'spacer',
      gatewaySource: 'default_spacer',
      rfRole: 'spacer',
      claimVip: false,
      previewVip: false,
      previewState: 'requires_condition',
      alignment: 'aligned',
      roleClaimConflictsWithRoles: false,
      vipAliasOnlyInRoles: false,
      rolesOrderSensitive: false,
    },
  },
  {
    id: 'malformed-role-falls-through-to-roles',
    input: { role: 42, roles: ['vip'] },
    expected: {
      gatewayRole: 'vip_spacer',
      gatewaySource: 'roles[]',
      rfRole: 'vip_spacer',
      claimVip: true,
      previewVip: true,
      previewState: 'available',
      alignment: 'aligned',
      roleClaimConflictsWithRoles: false,
      vipAliasOnlyInRoles: true,
      rolesOrderSensitive: false,
    },
  },
];

describe('Role normalization staging evidence snapshots', () => {
  it('captures gateway RF preview and claim normalization outcomes without identity payloads', () => {
    for (const item of stagingLikeCases) {
      const snapshot = createRoleNormalizationEvidenceSnapshot(item.input);

      expect(snapshot.schemaVersion, item.id).toBe(1);
      expect(snapshot.containsRawJwt, item.id).toBe(false);
      expect(snapshot.containsPii, item.id).toBe(false);
      expect(JSON.stringify(snapshot), item.id).not.toMatch(/email|wallet|nft|g2a|secret|session/i);
      expect(snapshot.gateway.platformRole, item.id).toBe(item.expected.gatewayRole);
      expect(snapshot.gateway.roleSource, item.id).toBe(item.expected.gatewaySource);
      expect(snapshot.rfAuth.platformRole, item.id).toBe(item.expected.rfRole);
      expect(snapshot.claimGate.isVipSpacer, item.id).toBe(item.expected.claimVip);
      expect(snapshot.previewAdapter.isVip, item.id).toBe(item.expected.previewVip);
      expect(snapshot.previewAdapter.state, item.id).toBe(item.expected.previewState);
      expect(snapshot.divergence, item.id).toMatchObject({
        alignment: item.expected.alignment,
        roleClaimConflictsWithRoles: item.expected.roleClaimConflictsWithRoles,
        vipAliasOnlyInRoles: item.expected.vipAliasOnlyInRoles,
        rolesOrderSensitive: item.expected.rolesOrderSensitive,
      });
    }
  });

  it('documents the unresolved preview-vs-claim divergence for VIP aliases in roles array', () => {
    const snapshot = createRoleNormalizationEvidenceSnapshot({ role: 'spacer', roles: ['VIP'] });

    expect(snapshot.gateway).toMatchObject({
      platformRole: 'spacer',
      roleSource: 'role',
      forwardedRoles: ['VIP'],
    });
    expect(snapshot.claimGate).toMatchObject({
      isVipSpacer: false,
      exactVipSpacerRoleInArray: false,
    });
    expect(snapshot.previewAdapter).toMatchObject({
      isVip: true,
      state: 'available',
      reasonCode: 'entitlement_granted',
    });
    expect(snapshot.divergence).toMatchObject({
      alignment: 'preview_grants_claim_rejects',
      vipAliasOnlyInRoles: true,
    });
  });
});

