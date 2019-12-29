import React, { useState, Fragment } from 'react';
import ToolBar from '../components/ToolBar';
import Navigation from '../components/Navigation';
/**
 * Profile View to check or modify self profile or see other users profile
 * @visibleName Profile View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Profile: React.FC<ProfileProps> = ({ user, own }) => {
  const [name, setName] = useState(user.fullname);
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] =  useState(user.email);
  const [password, setPassword] =  useState(user.password);

  return (
    <div id='profile'>
      <div>
        <div>
          <div>Profile</div>
          <div>
            <img src={require('../assets/images/close.png')} alt='profile'></img>
          </div>
        </div>
        <div>
          <p className="label">Profile Photo</p>
          <div>
            <div>
              {!user.imageUrl && <img src={require('../assets/images/default-pic.png')} alt="picture"/>}
              {user.imageUrl && <img src={user.imageUrl} alt='profile'></img>}
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
            <p className="user-info">{user.fullname}</p>
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
          <p className="user-info">This user has no linked GitHub Account</p>}
          {user.gitHubUser &&
          <div id="gh-info">
            <div>
              <img src={require('../assets/images/default-pic.png')} alt="github"/>
            </div>
            <div>
              <span>@{user.gitHubUser.username}</span>
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
  );
};

export default Profile;

interface ProfileProps {
  user: any;
  own: boolean;
}