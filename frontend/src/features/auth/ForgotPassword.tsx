import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await authApi.forgotPassword({ email });
      setSuccess(true);
      setEmail("");
    } catch (err: any) {
      console.error("Forgot password failed", err);
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f4f7fe",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          textAlign: "center",
        }}
      >
        <h1
          style={{ marginBottom: "8px", fontWeight: "700", color: "#2b3674", fontSize: "24px" }}
        >
          Forgot Password
        </h1>
        <p style={{ marginBottom: "32px", color: "#a3aed0", fontSize: "14px" }}>
          Enter your email and we'll send you a link to reset your password.
        </p>

        {success ? (
          <div style={{ marginBottom: "20px" }}>
            <p style={{ color: "#05cd99", fontWeight: "600", marginBottom: "20px" }}>
              Password reset link has been sent to your email.
            </p>
            <Link to="/login" style={{ color: "#422afb", fontWeight: "600", textDecoration: "none" }}>
              Back to Login
            </Link>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {error && (
              <p style={{ color: "#ee5d50", fontSize: "14px", margin: 0 }}>{error}</p>
            )}

            <div style={{ textAlign: "left" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#2b3674",
                  fontWeight: "500",
                }}
              >
                Email*
              </label>
              <input
                type="email"
                placeholder="mail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  border: "1px solid #e0e5f2",
                  outline: "none",
                  fontSize: "14px",
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "#422afb",
                color: "#fff",
                border: "none",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                marginTop: "8px",
                transition: "0.3s",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {!success && (
          <p style={{ marginTop: "20px", color: "#a3aed0", fontSize: "14px" }}>
            Wait, I remember my password...{" "}
            <Link to="/login" style={{ color: "#422afb", fontWeight: "600" }}>
              Click here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
