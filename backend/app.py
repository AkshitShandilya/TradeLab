from flask import Flask
from flask_cors import CORS
from flask_compress import Compress
from flask_caching import Cache
from routes.rsi import rsi_bp
from routes.moving_average import ma_bp
from routes.nifty_live import nifty_bp
from routes.currency_commodity import cc_bp

app = Flask(__name__)

# Enable response compression for faster client loads
Compress(app)

# Enable simple in-memory caching (for production, use Redis or similar)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})

# Apply CORS to all /api/* routes; restrict origins in production if possible
CORS(app, resources={r"/api/*": {"origins": "*"}})
# For production, use: {"origins": ["https://yourdomain.com"]}

# Register blueprints
app.register_blueprint(rsi_bp, url_prefix='/api')
app.register_blueprint(ma_bp, url_prefix='/api')
app.register_blueprint(nifty_bp, url_prefix='/api')
app.register_blueprint(cc_bp, url_prefix='/api')

if __name__ == "__main__":
    print("Registered routes:")
    print(app.url_map)
    # For production, run with Gunicorn or uWSGI (see below)
    app.run(debug=True)
