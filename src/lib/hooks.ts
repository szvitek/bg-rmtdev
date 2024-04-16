import { useEffect, useState } from 'react';
import { JobItem, JobItemExtended } from './types';
import { BASE_API_URL } from './constants';

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

export function useJobItem(id: number | null) {
  const [jobItem, setJobItem] = useState<JobItemExtended | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(`${BASE_API_URL}/${id}`);
      const data = await response.json();
      setIsLoading(false);
      setJobItem(data.jobItem);
    };

    fetchData();
  }, [id]);

  return { jobItem, isLoading } as const;
}

/*
technically we could combine these 2 hooks into 1 single hook
function useActiveJobItem() {
  const activeId = useActiveId();
  const jobItem = useJobItem(activeId);

  return jobItem;
}
*/

export function useJobItems(searchText: string) {
  const [jobItems, setJobItems] = useState<JobItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const totalNumberOfResults = jobItems.length;
  const jobItemsSliced = jobItems.slice(0, 7);

  useEffect(() => {
    if (!searchText) return;

    // react recommends to do data fetching in the event handler
    // if it's related to some event just in our case
    // but we do it like this because it will be  refactored later anyway
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch(`${BASE_API_URL}?search=${searchText}`);
      const data = await response.json();
      setIsLoading(false);
      setJobItems(data.jobItems);
    };

    fetchData();
  }, [searchText]);

  return { jobItemsSliced, isLoading, totalNumberOfResults } as const;
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
