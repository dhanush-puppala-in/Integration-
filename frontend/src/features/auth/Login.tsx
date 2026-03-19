import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES, type Role } from "../../utils/constants";
import { ChevronDown, Shield, User } from "lucide-react";

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(ROLES.ADMIN);
  const [loading, setLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, role);
      if (role === ROLES.ADMIN) {
        navigate("/admin/home");
      } else {
        navigate("/chapterleader/club");
      }
    } catch (error: any) {
      console.error("Login failed", error);
      alert(error.response?.data?.message || "Login failed");
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

          <div style={{ textAlign: "left", position: "relative" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#2b3674",
                fontWeight: "500",
              }}
            >
              Role
            </label>
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{
                width: "100%",
                padding: "14px 20px",
                borderRadius: "12px",
                border: "1px solid #e0e5f2",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.2s ease"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#2b3674", fontWeight: "600" }}>
                {/* {role === ROLES.ADMIN ? <Shield size={18} color="#422afb" /> : <User size={18} color="#422afb" />} */}
                {role === ROLES.ADMIN ? "Admin" : "Chapter Leader"}
              </div>
              <ChevronDown size={20} color="#a3aed0" style={{ transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "0.2s transform ease" }} />
            </div>

            {isDropdownOpen && (
              <div 
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  width: "100%",
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                  border: "1px solid #e0e5f2",
                  zIndex: 100,
                  overflow: "hidden"
                }}
              >
                <div 
                  onClick={() => { setRole(ROLES.ADMIN); setIsDropdownOpen(false); }}
                  style={{
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    backgroundColor: role === ROLES.ADMIN ? "#f4f7fe" : "#fff",
                    borderBottom: "1px solid #f4f7fe",
                    transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f4f7fe"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = role === ROLES.ADMIN ? "#f4f7fe" : "#fff"}
                >
                  {/* <Shield size={18} color={role === ROLES.ADMIN ? "#422afb" : "#a3aed0"} /> */}
                  <span style={{ fontWeight: "600", color: role === ROLES.ADMIN ? "#422afb" : "#2b3674" }}>Admin</span>
                </div>
                
                <div 
                  onClick={() => { setRole(ROLES.CHAPTER); setIsDropdownOpen(false); }}
                  style={{
                    padding: "14px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    backgroundColor: role === ROLES.CHAPTER ? "#f4f7fe" : "#fff",
                    transition: "background-color 0.15s ease"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f4f7fe"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = role === ROLES.CHAPTER ? "#f4f7fe" : "#fff"}
                >
                  {/* <User size={18} color={role === ROLES.CHAPTER ? "#422afb" : "#a3aed0"} /> */}
                  <span style={{ fontWeight: "600", color: role === ROLES.CHAPTER ? "#422afb" : "#2b3674" }}>Chapter Leader</span>
                </div>
              </div>
            )}
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
        
        <p style={{ marginTop: "20px", color: "#a3aed0" }}>
          Don't have an account? <Link to="/register" style={{ color: "#422afb", fontWeight: "600" }}>Sign Up</Link>
        </p>
        <p style={{ marginTop: "10px", color: "#a3aed0", fontSize: "14px" }}>
          <Link to="/forgot-password" style={{ color: "#422afb", fontWeight: "600" }}>Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
