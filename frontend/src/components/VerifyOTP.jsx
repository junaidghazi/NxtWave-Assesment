import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function VerifyOTP() {
  const [otpInput, setOtpInput] = useState("");
  const navigate = useNavigate();
  const email = localStorage.getItem("otpEmail");

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post("https://nxtwave-assesment.onrender.com/verify-otp", {
        email,
        otp: otpInput.trim(),
      });

      localStorage.setItem("userData", JSON.stringify(res.data.user));
      localStorage.removeItem("otpEmail");

      navigate("/thank-you");
    } catch (err) {
      alert(err.response?.data?.error || "OTP verification failed.");
      navigate("/error");
    }
  };

  if (!email) return null;

  return (
    <div className="verify-container">
      <style>{`
        .verify-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #00d5ff, #0095ff, #5d00ff);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        form {
          background: white;
          padding: 3rem 2.5rem;
          border-radius: 1.5rem;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
          width: 400px;
          max-width: 100%;
          border: 1px solid #ddd;
          text-align: center;
        }

        h2 {
          font-weight: 700;
          font-size: 2rem;
          color: #5d00ff;
          margin-bottom: 1rem;
        }

        p {
          color: #6c757d;
          font-weight: 500;
          font-size: 0.95rem;
          margin-bottom: 2rem;
        }

        p span {
          color: #5d00ff;
          font-weight: 600;
        }

        input[type="text"] {
          border-radius: 10px;
          padding: 12px;
          font-size: 1.2rem;
          letter-spacing: 0.3rem;
          text-align: center;
          width: 100%;
          border: 1px solid #ced4da;
          transition: border-color 0.3s, box-shadow 0.3s;
          outline: none;
          margin-bottom: 1.5rem;
        }

        input[type="text"]:focus {
          border-color: #5d00ff;
          box-shadow: 0 0 8px rgba(93, 0, 255, 0.6);
        }

        button {
          background: linear-gradient(90deg, #5d00ff, #00d5ff);
          border: none;
          padding: 12px 0;
          font-weight: 600;
          font-size: 1.2rem;
          transition: background 0.3s ease;
          border-radius: 10px;
          width: 100%;
          color: white;
          cursor: pointer;
        }

        button:hover {
          background: linear-gradient(90deg, #00d5ff, #5d00ff);
        }

        /* Responsive adjustments */
        @media (max-width: 576px) {
          form {
            padding: 2rem 1.5rem;
            width: 100%;
          }

          h2 {
            font-size: 1.6rem;
          }

          p {
            font-size: 0.85rem;
            margin-bottom: 1.5rem;
          }

          input[type="text"] {
            font-size: 1rem;
            letter-spacing: 0.2rem;
            padding: 10px;
          }

          button {
            font-size: 1rem;
            padding: 10px 0;
          }
        }
      `}</style>

      <form onSubmit={handleSubmit} noValidate>
        <h2>Verify OTP</h2>

        <p>
          OTP sent on your registered email: <br />
          <span>{email}</span>
        </p>

        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otpInput}
          onChange={(e) => setOtpInput(e.target.value)}
          required
          maxLength={6}
          pattern="\d{6}"
          inputMode="numeric"
          autoComplete="one-time-code"
        />

        <button type="submit">Verify</button>
      </form>
    </div>
  );
}
