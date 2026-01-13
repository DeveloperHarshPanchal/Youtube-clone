import { Link, useRouteError, isRouteErrorResponse } from "react-router";
import SearchBar from "./SearchBar";
import "./Error.css";

function Error() {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const logo = mediaQuery.matches ? "/logo_white.png" : "/logo_black.png";

  const error = useRouteError();
  console.log(error);

  return (
    <main className="error-page">
      <div>
        {isRouteErrorResponse(error) ? (
          <p>{error.data}</p>
        ) : (
          <p>{error.message}</p>
        )}
      </div>

      <Link to="/">
        <img src={logo} alt="YouTube Logo" width={300} />
      </Link>
    </main>
  );
}

export default Error;
