import { useCallback } from 'react';
import { useCurrentActor } from '../../auth/useCurrentActor';
import { useWorkspaceData } from '../../company-workspace/hooks/useWorkspaceData';

export function useUniversityOverview(useCases) {
  const actor = useCurrentActor();
  const load = useCallback(() => useCases.getOverview(actor), [useCases, actor]);
  return { actor, ...useWorkspaceData(load) };
}
