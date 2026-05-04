import Link from 'next/link';
import React from 'react';
import {
  Navbar, Container, Nav, Button, Image,
} from 'react-bootstrap';
import { useRouter } from 'next/router';
import { signOut } from '../utils/auth';
import { useAuth } from '../utils/context/authContext';

export default function NavBar() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      variant="dark"
      className="glass-nav"
      style={{ marginBottom: '40px', padding: '12px 0' }}
    >
      <Container fluid>
        <Nav style={{ alignItems: 'center', gap: '8px' }}>
          <Image
            src="/thinkthrive.png"
            alt="Think Thrive"
            style={{
              height: '36px', width: '36px', borderRadius: '8px',
            }}
          />
          <Link passHref href="/">
            <Navbar.Brand style={{ fontWeight: '700', fontSize: '1.2rem', letterSpacing: '0.3px' }}>
              ThinkThrive
            </Navbar.Brand>
          </Link>
        </Nav>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" style={{ gap: '4px' }}>
            <Link passHref href="/">
              <Nav.Link
                className={router.pathname === '/' ? 'active-link' : ''}
                style={{ fontWeight: '500' }}
              >
                Learning Paths
              </Nav.Link>
            </Link>
            <Link passHref href="/my-paths">
              <Nav.Link
                className={router.pathname === '/my-paths' ? 'active-link' : ''}
                style={{ fontWeight: '500' }}
              >
                My Paths
              </Nav.Link>
            </Link>
          </Nav>
          <Nav style={{ alignItems: 'center', gap: '12px' }}>
            {user?.photoURL && (
              <Image
                src={user.photoURL}
                alt="User avatar"
                roundedCircle
                style={{
                  height: '32px', width: '32px', border: '2px solid rgba(255,255,255,0.3)',
                }}
              />
            )}
            <Link passHref href="/">
              <Button className="glass-btn-outline" onClick={signOut} size="sm">
                Sign Out
              </Button>
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
