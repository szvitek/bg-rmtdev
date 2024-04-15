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
import { useJobItems } from './lib/hooks';

function App() {
  const [searchText, setSearchText] = useState('');
  const [jobItems, isLoading] = useJobItems(searchText);
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
            <ResultsCount />
            <SortingControls />
          </SidebarTop>

          <JobList jobItems={jobItems} isLoading={isLoading} />

          <PaginationControls />
        </Sidebar>
        <JobItemContent />
      </Container>
      <Footer />
    </>
  );
}

export default App;
