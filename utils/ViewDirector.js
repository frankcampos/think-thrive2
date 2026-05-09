/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from './context/authContext';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import NavBar from '../components/NavBar';
import WelcomeScreen from '../components/WelcomeScreen';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  const { user, userLoading } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.isAnonymous) {
      setShowWelcome(true);
    } else if (!localStorage.getItem('hasSeenWelcome')) {
      setShowWelcome(true);
    }
  }, [user]);

  const handleDone = () => {
    if (!user?.isAnonymous) {
      localStorage.setItem('hasSeenWelcome', 'true');
    }
    setShowWelcome(false);
  };

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />;
  }

  // what the user should see if they are logged in
  if (user) {
    if (showWelcome) {
      return <WelcomeScreen onDone={handleDone} isGuest={user.isAnonymous} />;
    }
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar /> {/* NavBar only visible if user is logged in and is in every view */}
        <div
          className="container"
          style={{
            backgroundColor: 'transparent',
          }}
        >
          <Component {...pageProps} />
        </div>
        {/* footer at the bottom of the page  */}
        <footer style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          marginTop: 'auto',
          padding: '16px 0',
        }}
        >
          <div style={{
            display: 'flex', justifyContent: 'center', gap: '16px', alignItems: 'center',
          }}
          >
            <a
              href="https://www.frankcampos.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', fontWeight: '500', textDecoration: 'none' }}
            >
              Built by Frank Campos
            </a>
            <a href="https://www.linkedin.com/in/frank-parada-campos-214a48229/" target="_blank" rel="noopener noreferrer" style={{ opacity: 0.7 }}>
              <img src="https://cdn.icon-icons.com/icons2/2428/PNG/512/linkedin_black_logo_icon_147114.png" alt="LinkedIn" style={{ width: '28px', height: '28px', filter: 'invert(1)' }} />
            </a>
            <a href="https://github.com/frankcampos" target="_blank" rel="noopener noreferrer" style={{ opacity: 0.7 }}>
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" style={{ width: '28px', height: '28px', filter: 'invert(1)' }} />
            </a>
          </div>
        </footer>
      </div>
    );
  }

  return <Signin />;
};

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  component: PropTypes.func.isRequired,
  pageProps: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
