import React, { useState } from 'react';
import { Navbar, Nav, Form, Button, Container, NavDropdown } from 'react-bootstrap';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '../store';
import { addToHistory } from '@/lib/userData'; // Import the addToHistory function
import { readToken, removeToken } from '@/lib/authenticate'; // Import authentication functions

const MainNav = () => {
  const router = useRouter();
  const [searchField, setSearchField] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  const token = readToken(); // Get the token to check authentication

  // Handle search form submission
  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    const queryString = `title=true&q=${searchField}`;
    setSearchHistory(await addToHistory(queryString)); // Update search history
    router.push(`/artwork?${queryString}`); // Navigate to the artwork page
    setIsExpanded(false); // Collapse the navbar
  };

  // Logout function
  const handleLogout = () => {
    setIsExpanded(false); // Collapse the navbar
    removeToken(); // Remove token
    router.push('/login'); // Redirect to login page
  };

  return (
    <Navbar expanded={isExpanded} expand="lg" className="navbar-dark bg-primary fixed-top">
      <Container>
        <Navbar.Brand>Krutin Bharatbhai Polra</Navbar.Brand>
        <Navbar.Toggle
          aria-controls="main-navbar-nav"
          onClick={() => setIsExpanded(!isExpanded)}
        />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Link legacyBehavior href="/" passHref>
              <Nav.Link onClick={() => setIsExpanded(false)}>Home</Nav.Link>
            </Link>
            {token && (
              <Link legacyBehavior href="/search" passHref>
                <Nav.Link onClick={() => setIsExpanded(false)}>Advanced Search</Nav.Link>
              </Link>
            )}
          </Nav>

          {token ? (
            <>
              <Form className="d-flex me-2" onSubmit={handleSearchSubmit}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                />
                <Button variant="outline-light" type="submit">
                  Search
                </Button>
              </Form>
              <Nav>
                <NavDropdown
                  title={token?.userName || 'User'}
                  id="user-dropdown"
                  align="end"
                  onClick={() => setIsExpanded(false)}
                >
                  <Link legacyBehavior href="/favourites" passHref>
                    <NavDropdown.Item>Favourites</NavDropdown.Item>
                  </Link>
                  <Link legacyBehavior href="/history" passHref>
                    <NavDropdown.Item>History</NavDropdown.Item>
                  </Link>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </>
          ) : (
            <Nav>
              <Link legacyBehavior href="/register" passHref>
                <Nav.Link onClick={() => setIsExpanded(false)}>Register</Nav.Link>
              </Link>
              <Link legacyBehavior href="/login" passHref>
                <Nav.Link onClick={() => setIsExpanded(false)}>Login</Nav.Link>
              </Link>
            </Nav>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNav;
