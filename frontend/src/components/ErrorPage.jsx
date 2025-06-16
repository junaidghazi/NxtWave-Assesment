import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div
      className="container vh-100 d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        background: "linear-gradient(135deg, #00d5ff, #0095ff, #5d00ff)",
        color: "#0d1b2a",
        fontFamily: "'Poppins', sans-serif",
        padding: "2rem",
        animation: "fadeIn 0.8s ease forwards",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .error-box {
          padding: 3rem 2.5rem;
          max-width: 480px;
          width: 100%;
          border: 1px solid #ddd;
        }

        .error-icon {
          width: 80px;
          height: 80px;
          stroke: #dc3545;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          margin-bottom: 1rem;
        }

        .error-title {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #5d00ff;
        }

        .error-message {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          color: #333;
        }

        .btn-login {
          font-weight: 600;
          border-radius: 10px;
          padding: 0.75rem 0;
          background: linear-gradient(90deg, #5d00ff, #00d5ff);
          border: none;
          font-size: 1.1rem;
          transition: all 0.3s ease;
          width: 100%;
        }

        .btn-login:hover {
          background: linear-gradient(90deg, #00d5ff, #5d00ff);
        }

        /* Responsive tweaks */
        @media (max-width: 576px) {
          .error-box {
            padding: 2rem 1.5rem;
            max-width: 320px;
          }

          .error-icon {
            width: 60px;
            height: 60px;
            margin-bottom: 0.75rem;
          }

          .error-title {
            font-size: 2rem;
            margin-bottom: 0.75rem;
          }

          .error-message {
            font-size: 1rem;
            margin-bottom: 0.75rem;
          }

          .btn-login {
            font-size: 1rem;
            padding: 0.6rem 0;
          }
        }
      `}</style>

      <div className="bg-white rounded-4 shadow error-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="error-icon"
          fill="none"
          stroke="#dc3545"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12" y2="16" />
        </svg>

        <h1 className="error-title">Oops! Login Failed</h1>

        <p className="error-message">
          Sorry, we can't log you in. Please check your credentials and try again.
        </p>

        <Link to="/login" className="btn-login">
          Back to Login
        </Link>
      </div>
    </div>
  );
}
