import { FaBookOpen, FaImages, FaChurch } from "react-icons/fa";
import { GiCandleLight } from "react-icons/gi";
import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";

const classes = {
  container: "relative mt-8 z-100",
  menuButton: "flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-md lg:hidden",
  menu: "absolute top-full left-0 w-full bg-white shadow-md flex flex-col gap-2 p-4 lg:hidden",
  menuItem: "flex items-center gap-4 px-4 py-3 transition bg-gray-100 hover:bg-gray-50",
  hidden: "hidden",
  desktopContainer: "hidden lg:flex justify-left border-b border-gray-200",
  desktopButton: "flex items-center gap-4 w-48 px-4 py-3 border-b-2 transition",
  active: "border-b-gray-400 bg-gray-100",
  inactive: "border-b-transparent hover:bg-gray-50",
  icon: "text-2xl",
  text: "text-sm font-medium",
};

const texts = {
  lightCandle: "Zapal świeczkę",
  candles: "Tablica pamięci",
  gallery: "Galeria",
  funeral: "Uroczystości",
};

export default function TabButtons({
  activeTab,
  setActiveTab,
}: {
  activeTab: "candles" | "gallery" | "funeral" | "lightCandle";
  setActiveTab: (tab: "candles" | "gallery" | "funeral" | "lightCandle") => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTabClick = (tab: "candles" | "gallery" | "funeral" | "lightCandle") => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  return (
    <div className={classes.container}>
      <button
        className={classes.menuButton}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? <IoMdClose className={classes.icon} /> : <IoMdMenu className={classes.icon} />}
        <span className={classes.text}>Menu</span>
      </button>
      <div className={`${menuOpen ? "" : classes.hidden} ${classes.menu}`}>
        <button className={classes.menuItem} onClick={() => handleTabClick("lightCandle")}>
          <GiCandleLight className={classes.icon} />
          <span className={classes.text}>{texts.lightCandle}</span>
        </button>
        <button className={classes.menuItem} onClick={() => handleTabClick("candles")}>
          <FaBookOpen className={classes.icon} />
          <span className={classes.text}>{texts.candles}</span>
        </button>
        <button className={classes.menuItem} onClick={() => handleTabClick("gallery")}>
          <FaImages className={classes.icon} />
          <span className={classes.text}>{texts.gallery}</span>
        </button>
        <button className={classes.menuItem} onClick={() => handleTabClick("funeral")}>
          <FaChurch className={classes.icon} />
          <span className={classes.text}>{texts.funeral}</span>
        </button>
      </div>

      <div className={classes.desktopContainer}>
        <button
          className={`${classes.desktopButton} ${
            activeTab === "lightCandle" ? classes.active : classes.inactive
          }`}
          onClick={() => setActiveTab("lightCandle")}
        >
          <GiCandleLight className={classes.icon} />
          <span className={classes.text}>{texts.lightCandle}</span>
        </button>
        <button
          className={`${classes.desktopButton} ${
            activeTab === "candles" ? classes.active : classes.inactive
          }`}
          onClick={() => setActiveTab("candles")}
        >
          <FaBookOpen className={classes.icon} />
          <span className={classes.text}>{texts.candles}</span>
        </button>
        <button
          className={`${classes.desktopButton} ${
            activeTab === "gallery" ? classes.active : classes.inactive
          }`}
          onClick={() => setActiveTab("gallery")}
        >
          <FaImages className={classes.icon} />
          <span className={classes.text}>{texts.gallery}</span>
        </button>
        <button
          className={`${classes.desktopButton} ${
            activeTab === "funeral" ? classes.active : classes.inactive
          }`}
          onClick={() => setActiveTab("funeral")}
        >
          <FaChurch className={classes.icon} />
          <span className={classes.text}>{texts.funeral}</span>
        </button>
      </div>
    </div>
  );
}
