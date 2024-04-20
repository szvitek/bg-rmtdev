import { TriangleDownIcon } from '@radix-ui/react-icons';
import BookmarksPopover from './BookmarksPopover';
import { ElementRef, useRef, useState } from 'react';
import { useOnCLickOutside } from '../lib/hooks';

export default function BookmarksButton() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<ElementRef<'button'>>(null);
  const popoverRef = useRef<ElementRef<'div'>>(null);
  useOnCLickOutside([buttonRef, popoverRef], () => setIsOpen(false));

  return (
    <section>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bookmarks-btn"
        ref={buttonRef}
      >
        Bookmarks <TriangleDownIcon />
      </button>

      {isOpen && <BookmarksPopover ref={popoverRef} />}
    </section>
  );
}
