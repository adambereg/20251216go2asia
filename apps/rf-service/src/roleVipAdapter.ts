// Experimental Slice 6.14 preview-only Role/VIP adapter implementation.
// This adapter is RF-local, default-off through route flags, and not wired into claim runtime.

import {
  executeRoleVipAdapterContract,
  type RoleVipAdapter,
  type RoleVipAdapterExecutionResult,
  type RoleVipAdapterInput,
} from './roleVipAdapterInterface';

export const roleVipPreviewAdapter: RoleVipAdapter = {
  id: 'role-vip-preview-adapter',
  execute(input: RoleVipAdapterInput): RoleVipAdapterExecutionResult {
    const execution = executeRoleVipAdapterContract(input);

    return {
      ...execution,
      output: {
        ...execution.output,
        health: execution.output.health === 'fixture_only' ? 'healthy' : execution.output.health,
      },
    };
  },
};

