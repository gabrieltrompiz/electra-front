import React, { useState, Fragment, forwardRef } from 'react';
import { connect } from 'react-redux';
import { Profile as ProfileI, State } from '../types';
import { setShownProfile } from '../redux/actions';
/**
 * Profile View to check or modify self profile or see other users profile
 * @visibleName Profile View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Profile: React.RefForwardingComponent<HTMLDivElement, ProfileProps> = ({ loggedUser, user = loggedUser, setShownProfile }, ref) => {
  const [name, setName] = useState<string>(user.fullName);
  const [username, setUsername] = useState<string>(user.username);
  const [email, setEmail] = useState<string>(user.email);
  const [password, setPassword] = useState<string>(user.password);

  const own = !!user;

  const close = () => {
    setShownProfile(null);
  };

  return (
    <div id='profile' className='opacityIn' ref={ref}>
      <div>
        <div>
          <div>
            <div>Profile</div>
            <div>
              <img src={require('../assets/images/close.png')} alt='profile' onClick={() => close()}></img>
            </div>
          </div>
          <div>
            <p className="label">Profile Photo</p>
            <div>
              <div>
                <img src={user.pictureUrl} alt='profile'></img>
              </div>
            
              {own &&
              <div>
                <button>Change Profile Photo</button>
                <button>Delete Profile Photo</button>
              </div>}
            </div>
            
            {own &&
            <Fragment>
              <p className="label">Name</p>
              <input value={name} onChange={(e) => setName(e.target.value)}></input>
              <p className="label">Username</p>
              <input value={username} onChange={(e) => setUsername(e.target.value)}></input>
              <p className="label">Email</p>
              <input value={email} onChange={(e) => setEmail(e.target.value)}></input>
              <p className="label">Password</p>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password"></input>
            </Fragment>}

            {!own &&
            <Fragment>
              <p className="label">Name</p>
              <p className="user-info">{user.fullName}</p>
              <p className="label">Username</p>
              <p className="user-info">{user.username}</p>
              <p className="label">Email</p>
              <p className="user-info">{user.email}</p>
            </Fragment>}
            
            <p className="label">GitHub Account</p>
            {!user.gitHubUser && own &&
            <button id='gh-btn'>
              <img src={require('../assets/images/github-color.png')} alt='gh-logo'></img>
              Link GitHub Account
            </button>}
            {!user.gitHubUser && !own &&
            <p className="user-info">This user has no linked GitHub account</p>}
            {user.gitHubUser &&
            <div id="gh-info">
              <div>
                <img src={user.gitHubUser.avatarUrl} alt="github"/>
              </div>
              <div>
                <span>@{user.gitHubUser.login}</span>
                <span>Connected</span>
              </div>
              <div>
                {own && <button>Unlink</button>}
              </div>
            </div>}
            
            {own &&
            <div>
              <button>Save Changes</button>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: State) => {
  const { userReducer } = state;
  return {
    loggedUser: userReducer.user
  }
};

export default connect(mapStateToProps, { setShownProfile }, null, { forwardRef: true })(forwardRef<HTMLDivElement, ProfileProps>(Profile));

interface ProfileProps {
  /** User to be shown, if it's null it will show the logged user */
  user?: ProfileI
  /** Logged user from redux store */
  loggedUser: ProfileI
  /** Function to change the visible status of this view */
  setShownProfile: Function
}