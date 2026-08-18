import { Link } from "react-router-dom";
import "../components/notFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-box">
        <h1>404</h1>
        <h2>Page Not Found</h2>

        <p>
          The page you are looking for does not exist.
        </p>

        <Link to="/" className="not-found-btn">
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;