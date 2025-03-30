'use client';
import { useState, useEffect } from "react";
import LeftColumn from "./components/LeftColumn";
import RightColumn from "./components/RightColumn";

export default function Home() {
  const [candles, setCandles] = useState([]);
  const [activeTab, setActiveTab] = useState<"candles" | "gallery" | "funeral" | "lightCandle">("lightCandle");
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

    fetchCandles();
  }, []);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      if (activeTab === "gallery") {
        try {
          const response = await fetch("/api/images");
          if (!response.ok) throw new Error("Failed to fetch gallery images");
          const data = await response.json();
          console.log("Gallery images fetched:", data.images);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchGalleryImages();
  }, [activeTab]);

  return (
    <div className="app-container text-gray-800">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-min">
        <LeftColumn />
        <RightColumn
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          error={error}
          dialogImage={dialogImage}
          setDialogImage={setDialogImage}
          carouselIndex={carouselIndex}
          setCarouselIndex={setCarouselIndex}
        />
      </div>
    </div>
  );
}
