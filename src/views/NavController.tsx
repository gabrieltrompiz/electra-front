import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { setUser } from '../redux/actions';
import Authentication from './Authentication';
import Dashboard from './Dashboard';

const NavController: React.FC<NavControllerProps> = ({ loggedIn, setUser }) => {
  const [showAuth, setShowAuth] = useState<boolean>(true);
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  const authRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);

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

  /** Gets the previous state from localStorage
   * @async
   * @function _retrieveState */
  const _retrieveState = async () => {
    const _user = await localStorage.getItem('ELECTRA-USER');
    if(_user) setUser(JSON.parse(_user));
  };

  return (
    <div id='container'>
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

export default connect(mapStateToProps, { setUser })(NavController);

interface NavControllerProps {
  /** If the user is logged in or not */
  loggedIn: boolean
  /** Action creator to chenge user */
  setUser: Function
};