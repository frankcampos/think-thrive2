import Link from 'next/link';
import React from 'react';
import {
  Navbar, Container, Nav, Button, Image,
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import { signOut } from '../utils/auth';

export default function NavBar() {
  const router = useRouter();
  return (
    <Navbar collapseOnSelect expand="lg" bg="grey" variant="dark" style={{ background: 'grey', marginBottom: '40px' }}>
      {' '}
      {/* Change the bg and variant props here */}
      <Container fluid>
        <Nav>
          <Image src="/thinkthrive.png" alt="Think Thrive" className=" logo" style={{ height: '40px', width: '40px', backgroundColor: 'transparent' }} />
          <Link passHref href="/">
            <Navbar.Brand>ThinkThrive</Navbar.Brand>
          </Link>
        </Nav>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* CLOSE NAVBAR ON LINK SELECTION: https://stackoverflow.com/questions/72813635/collapse-on-select-react-bootstrap-navbar-with-nextjs-not-working */}
            <Link passHref href="/">
              <Nav.Link className={router.pathname === '/' ? 'active-link' : ''}>Learning Paths</Nav.Link>
            </Link>
            <Link passHref href="/my-paths">
              <Nav.Link variant="underline" className={router.pathname === '/my-paths' ? 'active-link' : ''}>My Paths</Nav.Link>
            </Link>
          </Nav>
          <Nav style={{ alignContent: 'flex-end' }}>
            <Link passHref href="/">
              <Button variant="dark" onClick={signOut}>
                Sign Out
              </Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
