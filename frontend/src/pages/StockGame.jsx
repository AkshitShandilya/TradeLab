import React, { useState, useEffect, useRef } from "react";
import "../styles/StockGame.css"

function StockGuessGame() {
  const [stockData, setStockData] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [hasGuessed, setHasGuessed] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(15);

  const timerRef = useRef(null);
  const hasGuessedRef = useRef(hasGuessed);

  // Keep ref value sync with state for up-to-date value inside closures
  useEffect(() => {
    hasGuessedRef.current = hasGuessed;
  }, [hasGuessed]);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    setTimer(15);
    clearTimer();

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearTimer();
          if (!hasGuessedRef.current) {
            // Reset feedbackVisible first to retrigger animation
            setFeedbackVisible(false);
            setFeedback("");
            setTimeout(() => {
              setFeedback("⏰ Oops, you ran out of time.");
              setHasGuessed(true);
              setFeedbackVisible(true);
              setStreak(0);
            }, 20);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const fetchStockData = () => {
    setLoading(true);
    setFetchError("");
    setFeedback("");
    setStockData(null);
    setHasGuessed(false);
    setFeedbackVisible(false);
    clearTimer();

    fetch("http://localhost:5000/api/random_stock_game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setFetchError(data.error);
          setStockData(null);
          setLoading(false);
        } else {
          setStockData(data);
          setLoading(false);
          startTimer();
        }
      })
      .catch(() => {
        setFetchError("Failed to fetch stock data");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStockData();
    // Cleanup timer on component unmount
    return () => {
      clearTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = (guess) => {
    if (!stockData) return;

    clearTimer();
    setFeedbackVisible(false);

    const lastClose = stockData.last_5_days[4];
    const nextClose = stockData.next_day;
    const actualDirection = nextClose > lastClose ? "up" : "down";

    if (guess === actualDirection) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      setFeedback(
        `🎉 Correct! Next close was ${nextClose.toFixed(2)} (${actualDirection.toUpperCase()})`
      );
    } else {
      setStreak(0);
      setFeedback(
        `❌ Wrong! Next close was ${nextClose.toFixed(2)} (${actualDirection.toUpperCase()})`
      );
    }

    setHasGuessed(true);
    setTimeout(() => setFeedbackVisible(true), 20);
  };

  const resetScore = () => {
    setScore(0);
    setStreak(0);
    setFeedback("");
    setFeedbackVisible(false);
    if (!hasGuessed) {
      clearTimer();
      setTimer(0);
    }
  };

  return (
    <div className="stock-game-container">
      <h2>🎲 Nifty Stock Guessing Game</h2>

      <div className="score-streak">
        <span>
          Score: <span className="score">{score}</span>
        </span>
        <span>
          Streak: <span className="streak">{streak >= 3 ? "🔥" : ""}{streak}</span>
        </span>
      </div>

      {!hasGuessed && !loading && stockData && (
        <p className={`timer ${timer <= 5 ? "timer-warning" : ""}`}>
          Time left: {timer} second{timer !== 1 ? "s" : ""}
        </p>
      )}

      <button className="reset-score-btn" onClick={resetScore} disabled={loading}>
        Reset Score
      </button>

      {loading && <p className="loading-text">Loading stock data...</p>}

      {fetchError && <p className="error-text">{fetchError}</p>}

      {!loading && !fetchError && stockData && (
        <>
          <p className="stock-symbol">
            <strong>Stock:</strong> {stockData.symbol.replace(".NS", "")}
          </p>
          <p>Last 5 random closing prices:</p>
          <ol className="price-list">
            {stockData.last_5_days.map((price, idx) => (
              <li key={idx}>{price.toFixed(2)}</li>
            ))}
          </ol>

          {!hasGuessed && (
            <div className="guess-buttons">
              <button
                onClick={() => handleGuess("up")}
                aria-label="Guess Up"
                disabled={loading}
                className="guess-button up"
              >
                Up ↑ 📈
              </button>
              <button
                onClick={() => handleGuess("down")}
                aria-label="Guess Down"
                disabled={loading}
                className="guess-button down"
              >
                Down ↓ 📉
              </button>
            </div>
          )}

          {feedback && (
            <p
              aria-live="polite"
              className={`feedback-text ${feedbackVisible ? "fade-in" : ""} ${
                feedback.startsWith("🎉") ? "correct" : "wrong"
              }`}
            >
              {feedback}
            </p>
          )}

          {hasGuessed && (
            <button className="play-again-btn" onClick={fetchStockData} disabled={loading}>
              Play Again!
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default StockGuessGame;
