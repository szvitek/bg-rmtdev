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
import { useDebounce, useJobItems } from './lib/hooks';
import { Toaster } from 'react-hot-toast';
import { handleError } from './lib/utils';
import { RESULTS_PER_PAGE } from './lib/constants';

function App() {
  // state / hooks
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const { jobItems, isLoading, error } = useJobItems(debouncedSearchText);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error]);

  // derived / computed state
  const totalNumberOfResults = jobItems?.length || 0;
  const totalNumberOfPages = Math.ceil(
    totalNumberOfResults / RESULTS_PER_PAGE
  );
  const jobItemsSliced =
    jobItems?.slice(
      currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
      currentPage * RESULTS_PER_PAGE
    ) || [];

  // event handlers / actions
  const handleChangePage = (direction: 'next' | 'previous') => {
    if (direction === 'next') {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === 'previous') {
      setCurrentPage((prev) => prev - 1);
    }
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
            <SortingControls />
          </SidebarTop>

          <JobList jobItems={jobItemsSliced} isLoading={isLoading} />

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
