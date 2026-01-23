import { TORT } from '@/generated/prisma';
import { useEffect, useState } from 'react';

export function useDebounce(value: string, delay = 800): string {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
export function useDebounceTort(value: TORT | undefined, delay = 800): TORT | undefined {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}
