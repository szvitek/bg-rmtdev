import { ElementRef, forwardRef } from 'react';
import { useBookmarksContext } from '../lib/hooks';
import JobList from './JobList';
import { createPortal } from 'react-dom';

/*
forwardRef<RefType, PropsType>(Component)
and props and ref will be typed properly
*/

const BookmarksPopover = forwardRef<ElementRef<'div'>>(function (_props, ref) {
  const { bookmarkedJobItems, isLoading } = useBookmarksContext();

  return createPortal(
    <div className="bookmarks-popover" ref={ref}>
      <JobList jobItems={bookmarkedJobItems} isLoading={isLoading} />
    </div>,
    document.body
  );
});

export default BookmarksPopover;
