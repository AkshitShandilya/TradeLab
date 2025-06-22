from flask import Blueprint, request, jsonify
import yfinance as yf

cc_bp = Blueprint('currency_commodities', __name__)

TICKERS = {
    "USDINR": "USDINR=X",
    "EURINR": "EURINR=X",
    "Gold": "GC=F",         # Gold Futures (USD/oz)
    "Silver": "SI=F",       # Silver Futures (USD/oz)
    "CrudeOil": "CL=F"      # Crude Oil Futures (USD/barrel)
}

def get_history(ticker, points=20):
    hist = ticker.history(period="1d", interval="1m")
    closes = hist["Close"].dropna()
    if closes.empty:
        return [], None, None
    chart = closes.iloc[-points:].tolist()
    last = closes.iloc[-1]
    prev = closes.iloc[-2] if len(closes) > 1 else last
    return chart, last, prev

@cc_bp.route('/currency-commodities', methods=['POST', 'OPTIONS'])
def currency_commodities():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200

    tickers = yf.Tickers(" ".join(TICKERS.values()))
    # Get USDINR for conversion
    usd_inr_ticker = tickers.tickers.get("USDINR=X")
    usd_inr_chart, usd_inr, usd_inr_prev = get_history(usd_inr_ticker)
    # EURINR
    eur_inr_ticker = tickers.tickers.get("EURINR=X")
    eur_inr_chart, eur_inr, eur_inr_prev = get_history(eur_inr_ticker)
    # Gold (USD/oz)
    gold_ticker = tickers.tickers.get("GC=F")
    gold_chart, gold_usd_per_oz, gold_usd_prev = get_history(gold_ticker)
    # Silver (USD/oz)
    silver_ticker = tickers.tickers.get("SI=F")
    silver_chart, silver_usd_per_oz, silver_usd_prev = get_history(silver_ticker)
    # Crude Oil (USD/bbl)
    crude_ticker = tickers.tickers.get("CL=F")
    crude_chart, crude_usd_per_bbl, crude_usd_prev = get_history(crude_ticker)

    # Convert Gold and Silver to INR units
    gold_inr_per_gram = (gold_usd_per_oz * usd_inr / 31.1035) if gold_usd_per_oz and usd_inr else None
    gold_inr_prev = (gold_usd_prev * usd_inr / 31.1035) if gold_usd_prev and usd_inr else None
    silver_inr_per_kg = (silver_usd_per_oz * usd_inr * 1000 / 31.1035) if silver_usd_per_oz and usd_inr else None
    silver_inr_prev = (silver_usd_prev * usd_inr * 1000 / 31.1035) if silver_usd_prev and usd_inr else None

    def get_change(curr, prev):
        if curr is None or prev is None:
            return None, None
        change = curr - prev
        percent = (change / prev) * 100 if prev != 0 else 0
        return change, percent

    result = {
        "USDINR": {
            "price": usd_inr,
            "change": get_change(usd_inr, usd_inr_prev)[0],
            "change_pct": get_change(usd_inr, usd_inr_prev)[1],
            "chart": usd_inr_chart
        },
        "EURINR": {
            "price": eur_inr,
            "change": get_change(eur_inr, eur_inr_prev)[0],
            "change_pct": get_change(eur_inr, eur_inr_prev)[1],
            "chart": eur_inr_chart
        },
        "GoldINRGram": {
            "price": gold_inr_per_gram,
            "change": get_change(gold_inr_per_gram, gold_inr_prev)[0],
            "change_pct": get_change(gold_inr_per_gram, gold_inr_prev)[1],
            "chart": [
                (g * usd_inr / 31.1035) if g and usd_inr else None
                for g in gold_chart
            ]
        },
        "SilverINRKg": {
            "price": silver_inr_per_kg,
            "change": get_change(silver_inr_per_kg, silver_inr_prev)[0],
            "change_pct": get_change(silver_inr_per_kg, silver_inr_prev)[1],
            "chart": [
                (s * usd_inr * 1000 / 31.1035) if s and usd_inr else None
                for s in silver_chart
            ]
        },
        "CrudeOilUSDBbl": {
            "price": crude_usd_per_bbl,
            "change": get_change(crude_usd_per_bbl, crude_usd_prev)[0],
            "change_pct": get_change(crude_usd_per_bbl, crude_usd_prev)[1],
            "chart": crude_chart
        }
    }

    response = jsonify(result)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
