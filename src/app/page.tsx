/* eslint-disable */
'use client';
import { useState, useEffect } from "react";
import LeftColumn from "./components/LeftColumn";
import RightColumn from "./components/RightColumn";

export default function Home() {
  const [candles, setCandles] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [activeTab, setActiveTab] = useState<"candles" | "gallery" | "funeral" | "lightCandle">("lightCandle");
  const [newCandleName, setNewCandleName] = useState("");
  const [newCandleComment, setNewCandleComment] = useState("");
  const [newCandleImage, setNewCandleImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dialogImage, setDialogImage] = useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);
  const [openPanel, setOpenPanel] = useState<"msza" | "pogrzeb" | null>(null);

  useEffect(() => {
    const fetchCandles = async () => {
      try {
        const response = await fetch("/api/candles");
        if (!response.ok) throw new Error("Failed to fetch candles");
        const data = await response.json();
        setCandles(data.candles);
      } catch (err) {
        console.error(err);
        setError("Failed to load candles");
      }
    };

    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/candles");
        if (!response.ok) throw new Error("Failed to fetch gallery images");

        const candlesData = await response.json();

        const candleImages = candlesData.candles
          .filter((candle: { images?: string[] }) => candle.images?.length)
          .flatMap((candle: { images: string[] }) => candle.images);

        setGalleryImages(candleImages);
      } catch (err) {
        console.error(err);
        setError("Failed to load gallery images");
      }
    };

    fetchCandles();
    fetchGalleryImages();
  }, []);

  const handleLightCandle = async () => {
    if (!newCandleName.trim()) {
      setError("Name is required to light a candle");
      return;
    }

    const formData = new FormData();
    formData.append("name", newCandleName);
    if (newCandleComment) formData.append("comment", newCandleComment);
    if (newCandleImage) formData.append("image", newCandleImage);

    try {
      const response = await fetch("/api/candles", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to light candle");
      }
      const data = await response.json();

      const updatedResponse = await fetch("/api/candles");
      if (!updatedResponse.ok) throw new Error("Failed to fetch updated candles");
      const updatedData = await updatedResponse.json();

      setCandles(updatedData.candles);
      setNewCandleName("");
      setNewCandleComment("");
      setNewCandleImage(null);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to light candle");
    }
  };

  return (
    <div className="app-container text-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-min">
        <LeftColumn
          newCandleName={newCandleName}
          setNewCandleName={setNewCandleName}
          newCandleComment={newCandleComment}
          setNewCandleComment={setNewCandleComment}
          newCandleImage={newCandleImage}
          setNewCandleImage={setNewCandleImage}
          handleLightCandle={handleLightCandle}
        />
        <RightColumn
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          candles={candles}
          error={error}
          dialogImage={dialogImage}
          setDialogImage={setDialogImage}
          galleryImages={galleryImages}
          carouselIndex={carouselIndex}
          setCarouselIndex={setCarouselIndex}
          openPanel={openPanel}
          setOpenPanel={setOpenPanel}
        />
      </div>
    </div>
  );
}
