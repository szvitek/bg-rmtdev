import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BookmarksContextProvider from './contexts/BookmarksContext.tsx';
import ActiveIdContextProvider from './contexts/ActiveIdContext.tsx';
import SearchTextContextProvider from './contexts/SearchTextContext.tsx';
import JobItemsContextProvider from './contexts/JobItemsContext.tsx';

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ActiveIdContextProvider>
        <BookmarksContextProvider>
          <SearchTextContextProvider>
            <JobItemsContextProvider>
              <App />
            </JobItemsContextProvider>
          </SearchTextContextProvider>
        </BookmarksContextProvider>
      </ActiveIdContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
