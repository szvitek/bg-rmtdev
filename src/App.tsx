import { useEffect, useState } from "react";
import Background from "./components/Background";
import Container from "./components/Container";
import Footer from "./components/Footer";
import Header from "./components/Header";

function App() {
  const [searchText, setSearchText] = useState('');
  const [jobItems, setJobItems] = useState([]);

  useEffect(() => {
    if (!searchText) return;

    // react recommends to do data fetching in the event handler
    // if it's related to some event just in our case
    // but we do it like this because it will be  refactored later anyway
    const fetchData = async () => {
      const response = await fetch(
        `https://bytegrad.com/course-assets/projects/rmtdev/api/data?search=${searchText}`
      );
      const data = await response.json();
      setJobItems(data.jobItems);
    };

    fetchData();
  }, [searchText]);


  return (
    <>
      <Background />
      <Header searchText={searchText} setSearchText={setSearchText} />
      <Container jobItems={jobItems} />
      <Footer />
    </>
  );
}

export default App;
