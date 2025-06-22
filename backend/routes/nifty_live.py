from flask import Blueprint, request, jsonify
import yfinance as yf

nifty_bp = Blueprint('nifty_live', __name__)

DEFAULT_NIFTY_SYMBOLS = [
    "RELIANCE.NS", "HDFCBANK.NS", "ICICIBANK.NS", "INFY.NS", "TCS.NS",
    "LT.NS", "ITC.NS", "SBIN.NS", "KOTAKBANK.NS", "BHARTIARTL.NS"
]

@nifty_bp.route('/nifty-live', methods=['POST', 'OPTIONS'])
def nifty_live():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response, 200

    data = request.get_json(silent=True) or {}
    symbols = data.get("symbols", DEFAULT_NIFTY_SYMBOLS)

    stocks = []
    tickers = yf.Tickers(" ".join(symbols))
    for symbol in symbols:
        ticker = tickers.tickers.get(symbol)
        if not ticker:
            stocks.append({
                "symbol": symbol.replace(".NS", ""),
                "name": "",
                "price": None,
                "change": None
            })
            continue
        info = ticker.info
        price = info.get("regularMarketPrice")
        prev_close = info.get("regularMarketPreviousClose")
        name = info.get("shortName") or info.get("longName") or ""
        if price is not None and prev_close is not None:
            change = round(price - prev_close, 2)
        else:
            change = 0
        stocks.append({
            "symbol": symbol.replace(".NS", ""),
            "name": name,
            "price": round(price, 2) if price else None,
            "change": change
        })

    response = jsonify(stocks)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
