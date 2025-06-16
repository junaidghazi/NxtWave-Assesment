import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await axios.post('https://nxtwave-assesment.onrender.com/login', { email, password });

      if (result.data.message === 'OTP generated and sent to your email.') {
        localStorage.setItem("otpEmail", email);
        navigate('/verify-otp');
      } else {
        alert('Something went wrong.');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Login failed');
      navigate('/error');
    }
  };

  return (
    <div
      className="login-container"
    >
      <style>{`
        .login-container {
          background: linear-gradient(135deg, #00d5ff, #0095ff, #5d00ff);
          box-shadow: inset 0 0 50px rgba(0,0,0,0.2);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        form.login-form {
          background: white;
          padding: 3rem 2.5rem;
          border-radius: 1rem;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
          width: 400px;
          max-width: 100%;
          border: 1px solid #ddd;
        }

        form.login-form h2 {
          font-weight: 700;
          font-size: 2.2rem;
          color: #007bff;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        form.login-form input {
          border-radius: 10px;
          padding: 12px;
          font-size: 1.1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          border: 1px solid #ced4da;
          width: 100%;
          margin-bottom: 1rem;
        }

        form.login-form input:focus {
          border-color: #5d00ff;
          box-shadow: 0 0 8px rgba(93, 0, 255, 0.6);
          outline: none;
        }

        form.login-form button {
          width: 100%;
          background: linear-gradient(90deg, #5d00ff, #00d5ff);
          border: none;
          padding: 12px 0;
          font-weight: 600;
          font-size: 1.2rem;
          cursor: pointer;
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        form.login-form button:hover {
          background: linear-gradient(90deg, #00d5ff, #5d00ff);
        }

        form.login-form p {
          font-weight: 600;
          text-align: center;
          margin-top: 1rem;
        }

        form.login-form p a {
          color: #5d00ff;
          text-decoration: none;
        }

        form.login-form p a:hover {
          text-decoration: underline;
        }

        /* Responsive tweaks */
        @media (max-width: 576px) {
          form.login-form {
            padding: 2rem 1.5rem;
            width: 100%;
          }

          form.login-form h2 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
          }

          form.login-form input {
            font-size: 1rem;
            padding: 10px;
            margin-bottom: 0.8rem;
          }

          form.login-form button {
            font-size: 1rem;
            padding: 10px 0;
          }
        }
      `}</style>

      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
