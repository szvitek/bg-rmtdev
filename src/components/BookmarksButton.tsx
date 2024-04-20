import { TriangleDownIcon } from '@radix-ui/react-icons';
import BookmarksPopover from './BookmarksPopover';
import { ElementRef, useEffect, useRef, useState } from 'react';

export default function BookmarksButton() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<ElementRef<'button'>>(null);
  const popoverRef = useRef<ElementRef<'div'>>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        e.target instanceof HTMLElement &&
        !buttonRef.current?.contains(e.target) &&
        !popoverRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

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
