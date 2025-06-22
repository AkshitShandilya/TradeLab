import React, { useEffect, useState, useRef } from "react";
import { Sparklines, SparklinesLine } from "react-sparklines";
import "../styles/CurrencyCommodityBox.css";

function formatChange(change, pct) {
  if (change == null || pct == null) return "--";
  const sign = change > 0 ? "+" : "";
  return (
    <span style={{ color: change > 0 ? "#2e7d32" : "#c62828", fontWeight: 600 }}>
      {sign}{change.toFixed(2)} ({sign}{pct.toFixed(2)}%)
    </span>
  );
}

export default function CurrencyCommodityBox() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    const fetchPrices = async () => {
      if (isFirstLoad.current) setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/currency-commodities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({})
        });
        const prices = await res.json();
        setData(prices);
      } catch {
        setData({});
      }
      if (isFirstLoad.current) {
        setLoading(false);
        isFirstLoad.current = false;
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  const rows = [
    { label: "USD/INR", key: "USDINR", format: v => v?.toFixed(4) },
    { label: "EUR/INR", key: "EURINR", format: v => v?.toFixed(4) },
    { label: "Gold (₹/g)", key: "GoldINRGram", format: v => v?.toLocaleString("en-IN", { maximumFractionDigits: 2 }) },
    { label: "Silver (₹/kg)", key: "SilverINRKg", format: v => v?.toLocaleString("en-IN", { maximumFractionDigits: 0 }) }
  ];

  return (
    <a
  href="https://www.nseindia.com/market-data/currency-derivatives"
  target="_blank"
  rel="noopener noreferrer"
  className="currency-commodity-box flex-vertical clickable"
  tabIndex={0}
  aria-label="View live currency and commodity prices on Investing.com"
   >
    <div className="currency-commodity-box flex-vertical">
      <div>
        <div className="cc-title">Currency & Commodity Prices</div>
        {loading ? (
          <div className="cc-loading fade-in">Loading...</div>
        ) : (
          <div className="cc-table-wrapper fade-in">
            <table className="cc-table">
              <tbody>
                {rows.map(row => {
                  const d = data[row.key] || {};
                  return (
                    <tr key={row.key}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{row.label}</div>
                        <div style={{ fontSize: "0.9em", color: "#888" }}>
                          {formatChange(d.change, d.change_pct)}
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: 500 }}>
                          {d.price != null ? row.format(d.price) : "--"}
                        </div>
                        <div style={{ height: 24 }}>
                          {Array.isArray(d.chart) && d.chart.length > 1 && (
                            <Sparklines data={d.chart} width={60} height={24} margin={4}>
                              <SparklinesLine color={d.change > 0 ? "#2e7d32" : "#c62828"} style={{ fill: "none" }} />
                            </Sparklines>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="cc-tip">
        <svg width="24" height="24" style={{marginRight: 8, verticalAlign: "middle"}} fill="#1976d2" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm1 17.93c-.65.09-1.3.14-2 .14s-1.35-.05-2-.14V19h4v.93zM17.66 16.13c-.41.34-.86.64-1.34.89V17h-8v-.98c-.48-.25-.93-.55-1.34-.89C4.27 14.7 4 13.38 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.38-.27 2.7-.74 3.87z"/></svg>
        <span>
          Did you know? Gold prices in India are influenced by both global rates and the USD/INR exchange rate.
        </span>
      </div>
    </div>
    </a>
  );
}
