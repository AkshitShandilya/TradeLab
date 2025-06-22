from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd

rsi_bp = Blueprint('rsi', __name__)

@rsi_bp.route('/rsi', methods=['POST'])
def rsi():
    data = request.get_json()
    stock = data.get('stock')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    window = int(data.get('window', 14))

    if not stock or not start_date or not end_date:
        return jsonify({'error': 'Missing required fields'}), 400

    df = yf.download(stock, start=start_date, end=end_date)
    if df.empty:
        return jsonify({'error': 'No data found for this symbol and date range.'}), 404

    delta = df['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))

    min_rsi = float(df['RSI'].min())
    max_rsi = float(df['RSI'].max())
    mean_rsi = float(df['RSI'].mean())
    num_oversold = int((df['RSI'] < 30).sum())
    num_overbought = int((df['RSI'] > 70).sum())

    return jsonify({
        'min_rsi': round(min_rsi, 2),
        'max_rsi': round(max_rsi, 2),
        'mean_rsi': round(mean_rsi, 2),
        'num_oversold': num_oversold,
        'num_overbought': num_overbought
    })
