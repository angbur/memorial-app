import dynamic from "next/dynamic";
import Image from "next/image";
import { FaSearch } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";

export default function MemoryWall({
  candles,
  error,
  setDialogImage,
  lottieOptions,
}: {
  candles: any[];
  error: string | null;
  dialogImage: string | null;
  setDialogImage: (image: string | null) => void;
  lottieOptions: any;
}) {
  const Lottie = dynamic(() => import("react-lottie"), { ssr: false });

  const [currentPage, setCurrentPage] = useState(1);
  const candlesPerPage = 10;
  const listRef = useRef<HTMLUListElement | null>(null);

  const indexOfLastCandle = currentPage * candlesPerPage;
  const indexOfFirstCandle = indexOfLastCandle - candlesPerPage;
  const currentCandles = candles.slice(indexOfFirstCandle, indexOfLastCandle);

  const totalPages = Math.ceil(candles.length / candlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (candles.length === 0 && !error) {
      setIsFetching(true);
    } else {
      setIsFetching(false);
    }
  }, [candles, error]);

  useEffect(() => {
    if (candles.length > 0 || error) {
      setIsLoading(false);
    }
  }, [candles, error]);

  const classes = {
    wrapper: "w-full flex flex-col",
    errorText: "text-red-400 mt-2",
    container: "p-4 flex flex-col justify-between lg:max-h-[calc(100vh-200px)]",
    pagination: "flex justify-center items-center mt-4 mb-10 space-x-2",
    paginationButton: "p-2 rounded bg-gray-100 disabled:opacity-50",
    activePageButton: "px-4 py-2 rounded bg-gray-400 text-white",
    inactivePageButton: "px-4 py-2 rounded bg-gray-200",
    list: "space-y-4 overflow-visible flex-1 lg:max-h-[calc(100vh-200px)] overflow-y-auto",
    listItem: "p-4",
    itemContainer: "space-y-2",
    itemHeader: "flex items-center gap-2",
    lottieWrapper: "w-12 h-12",
    itemText: "text-gray-500 text-sm mt-6",
    commentText: "text-sm text-gray-800",
    imageWrapper: "relative cursor-pointer group",
    image: "h-[100px] w-auto rounded-lg shadow-md object-cover",
    imageOverlay: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
    searchIcon: "text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full",
  };

  return (
    <div className={classes.wrapper}>
      {isFetching ? (
        <p className="text-center text-gray-500 mt-4">Ładowanie...</p>
      ) : (
        <>
          {error && <p className={classes.errorText}>{error}</p>}
          <div className={classes.container}>
            <ul ref={listRef} className={classes.list}>
              {currentCandles.map((candle) => (
                <li key={candle.id} className={classes.listItem}>
                  <div className={classes.itemContainer}>
                    <div className={classes.itemHeader}>
                      <div className={classes.lottieWrapper}>
                        <Lottie options={lottieOptions} />
                      </div>
                      <p className={classes.itemText}>
                        <strong>{candle.name}</strong> zapalił(a) świeczkę{" "}
                        {new Date(candle.date).toLocaleString()}
                      </p>
                    </div>
                    {candle.comment && (
                      <p className={classes.commentText}>{candle.comment}</p>
                    )}
                    {candle.imageUrl && (
                      <div
                        className={classes.imageWrapper}
                        onClick={() => setDialogImage(candle.imageUrl)}
                      >
                        <Image
                          src={candle.imageUrl}
                          alt="Zdjęcie"
                          width={0}
                          height={0}
                          sizes="100px"
                          className={classes.image}
                        />
                        <div className={classes.imageOverlay}>
                          <FaSearch className={classes.searchIcon} />
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <div className={classes.pagination}>
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={classes.paginationButton}
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={
                    currentPage === index + 1
                      ? classes.activePageButton
                      : classes.inactivePageButton
                  }
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={classes.paginationButton}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
