/**
 * No-op mutator for types generation
 * 
 * This mutator is used by Orval to generate types only (no client code).
 */
export const noopMutator = async <T>(_config: unknown, _url: string): Promise<T> => {
  // This should never be called - it's only for type generation
  throw new Error('Types mutator should not be called at runtime');
};

