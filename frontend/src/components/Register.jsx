import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    age: "",
    dob: "",
    image: null,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else if (name === "dob") {
      const dobDate = new Date(value);
      const today = new Date();

      let age = today.getFullYear() - dobDate.getFullYear();
      const m = today.getMonth() - dobDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
        age--;
      }

      setForm({ ...form, dob: value, age: age >= 0 ? age.toString() : "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Please upload an image (PNG/JPG).");
      return;
    }
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!validEmail) {
      alert("Invalid email format.");
      return;
    }

    try {
      const formData = new FormData();
      for (const key in form) {
        formData.append(key, form[key]);
      }

      const res = await axios.post("https://nxtwave-assesment.onrender.com/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.error) alert(err.response.data.error);
      else alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="register-container">
      <style>{`
        .register-container {
          background: linear-gradient(135deg, #00d5ff, #0095ff, #5d00ff);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
        }

        form.register-form {
          background: white;
          padding: 3rem 2.5rem;
          border-radius: 1rem;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
          width: 400px;
          max-width: 100%;
          border: 1px solid #ddd;
        }

        form.register-form h2 {
          font-weight: 700;
          font-size: 2.2rem;
          color: #5d00ff;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        form.register-form input {
          border-radius: 10px;
          padding: 12px;
          font-size: 1.1rem;
          transition: border-color 0.3s, box-shadow 0.3s;
          border: 1px solid #ced4da;
          width: 100%;
          margin-bottom: 1rem;
        }

        form.register-form input:focus {
          border-color: #5d00ff;
          box-shadow: 0 0 8px rgba(93, 0, 255, 0.6);
          outline: none;
        }

        form.register-form input[type="file"] {
          padding: 8px 12px;
        }

        form.register-form button {
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

        form.register-form button:hover {
          background: linear-gradient(90deg, #00d5ff, #5d00ff);
        }

        form.register-form p {
          font-weight: 600;
          text-align: center;
          margin-top: 1rem;
        }

        form.register-form p a {
          color: #5d00ff;
          text-decoration: none;
        }

        form.register-form p a:hover {
          text-decoration: underline;
        }

        /* Responsive tweaks */
        @media (max-width: 576px) {
          form.register-form {
            padding: 2rem 1.5rem;
            width: 100%;
          }

          form.register-form h2 {
            font-size: 1.8rem;
            margin-bottom: 1rem;
          }

          form.register-form input {
            font-size: 1rem;
            padding: 10px;
            margin-bottom: 0.8rem;
          }

          form.register-form button {
            font-size: 1rem;
            padding: 10px 0;
          }
        }
      `}</style>

      <form onSubmit={handleSubmit} className="register-form" encType="multipart/form-data">
        <h2>Register</h2>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="text" name="companyName" placeholder="Company Name" onChange={handleChange} />
        <input type="date" name="dob" placeholder="Date of Birth" value={form.dob} onChange={handleChange} />
        <input type="number" name="age" placeholder="Age" value={form.age} onChange={handleChange} />
        <input type="file" name="image" accept="image/png, image/jpeg" onChange={handleChange} required />
        <button type="submit">Create Account</button>
        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
