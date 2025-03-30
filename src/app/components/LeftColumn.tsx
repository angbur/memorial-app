'use client'
import Image from "next/image";

type Classes = {
  container: string;
  imageWrapper: string;
  image: string;
  textSection: string;
  name: string;
  dates: string;
  description: string;
};

type Texts = {
  name: string;
  dates: string;
  description: string;
};

const classes: Classes = {
  container: "flex flex-col items-center justify-center p-6 w-full",
  imageWrapper: "w-full overflow-hidden rounded-lg justify-center flex items-center",
  image: "object-cover rounded-lg shadow-md w-full max-w-xs max-h-[200px] sm:max-h-none image",
  textSection: "mt-6 text-center p-10 rounded-lg font-['EB_Garamond']",
  name: "text-4xl font-semibold",
  dates: "text-2xl mb-4",
  description: "text-lg",
};

const texts: Texts = {
  name: "Maria Bury",
  dates: "1933 - 2025",
  description: `Maria Bury była sercem naszej rodziny. Jej ciepło, życzliwość i nieustający uśmiech rozświetlały każdy dzień. 
  Zawsze miała czas, by wysłuchać, wesprzeć i podzielić się swoją mądrością. Jej miłość i dobroć pozostaną z nami na zawsze.`,
};

export default function LeftColumn() {
  return (
    <div className={classes.container}>
      <div className={classes.imageWrapper}>
        <Image
          src="/grandma.png"
          alt={`Zdjęcie ${texts.name}`}
          width={280}
          height={230}
          className={classes.image}
          style={{ minHeight: "300px", minWidth: "200px" }}
        />
      </div>
      <div
        className={`${classes.textSection}`}
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <p className={classes.name}>{texts.name}</p>
        <p className={classes.dates}>{texts.dates}</p>
        <p className={classes.description}>{texts.description}</p>
      </div>
    </div>
  );
}
