import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ThankYou() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleDelete = async () => {
    try {
      await fetch(`https://nxtwave-assesment.onrender.com/delete-account/${user.email}`, {
        method: "DELETE",
      });
      alert("Account deleted successfully.");
      localStorage.clear();
      navigate("/register");
    } catch (err) {
      alert("Failed to delete account.");
    }
  };

  if (!user) return null;

  return (
    <div className="thankyou-container">
      <style>{`
        .thankyou-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #00d5ff, #0095ff, #5d00ff);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          text-align: center;
        }

        .thankyou-container h1 {
          color: #5d00ff;
          font-weight: 700;
          font-size: 2.2rem;
          margin-bottom: 2rem;
        }

        .user-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 1rem;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
          width: 350px;
          max-width: 100%;
          border: 1px solid #ddd;
        }

        .profile-image {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
          border: 3px solid #5d00ff;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .user-card p {
          margin: 0.4rem 0;
          font-size: 1.1rem;
        }

        .btn-remove {
          margin-top: 1.5rem;
          width: 100%;
          font-weight: 600;
          font-size: 1.1rem;
          border-radius: 10px;
          padding: 10px 0;
          background-color: #dc3545;
          border: none;
          color: white;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .btn-remove:hover {
          background-color: #b30000;
        }

        /* Responsive tweaks */
        @media (max-width: 576px) {
          .thankyou-container h1 {
            font-size: 1.6rem;
            margin-bottom: 1.2rem;
          }

          .user-card {
            padding: 1.5rem 1rem;
            width: 100%;
          }

          .profile-image {
            width: 120px;
            height: 120px;
            margin-bottom: 0.8rem;
          }

          .user-card p {
            font-size: 1rem;
          }

          .btn-remove {
            font-size: 1rem;
            padding: 8px 0;
            margin-top: 1rem;
          }
        }
      `}</style>

      <h1>Thank you for logging in, {user.name}!</h1>

      <div className="user-card">
        <img
          src={`data:image/jpeg;base64,${user.image}`}
          alt="Profile"
          className="profile-image"
        />
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Company:</strong> {user.companyName || "N/A"}
        </p>
        <p>
          <strong>Age:</strong> {user.age || "N/A"}
        </p>
        <p>
          <strong>DOB:</strong> {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
        </p>

        <button className="btn-remove" onClick={handleDelete}>
          Remove Account
        </button>
      </div>
    </div>
  );
}
