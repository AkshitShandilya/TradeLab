import { FaChartLine, FaCogs, FaShieldAlt } from "react-icons/fa";
import "../styles/Landingpage.css";
import LiveNiftyStocks from "../components/LiveNiftyStocks.jsx";
import CurrencyCommodityBox from "../components/CurrencyCommodityBox.jsx";
import PersonalDashboardBox from "../components/PersonalDashboard.jsx";

export default function LandingPage() {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">All Your Trading Techniques</h1>
        <p className="hero-subtitle">
          Welcome to TradeLab.<br />
          Use the navigation above to access your technical analysis tools.
        </p>
        <div className="hero-features">
          <div className="feature">
            <span className="feature-icon">
              <FaChartLine />
            </span>
            <div className="feature-caption">Advanced Analytics</div>
          </div>
          <div className="feature">
            <span className="feature-icon">
              <FaCogs />
            </span>
            <div className="feature-caption">Custom Strategies</div>
          </div>
          <div className="feature">
            <span className="feature-icon">
              <FaShieldAlt />
            </span>
            <div className="feature-caption">Secure & Reliable</div>
          </div>
        </div>
      </div>
      <div className="dashboard-row">
       <LiveNiftyStocks />
      <CurrencyCommodityBox />
       <PersonalDashboardBox />
      </div>

    </div>
  );
}
