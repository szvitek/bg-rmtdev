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
import PaginationControls from './components/PaginationControls';
import { Toaster } from 'react-hot-toast';
import JobListSearch from './components/JobListSearch';

function App() {
  return (
    <>
      <Background />
      <Header>
        <HeaderTop>
          <Logo />
          <BookmarksButton />
        </HeaderTop>
        <SearchForm />
      </Header>
      <Container>
        <Sidebar>
          <SidebarTop>
            <ResultsCount />
            <SortingControls />
          </SidebarTop>
          <JobListSearch />
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
