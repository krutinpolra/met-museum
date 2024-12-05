import React, { useState } from "react";
import { useRouter } from "next/router";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { authenticateUser } from "@/lib/authenticate";
import { useAtom } from "jotai";
import { favouritesAtom, searchHistoryAtom } from "@/store";
import { getFavourites, getHistory } from "@/lib/userData";
import styles from "@/styles/Login.module.css"; // Import the CSS module

export default function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  const updateAtoms = async () => {
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const isAuthenticated = await authenticateUser(user, password);
      if (isAuthenticated) {
        await updateAtoms(); // Update favourites and history
        router.push("/favourites"); // Redirect to favourites page
      } else {
        setError("Invalid username or password.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`container ${styles.loginContainer}`}>
      <Card className={styles.card}>
        <Card.Body>
          <h3 className={styles.heading}>Login</h3>
          <p className={styles.subheading}>Enter your login information below:</p>
        </Card.Body>
      </Card>
      {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}
      <Form onSubmit={handleSubmit} className={styles.form}>
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
        <Button variant="primary" type="submit" disabled={loading} className={styles.button}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </div>
  );
}
