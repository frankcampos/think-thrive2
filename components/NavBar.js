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
            <a
              href="https://www.frankcampos.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: '500', textDecoration: 'none',
              }}
            >
              by Frank Campos
            </a>
            <a href="https://www.linkedin.com/in/frank-parada-campos-214a48229/" target="_blank" rel="noopener noreferrer" style={{ opacity: 0.7 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn.icon-icons.com/icons2/2428/PNG/512/linkedin_black_logo_icon_147114.png" alt="LinkedIn" style={{ width: '22px', height: '22px', filter: 'invert(1)' }} />
            </a>
            <a href="https://github.com/frankcampos" target="_blank" rel="noopener noreferrer" style={{ opacity: 0.7 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" style={{ width: '22px', height: '22px', filter: 'invert(1)' }} />
            </a>
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
