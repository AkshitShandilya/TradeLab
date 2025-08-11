from flask import Flask
from flask_cors import CORS
from flask_compress import Compress
from flask_caching import Cache
from routes.rsi import rsi_bp
from routes.moving_average import ma_bp
from routes.nifty_live import nifty_bp
from routes.currency_commodity import cc_bp
from routes.random_stock_game import stock_game_bp

app = Flask(__name__)


Compress(app)


cache = Cache(app, config={'CACHE_TYPE': 'simple'})


CORS(app, resources={r"/api/*": {"origins": "*"}})


# Register blueprints
app.register_blueprint(rsi_bp, url_prefix='/api')
app.register_blueprint(ma_bp, url_prefix='/api')
app.register_blueprint(nifty_bp, url_prefix='/api')
app.register_blueprint(cc_bp, url_prefix='/api')
app.register_blueprint(stock_game_bp,url_prefix='/api')


if __name__ == "__main__":
    print("Registered routes:")
    print(app.url_map)
   
    app.run(debug=True)
