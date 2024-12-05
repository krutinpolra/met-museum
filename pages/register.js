import React, { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { registerUser } from "@/lib/authenticate";
import styles from "@/styles/Register.module.css";

export default function Register() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
  
    // Frontend validations
    if (!user) {
      setError("Username is required.");
      setLoading(false);
      return;
    }
    if (!password) {
      setError("Password is required.");
      setLoading(false);
      return;
    }
    if (!password2) {
      setError("Please confirm your password.");
      setLoading(false);
      return;
    }
    if (password !== password2) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
  
    try {
      // Call the backend to register the user
      const isRegistered = await registerUser(user, password, password2);
  
      if (isRegistered) {
        router.push("/login"); // Redirect to login page on successful registration
      }
    } catch (err) {
      // Properly handle backend errors
      if (err.message.includes("User Name already taken")) {
        setError("The username is already taken. Please choose a different one.");
      } else if (err.message.includes("Passwords do not match")) {
        setError("Passwords do not match.");
      } else {
        setError(err.message || "An error occurred while registering.");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={styles.registerContainer}>
      <Card className={styles.card}>
        <Card.Body>
          <h3 className={styles.heading}>Register</h3>
          <p className={styles.subheading}>Register for an account:</p>
        </Card.Body>
      </Card>
      {error && <Alert className={styles.alert} variant="danger">{error}</Alert>}
      <Form className={styles.form} onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>User:</Form.Label>
          <Form.Control
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Enter username"
            className={styles.input}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>Password:</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className={styles.input}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className={styles.label}>Confirm Password:</Form.Label>
          <Form.Control
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Confirm password"
            className={styles.input}
          />
        </Form.Group>
        <Button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </Form>
    </div>
  );
}
