import { useEffect, useState } from 'react';
import Background from './components/Background';
import Container from './components/Container';
import Footer from './components/Footer';
import Header, { HeaderTop } from './components/Header';
import Logo from './components/Logo';
import BookmarksButton from './components/BookmarksButton';
import SearchForm from './components/SearchForm';
import Sidebar, { SidebarTop } from './components/Sidebar';
import JobItemContent from './components/JobItemContent';
import ResultsCount from './components/ResultsCount';
import SortingControls from './components/SortingControls';
import JobList from './components/JobList';
import PaginationControls from './components/PaginationControls';
import { useDebounce, useSearchQuery } from './lib/hooks';
import { Toaster } from 'react-hot-toast';
import { handleError } from './lib/utils';
import { RESULTS_PER_PAGE } from './lib/constants';
import { PageDirection, SortingOptions } from './lib/types';

function App() {
  // state / hooks
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
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
  const jobItemsSorted = [...(jobItems || [])].sort((a, b) => {
    if (sortBy === 'relevant') {
      return b.relevanceScore - a.relevanceScore;
    } else if (sortBy === 'recent') {
      return a.daysAgo - b.daysAgo;
    }

    return 0;
  });
  const jobItemsSortedAndSliced = jobItemsSorted.slice(
    currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  // event handlers / actions
  const handleChangePage = (direction: PageDirection) => {
    if (direction === 'next') {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === 'previous') {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleChangeSortBy = (newSort: SortingOptions) => {
    setCurrentPage(1);
    setSortBy(newSort);
  };

  return (
    <>
      <Background />
      <Header>
        <HeaderTop>
          <Logo />
          <BookmarksButton />
        </HeaderTop>
        <SearchForm searchText={searchText} setSearchText={setSearchText} />
      </Header>
      <Container>
        <Sidebar>
          <SidebarTop>
            <ResultsCount totalNumberOfResults={totalNumberOfResults} />
            <SortingControls sortBy={sortBy} onClick={handleChangeSortBy} />
          </SidebarTop>

          <JobList jobItems={jobItemsSortedAndSliced} isLoading={isLoading} />

          <PaginationControls
            currentPage={currentPage}
            totalNumberOfPages={totalNumberOfPages}
            onClick={handleChangePage}
          />
        </Sidebar>
        <JobItemContent />
      </Container>
      <Footer />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
