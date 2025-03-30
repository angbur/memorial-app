import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function Gallery({
  error,
  carouselIndex,
  setCarouselIndex,
  dialogImage,
  setDialogImage,
}: {
  error: string | null;
  carouselIndex: number | null;
  setCarouselIndex: (index: number | null) => void;
  dialogImage: string | null;
  setDialogImage: (image: string | null) => void;
}) {
  const [galleryImages, setGalleryImages] = useState<{ id: string; image: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 6; // Always use a page size of 6
  const listRef = useRef<HTMLDivElement | null>(null);

  const [totalPages, setTotalPages] = useState(0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchImages(page); // Fetch images for the selected page
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const previousPage = currentPage - 1;
      setCurrentPage(previousPage);
      fetchImages(previousPage); // Fetch images for the previous page
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchImages(nextPage); // Fetch images for the next page
    }
  };

  const fetchImages = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/images?page=${page}&limit=${imagesPerPage}`);
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();

      setGalleryImages(data.images.map((img: { id: string; image: string }) => ({
        id: img.id,
        image: img.image,
      })));
      setTotalPages(data.pagination.totalPages); // Update totalPages from the backend
    } catch (err) {
      console.error("Error fetching gallery images:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (id: string) => {
    try {
      const response = await fetch("/api/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to delete image");
      setGalleryImages((prev) => prev.filter((img) => img.id !== id));
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  useEffect(() => {
    fetchImages(currentPage);
  }, [currentPage]);

  return (
    <div className="mb-10">
      <h1 className="text-2xl font-bold text-gray-700">Przesłane zdjęcia</h1>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {loading ? (
        <p className="text-gray-500 mb-20">Ładowanie zdjęć...</p>
      ) : galleryImages.length > 0 ? (
        <>
          <div
            ref={listRef}
            className="grid gap-4 mt-4"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            }}
          >
            {galleryImages.map((image, index) => (
              <div key={image.id} className="relative cursor-pointer">
                <div
                  className="w-full h-60 overflow-hidden rounded-lg shadow-md"
                  onClick={() => setCarouselIndex(index + (currentPage - 1) * imagesPerPage)}
                >
                  <Image
                    src={image.image}
                    alt={`Zdjęcie ${index + 1}`}
                    width={100}
                    height={100}
                    className="object-cover w-full h-full"
                  />
                </div>
                {process.env.NODE_ENV === "development" && (
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Usuń
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center items-center mt-4 mb-10 space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded bg-gray-100 disabled:opacity-50"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => ( // Use totalPages for pagination
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded ${
                  currentPage === index + 1
                    ? "bg-gray-400 text-white"
                    : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded bg-gray-100 disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">Brak zdjęć w galerii.</p>
      )}
      {carouselIndex !== null && (
        <div className="fixed z-100 inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white text-3xl"
              onClick={() => setCarouselIndex(null)}
            >
              &times;
            </button>
            {galleryImages[carouselIndex] && (
              <Image
                src={galleryImages[carouselIndex].image}
                alt={`Zdjęcie ${carouselIndex + 1}`}
                width={800}
                height={800}
                className="rounded-lg shadow-lg"
              />
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        @media (max-width: 640px) {
          .grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
}
