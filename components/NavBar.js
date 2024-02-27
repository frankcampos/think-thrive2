import Link from 'next/link';
import React from 'react';
import {
  Navbar, Container, Nav, Button, Image,
} from 'react-bootstrap';
import { signOut } from '../utils/auth';

export default function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="black" variant="dark">
      {' '}
      {/* Change the bg and variant props here */}
      <Container fluid>
        <Nav>
          <Image src="/thinkthrive.png" alt="No Simple Books" style={{ height: '40px', backgroundColor: 'transparent' }} />
          <Link passHref href="/">
            <Navbar.Brand style={{ marginLeft: '10px' }}>ThinkThrive</Navbar.Brand>
          </Link>
        </Nav>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* CLOSE NAVBAR ON LINK SELECTION: https://stackoverflow.com/questions/72813635/collapse-on-select-react-bootstrap-navbar-with-nextjs-not-working */}
            <Link passHref href="/">
              <Nav.Link variant="underline">Learning Paths</Nav.Link>
            </Link>
            <Link passHref href="/my-paths">
              <Nav.Link variant="underline">My Paths</Nav.Link>
            </Link>
          </Nav>
          <Nav style={{ alignContent: 'flex-end' }}>
            <Button variant="dark" onClick={signOut}>
              Sign Out
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
