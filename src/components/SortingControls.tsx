import { ReactNode } from 'react';
import { useJobItemsContext } from '../lib/hooks';

export default function SortingControls() {
  const { sortBy, handleChangeSortBy } = useJobItemsContext();

  return (
    <section className="sorting">
      <i className="fa-solid fa-arrow-down-short-wide"></i>
      <SortingButton
        onClick={() => handleChangeSortBy('relevant')}
        isActive={sortBy === 'relevant'}
      >
        Relevant
      </SortingButton>
      <SortingButton
        onClick={() => handleChangeSortBy('recent')}
        isActive={sortBy === 'recent'}
      >
        Recent
      </SortingButton>
    </section>
  );
}

type SortingButtonProps = {
  onClick: () => void;
  isActive: boolean;
  children: ReactNode;
};

function SortingButton({ onClick, isActive, children }: SortingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`sorting__button sorting__button--recent ${
        isActive ? 'sorting__button--active' : ''
      }`}
    >
      {children}
    </button>
  );
}
