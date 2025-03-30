import { useEffect, useState } from "react";
import Image from "next/image";

export default function Gallery({
  error,
  carouselIndex,
  setCarouselIndex
}: {
  error: string | null;
  carouselIndex: number | null;
  setCarouselIndex: (index: number | null) => void;
  dialogImage: string | null;
  setDialogImage: (image: string | null) => void;
}) {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/images");
        if (!response.ok) throw new Error("Failed to fetch images");
        const data = await response.json();

        setGalleryImages(data.images.map((img: { image: string }) => img.image));
      } catch (err) {
        console.error("Error fetching gallery images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="mb-10">
      <h1 className="text-2xl font-bold text-gray-700">Przesłane zdjęcia</h1>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {loading ? (
        <p className="text-gray-500 mb-20">Ładowanie zdjęć...</p>
      ) : galleryImages.length > 0 ? (
        <div
          className="grid gap-4 mt-4"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="cursor-pointer"
              onClick={() => setCarouselIndex(index)}
            >
              <div className="w-full h-60 overflow-hidden rounded-lg shadow-md">
                <Image
                  src={image}
                  alt={`Zdjęcie ${index + 1}`}
                  width={100}
                  height={100}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
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
                src={galleryImages[carouselIndex]}
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
