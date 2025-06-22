from flask import Blueprint, request, jsonify
import yfinance as yf
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

ma_bp = Blueprint('moving_average', __name__)

@ma_bp.route('/moving_average', methods=['POST', 'OPTIONS'])
def moving_average():
    if request.method == 'OPTIONS':
        return '', 200

    data = request.get_json()
    stock = data.get('stock')
    start_date = data.get('start_date')
    end_date = data.get('end_date')
    short_window = int(data.get('short_window', 5))
    long_window = int(data.get('long_window', 20))
    initial_investment = float(data.get('initial_investment', 0))

    if not stock or not start_date or not end_date:
        return jsonify({'error': 'Missing required fields'}), 400

    df = yf.download(stock, start=start_date, end=end_date)
    if df.empty:
        return jsonify({'error': 'No data found for this symbol and date range.'}), 404

    df.index.name = 'Date'
    df['short_ma'] = df['Close'].rolling(window=short_window, min_periods=1).mean()
    df['long_ma'] = df['Close'].rolling(window=long_window, min_periods=1).mean()
    df['signal'] = (df['short_ma'] > df['long_ma']).astype(int)
    df['positions'] = df['signal'].diff().fillna(0)

    buy_signals = df[df['positions'] == 1]
    sell_signals = df[df['positions'] == -1]
    num_buys = len(buy_signals)
    num_sells = len(sell_signals)

    # Simulate trading
    cash = initial_investment
    shares = 0
    in_position = False

    for row in df.itertuples(index=True, name=None):
        date = row[0]
        price = row[4]
        pos = row[9]

        if pos == 1 and not in_position and cash > 0:
            shares = cash / price
            cash = 0
            in_position = True
        elif pos == -1 and in_position and shares > 0:
            cash = shares * price
            shares = 0
            in_position = False

    # Final sell at last close if still holding
    if shares > 0:
        last_price = df['Close'].iloc[-1]
        cash += shares * last_price
        shares = 0

    # Net return and total return (final portfolio value)
    if initial_investment > 0:
        net_return_abs = round(cash - initial_investment, 2)
        net_return_pct = round((net_return_abs / initial_investment) * 100, 2)
        total_return = round(cash, 2)  # <-- FINAL PORTFOLIO VALUE
    else:
        net_return_abs = None
        net_return_pct = None
        total_return = None

    # Plotting
    sns.set_style("whitegrid")
    plt.figure(figsize=(20, 10))
    plt.plot(df['Close'], label='Price', color='navy', linewidth=2)
    plt.plot(df['short_ma'], label=f'{short_window}-Day MA', color='green', linestyle='--')
    plt.plot(df['long_ma'], label=f'{long_window}-Day MA', color='maroon', linestyle='-.')
    plt.scatter(buy_signals.index, buy_signals['Close'], marker='^', color='lime', s=120, label='Buy', zorder=3)
    plt.scatter(sell_signals.index, sell_signals['Close'], marker='v', color='red', s=120, label='Sell', zorder=3)
    plt.title(f"{stock} Moving Average Crossover Strategy", fontsize=18, pad=20)
    plt.xlabel("Date", fontsize=14)
    plt.ylabel("Price (₹)", fontsize=14)
    plt.xticks(fontsize=11)
    plt.yticks(fontsize=11)
    plt.legend(fontsize=13)
    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=150)
    buf.seek(0)
    plot_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()

    # Safe helper functions
    def safe_float(val):
        if isinstance(val, pd.Series):
            return float(val.iloc[0])
        return float(val)

    def signal_list(signals_df):
        return [
            {'date': str(idx), 'price': safe_float(row['Close'])}
            for idx, row in signals_df.iterrows()
        ]

    return jsonify({
        'analysis': {
            'crossovers': int(df['positions'].abs().sum()),
            'trades': {
                'total_buys': int(num_buys),
                'total_sells': int(num_sells)
            },
            'returns': {
                'absolute': float(net_return_abs) if net_return_abs is not None else None,
                'percentage': float(net_return_pct) if net_return_pct is not None else None,
                'initial_investment': float(initial_investment),
                'total_return': float(total_return) if total_return is not None else None  # Now the final portfolio value
            }
        },
        'signals': {
            'buys': signal_list(buy_signals),
            'sells': signal_list(sell_signals)
        },
        'visualization': plot_base64
    })
