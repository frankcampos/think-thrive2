import Link from 'next/link';
import React from 'react';
import {
  Navbar, Container, Nav, Button, Image,
} from 'react-bootstrap';
import { signOut } from '../utils/auth';

export default function NavBar() {
  return (
    <Navbar collapseOnSelect expand="lg" bg="grey" variant="dark" style={{ background: 'grey', marginBottom: '40px' }}>
      {' '}
      {/* Change the bg and variant props here */}
      <Container fluid>
        <Nav>
          <Image src="/thinkthrive.png" alt="Think Thrive" className=" logo" style={{ height: '100px', backgroundColor: 'transparent' }} />
          <Link passHref href="/">
            <Navbar.Brand style={{ marginLeft: '10px', marginTop: '30px' }}>ThinkThrive</Navbar.Brand>
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
            <Link passHref href="/ask-ai">
              <Nav.Link variant="underline">Ask me AI</Nav.Link>
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
