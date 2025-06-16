import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import VerifyOTP from "./VerifyOTP";
import ThankYou from "./ThankYou";
import ErrorPage from "./ErrorPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
