import React from 'react';
import ToolBar from '../components/ToolBar';
import Navigation from '../components/Navigation';
/**
 * Dashboard view
 * @visibleName Dashboard View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Dashboard: React.FC = () => {
  const workspace = false;

  return (
    <div id='dashboard'>
      <ToolBar transparent={true} />
      <Navigation />
      {/* <div>
        <span>Click "Add a Workspace" to start using electra</span>
      </div> */}
    </div>
  );
};

export default Dashboard;