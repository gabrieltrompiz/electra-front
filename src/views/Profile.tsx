import React from 'react';
import ToolBar from '../components/ToolBar';
import Navigation from '../components/Navigation';
/**
 * Profile View to check or modify self or other users profile
 * @visibleName Profile View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Profile: React.FC = () => {

  return (
    <div id='profile'>
      <ToolBar transparent={true} />
      <div>
        <Navigation />
        <div>
          <p>Profile Photo</p>
          <div>
            <div>
              {/* imagen */}
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
          <input></input>
          <p>GitHub Account</p>
          <div>
            <div>
              {/* imagen */}
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