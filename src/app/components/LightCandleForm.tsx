'use client';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('react-lottie'), { ssr: false });
import candleAnimation from '../../../public/candle.json';

const classes = {
  container: "w-full max-w-lg px-4 min-h-[600px] ", 
  thankYouContainer: "text-center",
  lottieWrapper: "flex justify-center mb-4",
  thankYouMessage: "text-gray-500 mb-4",
  title: "text-xl font-semibold mb-4 text-gray-700",
  errorMessage: "text-red-500 mb-4",
  input: "w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400",
  textarea: "w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400",
  fileInputWrapper: "mb-4",
  fileInputLabel: "block text-gray-700 font-medium mb-2",
  fileInput: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400",
  button: "px-4 py-2 rounded-md transition flex items-center justify-center",
  thankYouButton: "px-4 py-2 rounded-md transition",
  loadingSpinner: "animate-spin h-5 w-5 text-white",
  password: "w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400",
};

const texts = {
  thankYouMessage: "Dziękujemy za zapalenie świeczki. Zdjęcia przesłane przez innych użytkowników znajdziesz w galerii, a informacje o uroczystościach pogrzebowych w zakładce Uroczystości.",
  lightAnotherCandle: "Zapal jeszcze jedną świeczkę",
  lightCandleTitle: "Zapal świeczkę",
  nameRequiredError: "Imię jest wymagane, aby zapalić świeczkę.",
  passwordRequiredError: "Podanie poprawnego miesiąca urodzin Marysi jest wymagane.",
  imageSizeError: "Rozmiar zdjęcia nie może przekraczać 8MB.",
  submitButton: "Wyślij",
  introMessage: "To jest miejsce, w którym możesz uczcić pamięć Marysi i podzielić się wspomnieniami.",
};

type LightCandleFormProps = {
  refreshMemoryWall: () => Promise<void>;
};

export default function LightCandleForm({ refreshMemoryWall }: LightCandleFormProps) {
  const [loading, setLoading] = useState(false);
  const [localCandleName, setLocalCandleName] = useState('');
  const [localCandleComment, setLocalCandleComment] = useState('');
  const [localCandleImages, setLocalCandleImages] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);
  const [nameInputError, setNameInputError] = useState(false);
  const [localPassword, setLocalPassword] = useState('');
  const [passwordInputError, setPasswordInputError] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.size > 8 * 1024 * 1024) {
        setErrorMessage(texts.imageSizeError);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (result) {
          setLocalCandleImages([result]);
          setErrorMessage(null);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setLocalCandleImages([]);
    }
  }, []);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalCandleComment(e.target.value);
    if (!localCandleName.trim()) {
      setNameInputError(true);
    } else {
      setNameInputError(false);
    }
  };

  const handleSubmit = async () => {
    if (!localCandleName.trim()) {
      setErrorMessage(texts.nameRequiredError);
      return;
    }

    if (localPassword.trim().toLowerCase() !== "sierpień") {
      setErrorMessage(texts.passwordRequiredError);
      setPasswordInputError(true);
      return;
    }

    setPasswordInputError(false);

    setLoading(true);
    try {
      const candleResponse = await fetch("/api/candles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: localCandleName, comment: localCandleComment }),
      });

      if (!candleResponse.ok) throw new Error("Failed to create candle");

      const { id: candleId } = await candleResponse.json();

      if (localCandleImages.length > 0) {
        const imagesResponse = await fetch("/api/images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candleId, images: localCandleImages }),
        });

        if (!imagesResponse.ok) throw new Error("Failed to upload images");
      }

      await refreshMemoryWall();
      setShowThankYou(true);
    } catch (error) {
      console.error("Error lighting candle:", error);
      setErrorMessage("Wystąpił błąd podczas zapalania świeczki.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setLocalCandleName('');
    setLocalCandleComment('');
    setLocalCandleImages([]);
    setErrorMessage(null);
    setShowThankYou(false);
  };

  return (
    <div className={classes.container}>
      {showThankYou ? (
        <div className={classes.thankYouContainer}>
          <div className={classes.lottieWrapper}>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData: candleAnimation,
                rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
              }}
              height={200}
              width={200} 
            />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Dziękujemy!</h2>
          <p className={classes.thankYouMessage}>
            Dziękujemy za zapalenie świeczki. Zdjęcia przesłane przez innych użytkowników znajdziesz w galerii, 
            a informacje o uroczystościach pogrzebowych w zakładce Uroczystości.
          </p>
          <button
            className={classes.thankYouButton}
            style={{ backgroundColor: "#434c5e", color: "rgb(236, 224, 207)" }}
            onClick={resetForm}
          >
            {texts.lightAnotherCandle}
          </button>
        </div>
      ) : (
        <>
          <h2 className={classes.title}>{texts.lightCandleTitle}</h2>
          <p className="text-gray-600 mb-4">{texts.introMessage}</p>
          {errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
          <label className="block text-gray-700 font-medium mb-2">
            Twoje imię <span className="text-red-500">*</span>
          </label>
          <input
            className={`${classes.input} ${nameInputError ? 'border-red-500 focus:ring-red-400' : ''}`}
            placeholder="Twoje imię"
            value={localCandleName}
            onChange={(e) => {
              setLocalCandleName(e.target.value);
              if (e.target.value.trim()) {
                setNameInputError(false);
                setErrorMessage(null);
              }
            }}
          />
          <label className="block text-gray-700 font-medium mb-2">
            Miesiąc urodzin Marysi (dla weryfikacji) <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            className={`${classes.password} ${passwordInputError ? 'border-red-500 focus:ring-red-400' : ''}`}
            placeholder="Podaj miesiąc urodzin Marysi"
            value={localPassword}
            onChange={(e) => {
              setLocalPassword(e.target.value);
              if (e.target.value.trim().toLowerCase() === "maj") {
                setPasswordInputError(false);
                setErrorMessage(null);
              }
            }}
          />
          <textarea
            className={classes.textarea}
            placeholder="Opcjonalny komentarz, np. wspomnienie, historia związana z Marysią lub coś, co chciałbyś/chciałabyś przekazać."
            style={{ height: "100px" }}
            value={localCandleComment}
            onChange={handleCommentChange}
          />
          <div className={classes.fileInputWrapper}>
            <label className={classes.fileInputLabel}>
              Jeżeli chcesz, możesz tutaj dodać zdjęcie Marysi z młodości lub inne, które chciałbyś/chciałabyś udostępnić w galerii.
            </label>
            <input
              type="file"
              accept="image/*"
              className={classes.fileInput}
              onChange={handleFileChange}
            />
          </div>
          {localCandleImages.length > 0 && (
            <div className="image-preview flex flex-wrap gap-2">
              {localCandleImages.map((src, index) =>
                src ? (
                  <img
                    key={index}
                    src={src}
                    alt={`Uploaded ${index + 1}`}
                    className="uploaded-image w-30 h-30 mb-4 object-cover rounded-md border border-gray-300"
                  />
                ) : null
              )}
            </div>
          )}
          <button
            className={`${classes.button} cursor-pointer`}
            style={{ backgroundColor: "#434c5e", color: "white" }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <svg
                className={classes.loadingSpinner}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              texts.submitButton
            )}
          </button>
        </>
      )}
    </div>
  );
}
