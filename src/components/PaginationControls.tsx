import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';

type PaginationControlsProps = {
  currentPage: number;
  totalNumberOfPages: number;
  onClick: (direction: 'next' | 'previous') => void;
};

export default function PaginationControls({
  currentPage,
  totalNumberOfPages,
  onClick,
}: PaginationControlsProps) {
  return (
    <section className="pagination">
      {currentPage > 1 && (
        <PaginationButton
          currentPage={currentPage}
          onClick={() => onClick('previous')}
          direction="previous"
        />
      )}
      {currentPage < totalNumberOfPages && (
        <PaginationButton
          currentPage={currentPage}
          onClick={() => onClick('next')}
          direction="next"
        />
      )}
    </section>
  );
}

type PaginationButtonProps = {
  direction: 'next' | 'previous';
  currentPage: number;
  onClick: () => void;
};

function PaginationButton({
  direction,
  currentPage,
  onClick,
}: PaginationButtonProps) {
  return (
    <button
      onClick={(e) => {
        onClick();
        e.currentTarget.blur();
      }}
      className={`pagination__button pagination__button--${direction}`}
    >
      {direction === 'previous' && (
        <>
          <ArrowLeftIcon />
          Page {currentPage - 1}
        </>
      )}
      {direction === 'next' && (
        <>
          Page {currentPage + 1}
          <ArrowRightIcon />
        </>
      )}
    </button>
  );
}
