import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authApi } from "../../api/auth";

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await authApi.resetPassword(token, { password });
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Reset password failed", err);
      setError(err.response?.data?.message || "Failed to reset password. The link might be expired.");
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
          Reset Password
        </h1>
        <p style={{ marginBottom: "32px", color: "#a3aed0", fontSize: "14px" }}>
          Enter your new password below.
        </p>

        {success ? (
          <div>
            <p style={{ color: "#05cd99", fontWeight: "600", marginBottom: "20px" }}>
              Password successfully reset!
            </p>
            <p style={{ color: "#a3aed0", fontSize: "14px" }}>
              Redirecting to login...
            </p>
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
                New Password*
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  border: "1px solid #e0e5f2",
                  outline: "none",
                  fontSize: "14px",
                }}
                required
                minLength={8}
              />
            </div>

            <div style={{ textAlign: "left" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#2b3674",
                  fontWeight: "500",
                }}
              >
                Confirm New Password*
              </label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  border: "1px solid #e0e5f2",
                  outline: "none",
                  fontSize: "14px",
                }}
                required
                minLength={8}
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
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        
        {!success && (
          <p style={{ marginTop: "20px", color: "#a3aed0", fontSize: "14px" }}>
            Back to <Link to="/login" style={{ color: "#422afb", fontWeight: "600" }}>Login</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
