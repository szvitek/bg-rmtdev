import { ReactNode, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { RESULTS_PER_PAGE } from '../lib/constants';
import { useSearchQuery, useSearchTextContext } from '../lib/hooks';
import { SortingOptions, PageDirection, JobItem } from '../lib/types';
import { handleError } from '../lib/utils';

type JobItemsContext = {
  jobItems: JobItem[] | undefined;
  jobItemsSortedAndSliced: JobItem[];
  isLoading: boolean;
  totalNumberOfResults: number;
  totalNumberOfPages: number;
  currentPage: number;
  sortBy: SortingOptions;
  handleChangePage: (direction: PageDirection) => void;
  handleChangeSortBy: (newSort: SortingOptions) => void;
};

export const JobItemsContext = createContext<JobItemsContext | null>(null);

export default function JobItemsContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { debouncedSearchText } = useSearchTextContext();

  // state / hooks
  const { jobItems, isLoading, error } = useSearchQuery(debouncedSearchText);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortingOptions>('relevant');

  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error]);

  // derived / computed state
  const totalNumberOfResults = jobItems?.length || 0;
  const totalNumberOfPages = Math.ceil(totalNumberOfResults / RESULTS_PER_PAGE);
  const jobItemsSorted = useMemo(
    () =>
      [...(jobItems || [])].sort((a, b) => {
        if (sortBy === 'relevant') {
          return b.relevanceScore - a.relevanceScore;
        } else if (sortBy === 'recent') {
          return a.daysAgo - b.daysAgo;
        }

        return 0;
      }),
    [jobItems, sortBy]
  );
  const jobItemsSortedAndSliced = useMemo(
    () =>
      jobItemsSorted.slice(
        currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
        currentPage * RESULTS_PER_PAGE
      ),
    [currentPage, jobItemsSorted]
  );

  // event handlers / actions
  const handleChangePage = useCallback((direction: PageDirection) => {
    if (direction === 'next') {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === 'previous') {
      setCurrentPage((prev) => prev - 1);
    }
  }, []);
  const handleChangeSortBy = useCallback((newSort: SortingOptions) => {
    setCurrentPage(1);
    setSortBy(newSort);
  }, []);

  const contextValue = useMemo(
    () => ({
      jobItems,
      jobItemsSortedAndSliced,
      isLoading,
      totalNumberOfResults,
      totalNumberOfPages,
      currentPage,
      sortBy,
      handleChangePage,
      handleChangeSortBy,
    }),
    [
      jobItems,
      jobItemsSortedAndSliced,
      isLoading,
      totalNumberOfResults,
      totalNumberOfPages,
      currentPage,
      sortBy,
      handleChangePage,
      handleChangeSortBy,
    ]
  );

  return (
    <JobItemsContext.Provider value={contextValue}>
      {children}
    </JobItemsContext.Provider>
  );
}
