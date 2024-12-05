// components/Layout.js
import React from 'react';
import MainNav from './MainNav';
import { Container } from 'react-bootstrap';

const Layout = ({ children }) => {
  return (
    <>
      <MainNav />
      <div style={{ paddingTop: '100px' }}>
        <Container>
          {children}
        </Container>
      </div>
    </>
  );
};

export default Layout;
