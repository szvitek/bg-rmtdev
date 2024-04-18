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

function App() {
  const [searchText, setSearchText] = useState('');
  const debouncedSearchText = useDebounce(searchText, 500);
  const { jobItems, isLoading, error } = useJobItems(debouncedSearchText);

  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error]);

  const totalNumberOfResults = jobItems?.length || 0;
  const jobItemsSliced = jobItems?.slice(0, 7) || [];

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

          <PaginationControls />
        </Sidebar>
        <JobItemContent />
      </Container>
      <Footer />
      <Toaster position="top-right" />
    </>
  );
}

export default App;
