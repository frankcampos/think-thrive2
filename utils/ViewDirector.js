/* eslint-disable @next/next/no-img-element */
import PropTypes from 'prop-types';
import { useAuth } from './context/authContext';
import Loading from '../components/Loading';
import Signin from '../components/Signin';
import NavBar from '../components/NavBar';

const ViewDirectorBasedOnUserAuthStatus = ({ component: Component, pageProps }) => {
  const { user, userLoading } = useAuth();

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />;
  }

  // what the user should see if they are logged in
  if (user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavBar /> {/* NavBar only visible if user is logged in and is in every view */}
        <div
          className="container"
          style={{
            backgroundColor: 'white', border: '1px solid black', borderRadius: '10px', flex: 1,
          }}
        >
          <Component {...pageProps} />
        </div>
        {/* footer at the bottom of the page  */}
        <footer style={{ background: 'grey', marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a href="https://www.linkedin.com/in/frank-parada-campos-214a48229/" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn.icon-icons.com/icons2/2428/PNG/512/linkedin_black_logo_icon_147114.png" alt="LinkedIn" style={{ width: '30px', height: '30px', marginRight: '10px' }} />
            </a>
            <a href="https://github.com/frankcampos" target="_blank" rel="noopener noreferrer">
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" alt="GitHub" style={{ width: '30px', height: '30px' }} />
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
