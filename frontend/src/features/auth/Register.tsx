import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid #e0e5f2",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box" as const,
};

const errorStyle = {
  color: "#e83a3a",
  fontSize: "12px",
  marginTop: "4px",
  display: "block",
  fontWeight: "500",
};

const Register: React.FC = () => {
  const { registerChapter } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [location, setLocation] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!universityName.trim()) newErrors.universityName = "University name is required";
    if (!location.trim()) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await registerChapter({
        name,
        email,
        password,
        uid: Date.now().toString(), // Auto-generate UID since it's no longer asked for
        universeMetaData: { 
            name: universityName, 
            location 
        }
      });
      alert("Registration successful. Your account is pending verification.");
      navigate("/login");
    } catch (error: any) {
      console.error("Registration failed", error);
      alert(error.response?.data?.message || "Registration failed");
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
        minHeight: "100vh",
        backgroundColor: "#f4f7fe",
        padding: "20px",
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
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h1 style={{ marginBottom: "8px", fontWeight: "700", color: "#2b3674" }}>
          Sign Up
        </h1>
        <p style={{ marginBottom: "32px", color: "#a3aed0" }}>
          Create your Chapter Leader account
        </p>

        <form onSubmit={handleRegister} noValidate style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "4px", color: "#2b3674", fontWeight: "500" }}>Name*</label>
            <input type="text" value={name} onChange={(e) => { setName(e.target.value); setErrors(prev => ({ ...prev, name: "" })); }} style={{ ...inputStyle, border: errors.name ? "1px solid #e83a3a" : inputStyle.border }} />
            {errors.name && <span style={errorStyle}>{errors.name}</span>}
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "4px", color: "#2b3674", fontWeight: "500" }}>Email*</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: "" })); }} style={{ ...inputStyle, border: errors.email ? "1px solid #e83a3a" : inputStyle.border }} />
            {errors.email && <span style={errorStyle}>{errors.email}</span>}
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "4px", color: "#2b3674", fontWeight: "500" }}>Password*</label>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: "" })); }} style={{ ...inputStyle, border: errors.password ? "1px solid #e83a3a" : inputStyle.border }} />
            {errors.password && <span style={errorStyle}>{errors.password}</span>}
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "4px", color: "#2b3674", fontWeight: "500" }}>University Name*</label>
            <input type="text" value={universityName} onChange={(e) => { setUniversityName(e.target.value); setErrors(prev => ({ ...prev, universityName: "" })); }} style={{ ...inputStyle, border: errors.universityName ? "1px solid #e83a3a" : inputStyle.border }} />
            {errors.universityName && <span style={errorStyle}>{errors.universityName}</span>}
          </div>
          
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: "4px", color: "#2b3674", fontWeight: "500" }}>Location*</label>
            <input type="text" value={location} onChange={(e) => { setLocation(e.target.value); setErrors(prev => ({ ...prev, location: "" })); }} style={{ ...inputStyle, border: errors.location ? "1px solid #e83a3a" : inputStyle.border }} />
            {errors.location && <span style={errorStyle}>{errors.location}</span>}
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
              marginTop: "10px",
              transition: "0.3s",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
        
        <p style={{ marginTop: "20px", color: "#a3aed0" }}>
          Already have an account? <Link to="/login" style={{ color: "#422afb", fontWeight: "600" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
