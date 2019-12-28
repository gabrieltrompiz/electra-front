import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { setUser, loginWithCredentials } from '../redux/actions';
import Authentication from './Authentication';
import Dashboard from './Dashboard';
import { useApolloClient } from '@apollo/react-hooks';
import Loading from '../components/Loading';

const NavController: React.FC<NavControllerProps> = ({ loggedIn, loginWithCredentials, setUser }) => {
  const [showAuth, setShowAuth] = useState<boolean>(true);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const authRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const client = useApolloClient();
  const x = '';

  useEffect(() => {
    if(loggedIn) {
      setTimeout(() => {
        authRef.current.classList.toggle('opacityIn');
        authRef.current.classList.toggle('opacityOut');     
        setTimeout(() => {
          setShowAuth(false);
          setShowDashboard(true);
        }, 500);
      }, 500);
    } else if(dashboardRef.current) {
      dashboardRef.current.classList.toggle('opacityIn');
      dashboardRef.current.classList.toggle('opacityOut');
      setTimeout(() => {
        setShowDashboard(false);
        setShowAuth(true);
      })
    }
  }, [loggedIn]);

  useEffect(() => {
    _retrieveState();
  // eslint-disable-next-line
  }, [])

  /** Gets the previous state from localStorage
   * @async
   * @function _retrieveState */
  const _retrieveState = async () => {
    const _credentials = await localStorage.getItem('ELECTRA-CREDENTIALS');
    if(_credentials) {
      setLoading(true);
      loginWithCredentials(client, JSON.parse(_credentials), setLoading);
    }
  };

  return (
    <div id='container'>
      {loading && <Loading />}
      {showAuth && <Authentication ref={authRef} />}
      {showDashboard && <Dashboard ref={dashboardRef} />}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  const { userReducer } = state;
  return {
    loggedIn: userReducer.loggedIn
  }
};

export default connect(mapStateToProps, { setUser, loginWithCredentials })(NavController);

interface NavControllerProps {
  /** If the user is logged in or not */
  loggedIn: boolean
  /** Action creator to change user */
  setUser: Function,
  /** Action creator to login with given creds */
  loginWithCredentials: Function
};