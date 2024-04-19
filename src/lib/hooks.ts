import { useContext, useEffect, useState } from 'react';
import { JobItem, JobItemExtended } from './types';
import { BASE_API_URL } from './constants';
import { useQueries, useQuery } from '@tanstack/react-query';
import { BookmarksContext } from '../contexts/BookmarksContext';

type JobItemApiResponse = {
  public: boolean;
  jobItem: JobItemExtended;
};

const fetchJobItem = async (id: number): Promise<JobItemApiResponse> => {
  const response = await fetch(`${BASE_API_URL}/${id}`);

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data;
};

export function useJobItem(id: number | null) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['job-item', id],
    queryFn: () => (id ? fetchJobItem(id) : null),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!id, // fetch on mount? only if id is truthy
  });

  return { jobItem: data?.jobItem, isLoading, error } as const;
}

export function useJobItems(ids: number[]) {
  const results = useQueries({
    queries: ids.map((id) => ({
      queryKey: ['job-item', id],
      queryFn: () => fetchJobItem(id),
      staleTime: 1000 * 60 * 60, // 1 hour
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id), // fetch on mount? only if id is truthy
    })),
  });

  const jobItems = results
    .map((result) => result.data?.jobItem)
    .filter((jobItem) => !!jobItem) as JobItemExtended[];
  const isLoading = results.some((result) => result.isLoading);

  return {
    jobItems,
    isLoading,
  };
}

type JobItemsApiResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: JobItem[];
};

const fetchJobItems = async (
  searchText: string
): Promise<JobItemsApiResponse> => {
  const response = await fetch(`${BASE_API_URL}?search=${searchText}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }
  const data = await response.json();
  return data;
};

export function useSearchQuery(searchText: string) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['job-items', searchText],
    queryFn: () => fetchJobItems(searchText),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
    retry: false,
    enabled: !!searchText, // fetch on mount? only if searchText is truthy
  });

  return { jobItems: data?.jobItems, isLoading, error } as const;
}

// useDebounce
// JS: https://github.com/uidotdev/usehooks/blob/main/index.js#L239
// TS: https://github.com/juliencrn/usehooks-ts/blob/usehooks-ts%402.16.0/packages/usehooks-ts/src/useDebounce/useDebounce.ts
export function useDebounce<T>(value: T, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useActiveId() {
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const id = +window.location.hash.slice(1);
      setActiveId(id);
    };

    // for the initial load when there is no change event,
    // but we still need to know the id
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return activeId;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const getItemsFromLocalStorage = () =>
    JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue));

  const [value, setValue] = useState<T>(getItemsFromLocalStorage);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}

export function useBookmarksContext() {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error(
      'useBookmarksContext must be used within a BookmarksContextProvider'
    );
  }

  return context;
}
