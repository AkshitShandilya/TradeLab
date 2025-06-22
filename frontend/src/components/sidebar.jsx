// Sidebar.jsx
export default function Sidebar({ open, onClose }) {
  return (
    <nav className={`sidebar${open ? " open" : ""}`}>
      {/* Sidebar content here */}
      {/* Optionally, add a close button for mobile */}
      <button className="sidebar-close" onClick={onClose}>×</button>
      {/* ...rest */}
    </nav>
  );
}
