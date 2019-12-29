import React from 'react';
import ToolBar from '../components/ToolBar';
import Navigation from '../components/Navigation';
/**
 * Profile View to check or modify self profile or see other users profile
 * @visibleName Profile View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Profile: React.FC = () => {

  return (
    <div id='profile'>
      <div>
        <div>
          <div>Profile</div>
          <div><img src={require('../assets/images/close.png')} alt='close'></img></div>
        </div>
        <div>
          <p>Profile Photo</p>
          <div>
            <div>
              <img src={require('../assets/images/default-pic.png')} alt="picture"/>
            </div>
          
            <div>
              <button>Change Profile Photo</button>
              <button>Delete Profile Photo</button>
            </div>
          </div>
          
          <p>Name</p>
          <input></input>
          <p>Username</p>
          <input></input>
          <p>Email</p>
          <input></input>
          <p>Password</p>
          <input type="password"></input>
          
          <p>GitHub Account</p>
          <div>
            <div>
              <img src={require('../assets/images/default-pic.png')} alt="github"/>
            </div>
            <div>
              <span>@gabtrompiz</span>
              <span>Connected</span>
            </div>
            <div>
              <button>Unlink</button>
            </div>
          </div>
          
          <div>
            <button>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;