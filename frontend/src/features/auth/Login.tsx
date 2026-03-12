import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES, type Role } from "../../utils/constants";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(ROLES.ADMIN);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(role);
      if (role === ROLES.ADMIN) {
        navigate("/admin/home");
      } else {
        navigate("/chapterleader/club");
      }
    } catch (error) {
      console.error("Login failed", error);
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
          style={{ marginBottom: "8px", fontWeight: "700", color: "#2b3674" }}
        >
          Sign In
        </h1>
        <p style={{ marginBottom: "32px", color: "#a3aed0" }}>
          Enter your details to log in!
        </p>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
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
              placeholder="mail@simmmple.com"
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

          <div style={{ textAlign: "left" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#2b3674",
                fontWeight: "500",
              }}
            >
              Password*
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
              Select Role
            </label>
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setRole(ROLES.ADMIN)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: role === ROLES.ADMIN ? "#422afb" : "#f4f7fe",
                  color: role === ROLES.ADMIN ? "#fff" : "#422afb",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole(ROLES.CHAPTER)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor:
                    role === ROLES.CHAPTER ? "#422afb" : "#f4f7fe",
                  color: role === ROLES.CHAPTER ? "#fff" : "#422afb",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Chapter
              </button>
            </div>
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
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
