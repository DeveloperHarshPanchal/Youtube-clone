import { useSelector } from "react-redux";
import { Link } from "react-router";
import "./Logo.css";

function Logo() {
  const theme = useSelector((state) => state.theme);
  const logo = theme === "dark" ? "/logo_white.png" : "/logo_black.png";

  return (
    <Link to="/" className="logo-link">
      <img src={logo} alt="YouTube Logo" className="logo-image" />
    </Link>
  );
}

export default Logo;
