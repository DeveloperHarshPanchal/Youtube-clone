import { UserCircle2 } from "lucide-react";
import { Link } from "react-router";
import "./LoginButton.css";

function LoginButton() {
  return (
    <Link to="/login" className="login-button">
      <UserCircle2 />
      <span className="login-button-text">Login</span>
    </Link>
  );
}

export default LoginButton;
