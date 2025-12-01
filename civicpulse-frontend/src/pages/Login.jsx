import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authService.login(email, password);
      if (result.success) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        setError(result.message || "Invalid email or password");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-[#ECF0F1]">

      {/* Main login container */}
      <div className="w-[480px] max-w-[90%] h-[600px] bg-[#FFFFFF] rounded-[16px] shadow-[0px_20px_20px_rgba(0,0,0,0.10)] flex flex-col items-center justify-between">

        <div className="w-[360px] h-[307px] flex flex-col items-center">

          {/* Header */}
          <div className="flex flex-col items-center mb-[20px]">
            <h1 className="font-bold text-[32px] text-[#46627F] leading-[32px] text-center">
              CivicPulse Admin
            </h1>
            <p className="font-normal text-[18px] text-[#363C3C] leading-[22px] text-center mt-[10px]">
              Sign in to manage complaints
            </p>
          </div>

          {/* Inputs */}
          <div className="flex flex-col items-center gap-[20px] w-full">
            <input
              type="text"
              placeholder="Username / Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-[360px] h-[50px] bg-[#FFFFFF] border border-[#46627F] rounded-[12px]
              text-[18px] text-[#363C3C] text-center placeholder:text-center outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[360px] h-[50px] bg-[#FFFFFF] border border-[#46627F] rounded-[12px]
              text-[18px] text-[#363C3C] text-center placeholder:text-center outline-none"
            />
          </div>

          {/* Login button + error message */}
          <div className="flex flex-col items-center gap-[10px] w-full mt-[20px]">
            <button
              type="submit"
              onClick={handleLogin}
              disabled={loading}
              className="w-[360px] h-[50px] bg-[#46627F] text-[#FFFFFF] rounded-[12px]
              font-semibold text-[18px] text-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && (
              <p className="text-red-500 text-[14px] mt-[5px]">{error}</p>
            )}

            <button className="text-[#46627F] text-[14px]">
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-[18px] font-normal text-[#363C3C] mb-[20px]">
          CivicPulse v1.0
        </p>
      </div>

    </div>
  );
}

export default Login;
