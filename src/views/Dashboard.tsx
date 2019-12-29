import React, { forwardRef } from 'react';
import ToolBar from '../components/ToolBar';
import Navigation from '../components/Navigation';
import Profile from './Profile';
/**
 * Dashboard view
 * @visibleName Dashboard View
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Dashboard: React.RefForwardingComponent<HTMLDivElement> = (_, ref) => {
  return (
    <div id='dashboard' className='opacityIn' ref={ref}>
      <ToolBar />
      <Navigation />
      <Profile />
    </div>
  );
};

export default forwardRef<HTMLDivElement>(Dashboard);