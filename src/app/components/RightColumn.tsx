'use client';
import TabButtons from "./TabButtons";
import MemoryWall from "./MemoryWall";
import Gallery from "./Gallery";
import FuneralInfo from "./FuneralInfo";
import candleAnimation from "../../../public/candle.json";
import LightCandleForm from "./LightCandleForm";
import { useState, useCallback, useEffect } from "react";

interface RightColumnProps {
  readonly activeTab: "candles" | "gallery" | "funeral" | "lightCandle";
  readonly setActiveTab: (tab: "candles" | "gallery" | "funeral" | "lightCandle") => void;
  readonly error: string | null;
  readonly dialogImage: string | null;
  readonly setDialogImage: (image: string | null) => void;
  readonly carouselIndex: number | null;
  readonly setCarouselIndex: (index: number | null) => void;
}

interface Candle {
  name: string;
  comment?: string;
  images?: string[];
}

interface Comment {
  text?: string;
  images: string[];
}

export default function RightColumn({
  activeTab,
  setActiveTab,
  error,
  dialogImage,
  setDialogImage,
  carouselIndex,
  setCarouselIndex,
}: RightColumnProps) {
  const [memoryWallCandles, setMemoryWallCandles] = useState([]);

  const classes = {
    container: "relative flex flex-col gap-8 bg-gray-50 px-8 py-0 w-full",
  };

  useEffect(() => {
    const fetchCandles = async () => {
      try {
        const response = await fetch("/api/candles");
        if (!response.ok) throw new Error("Failed to fetch candles");
        const data = await response.json();
        setMemoryWallCandles(data.candles);
      } catch (error) {
        console.error("Error fetching candles:", error);
      }
    };

    const fetchGalleryImages = async () => {
      try {
        const [candlesResponse] = await Promise.all([
          fetch("/api/candles"),
        ]);
        if (!candlesResponse.ok) throw new Error("Failed to fetch gallery images");

      } catch (error) {
        console.error("Error fetching gallery images:", error);
      }
    };

    if (activeTab === "candles") {
      fetchCandles();
    } else if (activeTab === "gallery") {
      fetchGalleryImages();
    }
  }, [activeTab]);

  const refreshMemoryWall = useCallback(async () => {
    try {
      const response = await fetch("/api/candles");
      if (!response.ok) throw new Error("Failed to fetch candles");
      const data = await response.json();
      setMemoryWallCandles(data.candles);
    } catch (error) {
      console.error("Error refreshing memory wall:", error);
    }
  }, []);

  return (
    <div className={classes.container}>
      <TabButtons activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "lightCandle" && (
        <LightCandleForm
          refreshMemoryWall={refreshMemoryWall}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === "candles" && (
        <MemoryWall
          candles={memoryWallCandles}
          error={error}
          dialogImage={dialogImage}
          setDialogImage={setDialogImage}
          lottieOptions={{
            loop: true,
            autoplay: true,
            animationData: candleAnimation,
            rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
          }}
        />
      )}
      {activeTab === "gallery" && (
        <Gallery
          error={error}
          carouselIndex={carouselIndex}
          setCarouselIndex={setCarouselIndex ?? 0}
          dialogImage={dialogImage}
          setDialogImage={setDialogImage}
        />
      )}
      {activeTab === "funeral" && (
        <FuneralInfo/>
      )}
    </div>
  );
}
