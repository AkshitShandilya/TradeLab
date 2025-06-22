import { useState } from "react";
import "../styles/PageForm.css";

export default function RsiPage() {
  const [form, setForm] = useState({
    stock: "",
    start_date: "",
    end_date: "",
    window: 14,
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
      const res = await fetch("/api/rsi", {
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

  return (
    <div className="page-container">
      <h2>RSI (Relative Strength Index) Analysis</h2>
      <form className="analysis-form" onSubmit={handleSubmit}>
        <input name="stock" placeholder="Stock Symbol" value={form.stock} onChange={handleChange} required />
        <input type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
        <input type="date" name="end_date" value={form.end_date} onChange={handleChange} required />
        <input type="number" name="window" value={form.window} min="2" max="50" onChange={handleChange} required placeholder="RSI Window" />
        <button type="submit" className="tool-button" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze RSI"}
        </button>
      </form>
      {result && (
        <div className="results">
          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : (
            <>
              <p><strong>RSI Summary:</strong></p>
              <ul>
                <li>Lowest RSI: {result.min_rsi}</li>
                <li>Highest RSI: {result.max_rsi}</li>
                <li>Average RSI: {result.mean_rsi}</li>
                <li>Times Oversold (RSI &lt; 30): {result.num_oversold}</li>
                <li>Times Overbought (RSI &gt; 70): {result.num_overbought}</li>
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
