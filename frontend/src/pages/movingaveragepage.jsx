import { useState } from "react";
import "../styles/PageForm.css";

const NIFTY_50_STOCKS = [
  { symbol: "ADANIPORTS.NS", name: "Adani Ports" },
  { symbol: "ASIANPAINT.NS", name: "Asian Paints" },
  { symbol: "AXISBANK.NS", name: "Axis Bank" },
  { symbol: "BAJAJ-AUTO.NS", name: "Bajaj Auto" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance" },
  { symbol: "BAJAJFINSV.NS", name: "Bajaj Finserv" },
  { symbol: "BPCL.NS", name: "BPCL" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel" },
  { symbol: "BRITANNIA.NS", name: "Britannia" },
  { symbol: "CIPLA.NS", name: "Cipla" },
  { symbol: "COALINDIA.NS", name: "Coal India" },
  { symbol: "DIVISLAB.NS", name: "Divi's Labs" },
  { symbol: "DRREDDY.NS", name: "Dr. Reddy's" },
  { symbol: "EICHERMOT.NS", name: "Eicher Motors" },
  { symbol: "GRASIM.NS", name: "Grasim" },
  { symbol: "HCLTECH.NS", name: "HCL Tech" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
  { symbol: "HDFCLIFE.NS", name: "HDFC Life" },
  { symbol: "HEROMOTOCO.NS", name: "Hero MotoCorp" },
  { symbol: "HINDALCO.NS", name: "Hindalco" },
  { symbol: "HINDUNILVR.NS", name: "Hindustan Unilever" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank" },
  { symbol: "ITC.NS", name: "ITC" },
  { symbol: "INDUSINDBK.NS", name: "IndusInd Bank" },
  { symbol: "INFY.NS", name: "Infosys" },
  { symbol: "JSWSTEEL.NS", name: "JSW Steel" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Mahindra Bank" },
  { symbol: "LT.NS", name: "Larsen & Toubro" },
  { symbol: "M&M.NS", name: "Mahindra & Mahindra" },
  { symbol: "MARUTI.NS", name: "Maruti Suzuki" },
  { symbol: "NTPC.NS", name: "NTPC" },
  { symbol: "NESTLEIND.NS", name: "Nestle India" },
  { symbol: "ONGC.NS", name: "ONGC" },
  { symbol: "POWERGRID.NS", name: "Power Grid" },
  { symbol: "RELIANCE.NS", name: "Reliance Industries" },
  { symbol: "SBILIFE.NS", name: "SBI Life" },
  { symbol: "SBIN.NS", name: "State Bank of India" },
  { symbol: "SUNPHARMA.NS", name: "Sun Pharma" },
  { symbol: "TCS.NS", name: "TCS" },
  { symbol: "TATACONSUM.NS", name: "Tata Consumer" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors" },
  { symbol: "TATASTEEL.NS", name: "Tata Steel" },
  { symbol: "TECHM.NS", name: "Tech Mahindra" },
  { symbol: "TITAN.NS", name: "Titan" },
  { symbol: "UPL.NS", name: "UPL" },
  { symbol: "ULTRACEMCO.NS", name: "UltraTech Cement" },
  { symbol: "WIPRO.NS", name: "Wipro" },
];

export default function MovingAveragePage() {
  const [form, setForm] = useState({
    stock: "",
    start_date: "",
    end_date: "",
    short_window: 20,
    long_window: 50,
    initial_investment: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/api/moving_average", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Error fetching data." });
    }
    setLoading(false);
  };

  // "Back" button handler
  const handleBack = () => {
    setResult(null);
    setLoading(false);
  };

  // Generate a detailed analysis summary
  const renderDetailedAnalysis = () => {
    if (!result || !result.analysis) return null;
    const { trades, returns, crossovers } = result.analysis;
    let summary = "";

    if (trades.total_buys === 0 && trades.total_sells === 0) {
      summary = "No buy or sell signals were generated for the selected period and parameters. Try adjusting the moving average windows or date range.";
    } else if (returns.absolute > 0) {
      summary = `The strategy was profitable, yielding a net return of ₹${returns.absolute.toFixed(2)} (${returns.percentage.toFixed(2)}%). This suggests that the chosen moving average crossover captured upward trends effectively.`;
    } else if (returns.absolute < 0) {
      summary = `The strategy resulted in a loss of ₹${Math.abs(returns.absolute).toFixed(2)} (${returns.percentage.toFixed(2)}%). This may indicate sideways or volatile market conditions where moving average crossovers are less effective.`;
    } else {
      summary = "The strategy broke even. This often happens if buy and sell prices were similar or if there were few trading opportunities.";
    }

    return (
      <div className="detailed-analysis" style={{ margin: "2rem 0", background: "#f9f9f9", padding: "1rem", borderRadius: "8px" }}>
        <h4>Detailed Analysis</h4>
        <p>{summary}</p>
        <ul>
          <li><b>Total crossovers:</b> {crossovers}</li>
          <li><b>Total buy signals:</b> {trades.total_buys}</li>
          <li><b>Total sell signals:</b> {trades.total_sells}</li>
          <li><b>Initial investment:</b> ₹{returns.initial_investment.toFixed(2)}</li>
          <li><b>Net return:</b> ₹{returns.absolute.toFixed(2)} ({returns.percentage !== null ? `${returns.percentage.toFixed(2)}%` : ""})</li>
        </ul>
        <p>
          <b>Interpretation:</b> Moving average crossovers work best in trending markets. If you see many signals but little profit, the market may have been choppy. Try experimenting with different window sizes or time periods for further insights!
        </p>
      </div>
    );
  };

  return (
    
<div className="page-container">
<div className="intro-section">
  <div className="intro-header">
    <h2> Moving Average Crossover Analysis</h2>
  </div>
  <p className="intro-text">
    Analyze Nifty 50 stocks using Moving Average Crossover to spot trends and simulate returns.
  </p>
  <ul className="intro-benefits">
    <li>📈 Spot buy/sell opportunities</li>
    <li>📊 Visualize historical performance</li>
    <li>⚙️ Test strategies on Nifty 50 stocks</li>
  </ul>
</div>
  <h2 className="form-title">Try it for yourself!</h2>
  {!result && (
    <form className="analysis-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="stock">Nifty 50 Stock</label>
        <select
          id="stock"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          required
        >
          <option value="">-- Select a Stock --</option>
          {NIFTY_50_STOCKS.map((s) => (
            <option key={s.symbol} value={s.symbol}>
              {s.name} ({s.symbol})
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="start_date">Start Date</label>
        <input
          type="date"
          id="start_date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="end_date">End Date</label>
        <input
          type="date"
          id="end_date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="short_window">Short Window (days)</label>
        <input
          type="number"
          id="short_window"
          name="short_window"
          value={form.short_window}
          min="1"
          max="200"
          onChange={handleChange}
          required
          placeholder="Short Window"
        />
      </div>
      <div className="form-group">
        <label htmlFor="long_window">Long Window (days)</label>
        <input
          type="number"
          id="long_window"
          name="long_window"
          value={form.long_window}
          min="1"
          max="500"
          onChange={handleChange}
          required
          placeholder="Long Window"
        />
      </div>
      <div className="form-group">
        <label htmlFor="initial_investment">Initial Investment (₹)</label>
        <input
          type="number"
          id="initial_investment"
          name="initial_investment"
          value={form.initial_investment}
          min="0"
          step="100"
          onChange={handleChange}
          placeholder="Optional"
        />
      </div>
      <button type="submit" className="tool-button" disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Moving Average"}
      </button>
    </form>
  )}

      {result && (
        <div className="results">
          <div className="back-btn-wrapper">
           <button className="tool-button" onClick={handleBack}>
            &larr; Back to Input
           </button>
          </div>

          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : (
            <>
              <div className="results-summary">
                <h3>Strategy Performance</h3>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <span className="metric-label">Crossovers</span>
                    <span className="metric-value">
                      {result.analysis.crossovers}
                    </span>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Total Buys</span>
                    <span className="metric-value">
                      {result.analysis.trades.total_buys}
                    </span>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Total Sells</span>
                    <span className="metric-value">
                      {result.analysis.trades.total_sells}
                    </span>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Net Return</span>
                    <span className="metric-value">
                      ₹{result.analysis.returns.absolute.toFixed(2)}
                      {result.analysis.returns.percentage !== null && (
                        <span className="metric-subtext">
                          ({result.analysis.returns.percentage.toFixed(2)}%)
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="metric-card">
                    <span className="metric-label">Initial Investment</span>
                    <span className="metric-value">
                      ₹{result.analysis.returns.initial_investment.toFixed(2)}
                    </span>
                  </div>
                  <div className="metric-card">
                   <span className="metric-label">Total Return</span>
                   <span className="metric-value">
                   {result.analysis.returns.total_return !== null
                   ? `₹${result.analysis.returns.total_return.toFixed(2)}`
                   : "N/A"}
                   </span>
                 </div>
                </div>
              </div>

              {renderDetailedAnalysis()}

              <div className="signals-section">
                <div className="signals-column">
                  <h4>Buy Signals ({result.analysis.trades.total_buys})</h4>
                  <div className="signals-list" style={{ overflow: "visible", maxHeight: "none" }}>
                    {result.signals.buys.length > 0 ? (
                      result.signals.buys.map((b, i) => (
                        <div key={i} className="signal-item">
                          <span className="signal-date">{new Date(b.date).toLocaleDateString()}</span>
                          <span className="signal-price">₹{b.price.toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="signal-item">None</div>
                    )}
                  </div>
                </div>
                <div className="signals-column">
                  <h4>Sell Signals ({result.analysis.trades.total_sells})</h4>
                  <div className="signals-list" style={{ overflow: "visible", maxHeight: "none" }}>
                    {result.signals.sells.length > 0 ? (
                      result.signals.sells.map((s, i) => (
                        <div key={i} className="signal-item">
                          <span className="signal-date">{new Date(s.date).toLocaleDateString()}</span>
                          <span className="signal-price">₹{s.price.toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="signal-item">None</div>
                    )}
                  </div>
                </div>
              </div>

              {result.visualization && (
                <div className="chart-container">
                  <h4>Strategy Visualization</h4>
                  <img
                    src={`data:image/png;base64,${result.visualization}`}
                    alt="Strategy Visualization"
                    className="strategy-chart"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}