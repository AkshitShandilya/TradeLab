# backend/stock_game.py
from flask import Blueprint, request, jsonify
import yfinance as yf
import random

stock_game_bp = Blueprint("stock_game", __name__, url_prefix="/api")


NIFTY_SYMBOLS = [
    "ADANIENT.NS", "ADANIPORTS.NS", "APOLLOHOSP.NS", "ASIANPAINT.NS", "AXISBANK.NS",
    "BAJAJ-AUTO.NS", "BAJFINANCE.NS", "BAJAJFINSV.NS", "BEL.NS", "BHARTIARTL.NS",
    "CIPLA.NS", "COALINDIA.NS", "DRREDDY.NS", "EICHERMOT.NS", "ETERNAL.NS",
    "GRASIM.NS", "HCLTECH.NS", "HDFCBANK.NS", "HDFCLIFE.NS", "HEROMOTOCO.NS",
    "HINDALCO.NS", "HINDUNILVR.NS", "ICICIBANK.NS", "INDUSINDBK.NS", "INFY.NS",
    "ITC.NS", "JIOFIN.NS", "JSWSTEEL.NS", "KOTAKBANK.NS", "LT.NS",
    "M&M.NS", "MARUTI.NS", "NESTLEIND.NS", "NTPC.NS", "ONGC.NS",
    "POWERGRID.NS", "RELIANCE.NS", "SBILIFE.NS", "SHRIRAMFIN.NS", "SBIN.NS",
    "SUNPHARMA.NS", "TCS.NS", "TATACONSUM.NS", "TATAMOTORS.NS", "TATASTEEL.NS",
    "TECHM.NS", "TITAN.NS", "TRENT.NS", "ULTRACEMCO.NS", "WIPRO.NS"
]


@stock_game_bp.route('/random_stock_game', methods=['POST', 'OPTIONS'])
def random_stock_game():
    if request.method == 'OPTIONS':
        return '', 204

    symbol = random.choice(NIFTY_SYMBOLS)
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period="6d")
    closes = hist['Close'].tolist()

    if len(closes) < 6:
        return jsonify({"error": f"Not enough data for {symbol}"}), 400
    
    return jsonify({
        "symbol": symbol,
        "last_5_days": closes[:5],
        "next_day": closes[5]
    })
