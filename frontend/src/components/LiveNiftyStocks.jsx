import React, { useEffect, useState, useRef } from "react";
import "../styles/LiveNiftyStocks.css";

function getStockSets(stocks, size = 5) {
  const sets = [];
  for (let i = 0; i < stocks.length; i += size) {
    sets.push(stocks.slice(i, i + size));
  }
  return sets;
}

export default function LiveNiftyStocks() {
  const [stocks, setStocks] = useState([]);
  const [currentSet, setCurrentSet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(false);
  const isFirstLoad = useRef(true);

  // Fetch stocks on mount and every 30 seconds
  useEffect(() => {
    let first = true;
    const fetchStocks = async () => {
      if (first) setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/nifty-live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        const data = await res.json();
        setStocks(data);
      } catch (e) {
        setStocks([]);
      }
      if (first) {
        setLoading(false);
        setFade(true); // fade in on first load
        first = false;
        isFirstLoad.current = false;
      }
    };
    fetchStocks();
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cycle through sets every 20 seconds with smooth fade
  const stockSets = getStockSets(stocks, 5);
  useEffect(() => {
    if (stockSets.length <= 1) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentSet((prev) => (prev + 1) % stockSets.length);
        setFade(true);
      }, 400); // match fade duration
    }, 20000); // 20 seconds
    return () => clearInterval(interval);
  }, [stockSets.length]);

  // NSE India Nifty 50 live prices page
  const niftyUrl = "https://www.nseindia.com/market-data/live-equity-market?symbol=NIFTY%2050";

  return (
    <a
      href={niftyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="nifty-stocks-box clickable"
      aria-label="View all Nifty 50 live prices on NSE India"
      tabIndex={0}
    >
      <div className="nifty-title">Nifty Stocks</div>
      {loading ? (
        <div className="nifty-loading fade-in">Loading...</div>
      ) : (
        <div className={`nifty-table-wrapper ${fade ? "fade-in" : "fade-out"}`}>
          <table className="nifty-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Symbol</th>
                <th>Price</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {(stockSets[stockSets.length > 0 ? currentSet : 0] || []).map(stock => (
                <tr key={stock.symbol}>
                  <td>{stock.name || "--"}</td>
                  <td>{stock.symbol}</td>
                  <td>{stock.price !== null ? stock.price.toFixed(2) : "--"}</td>
                  <td className={stock.change >= 0 ? "pos" : "neg"}>
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change !== null ? stock.change.toFixed(2) : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="nifty-chart-hint">Click to view all Nifty stocks live</div>
    </a>
  );
}

