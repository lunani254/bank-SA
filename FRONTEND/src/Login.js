import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import backgroundImage from "./assets/background.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "", // Can be either Username or Account Number
    password: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChange = () => {
    setIsEmployee(!isEmployee);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any existing errors

    try {
      // If logging in as an employee, first check the employment status
      if (isEmployee) {
        console.log(`Checking employment status for identifier: ${formData.identifier}`);
        const statusResponse = await axios.get(`https://localhost:3001/user/employementStatus/${formData.identifier}`);
        const { employementStatus } = statusResponse.data;

        if (employementStatus !== "employed") {
          // Show error if the user is not authorized as an employee
          setError("You are not authorized as an employee.");
          return;
        }
      }

      // Proceed with login request
      console.log(`Proceeding with login for: ${formData.identifier}`);
      const response = await axios.post('https://localhost:3001/user/login', {
        ...formData,
        isEmployee
      });

      // Extract relevant data from server response
      const { userId, username, firstName, lastName, token, accountNumber, employementStatus } = response.data;

      // Store the user info locally in localStorage
      localStorage.setItem('user', JSON.stringify({
        userId,
        username,
        firstName,
        lastName,
        token,
        accountNumber,
        employementStatus
      }));

      // Navigate based on the user's role
      if (isEmployee) {
        navigate("/employee-portal");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      // Handle any login errors and display appropriate messages
      console.error("Login error:", error.response?.data?.message || "An error occurred during login");
      setError(error.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.header}>Login Form</h2>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.row}>
          <input
            type="text"
            name="identifier"
            placeholder="Username or Account Number"
            value={formData.identifier}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              style={styles.passwordInput}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={styles.eyeButton}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Checkbox to switch between normal user and employee login */}
        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            checked={isEmployee}
            onChange={handleCheckboxChange}
            style={styles.checkbox}
            id="employeeCheckbox"
          />
          <label htmlFor="employeeCheckbox" style={styles.checkboxLabel}>Login as Employee</label>
        </div>

        <button type="submit" style={styles.submitButton}>
          {isEmployee ? "Log in as Employee" : "Log in as User"}
        </button>

        <div style={styles.forgotSection}>
          <button type="button" style={styles.forgotButton}>Forgot Password</button>
        </div>
      </form>
    </div>
  );
};

// Styles for the Login form
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "20px",
  },
  form: {
    padding: "40px",
    maxWidth: "400px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "10px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    height: "auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "25px",
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  row: {
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  passwordContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  passwordInput: {
    width: '100%',
    padding: '12px',
    paddingRight: '40px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  eyeButton: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    gap: "10px",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },
  checkboxLabel: {
    fontSize: "16px",
    cursor: "pointer",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  forgotSection: {
    textAlign: "center",
    marginTop: "20px",
  },
  forgotButton: {
    padding: "10px 20px",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "14px",
  },
};

export default Login;
