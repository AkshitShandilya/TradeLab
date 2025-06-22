import React from "react";
import "../styles/PersonalDashboard.css";

export default function PersonalDashboardBox() {
  // Mock data
  const portfolio = [
    { name: "HDFC Bank", symbol: "HDFCBANK", qty: 10, price: 1720, change: 12.5 },
    { name: "Reliance", symbol: "RELIANCE", qty: 5, price: 2910, change: -8.2 },
    { name: "Infosys", symbol: "INFY", qty: 12, price: 1485, change: 6.1 }
  ];
  const totalValue = portfolio.reduce((sum, s) => sum + s.qty * s.price, 0);

  return (
    <a
  href="/my-portfolio"
  className="personal-dashboard-box clickable"
  tabIndex={0}
  aria-label="Go to your personal dashboard"
  style={{ textDecoration: "none" }}
>
    <div className="personal-dashboard-box">
      <div className="pd-title">Personal Dashboard</div>
      <div className="pd-summary">
        <span>Total Portfolio Value:</span>
        <span className="pd-value">
          ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </span>
      </div>
      <table className="pd-table">
        <thead>
          <tr>
            <th>Stock</th>
            <th>Qty</th>
            <th>Price</th>
            <th>P/L</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map(stock => (
            <tr key={stock.symbol}>
              <td>
                <div className="pd-stock-name">{stock.name}</div>
                <div className="pd-stock-symbol">{stock.symbol}</div>
              </td>
              <td>{stock.qty}</td>
              <td>₹{stock.price.toLocaleString("en-IN")}</td>
              <td className={stock.change >= 0 ? "pd-pos" : "pd-neg"}>
                {stock.change >= 0 ? "+" : ""}
                {stock.change.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pd-note">
        <svg width="18" height="18" fill="#1976d2" style={{marginRight: 5, verticalAlign: "middle"}} viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm1 17.93c-.65.09-1.3.14-2 .14s-1.35-.05-2-.14V19h4v.93zM17.66 16.13c-.41.34-.86.64-1.34.89V17h-8v-.98c-.48-.25-.93-.55-1.34-.89C4.27 14.7 4 13.38 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.38-.27 2.7-.74 3.87z"/></svg>
        <span>This is mock data. Connect your account for real tracking.</span>
      </div>
    </div>
    </a>
  );
}
