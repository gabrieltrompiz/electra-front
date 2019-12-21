import React from 'react';
import { remote } from 'electron';

interface ToolBarProps {
  /** Sets if the toolbar is transparent. Defaults to false. */
  transparent?: boolean;
  /** Sets the background color of the toolbar. If transparent is true this won't take effect. Defaults to #202225. */
  color?: string;
}

/**
 * Toolbar showing app's logo and minimize, maximize and close buttons
 * @visibleName Toolbar
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const ToolBar: React.FC<ToolBarProps> = ({ transparent = false, color = '#202225' }) => {
  const window = remote.getCurrentWindow();

  /** Toggle maximization of window */
  const toggleResize = () => {
    // If the window is maximized it sets size to 800x450 and centers it, else it maximizes it. 
    // Had to leave a 100px threshold so moving the window doesn't bug the conditional
    if(window.getSize()[0] > 900) { 
      window.resizable = true;
      window.setSize(800, 450);
      window.center(); 
      window.resizable = false;
    }
    else window.maximize();
  }

  return (
    <div id='toolbar' style={{ backgroundColor: transparent ? 'transparent' : color }}>
      <div>
        <img src={require('../assets/images/logo-header.png')} alt='logo' />
      </div>
      <div>
        <button onClick={() => window.minimize()}>—</button>
        <button onClick={() => toggleResize()}>max</button>
        <button onClick={() => window.close()}>close</button>
      </div>
    </div>
  );
};

export default ToolBar;