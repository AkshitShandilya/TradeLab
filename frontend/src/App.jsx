import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import LandingPage from "./pages/landingpage";
import RsiPage from "./pages/rsipage";
import MovingAveragePage from "./pages/movingaveragepage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <div className="main-panel">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/rsi" element={<RsiPage />} />
              <Route path="/moving-average" element={<MovingAveragePage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
