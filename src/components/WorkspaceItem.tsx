import React from 'react';
import { Workspace } from '../types';

const WorkspaceItem: React.FC<WorkspaceItemProps> = ({ workspace, onClick, active }) => {
  return (
    <div id='workspace-item' onClick={onClick}>
      {active && <div id='active-indicator' className='opacityIn'></div>}
      <div id='icon'>
        {workspace.name.charAt(0).toUpperCase()}
      </div>
      <p>{workspace.name}</p>
    </div>
  );
};

export default WorkspaceItem;

interface WorkspaceItemProps {
  /** Workspace information */
  workspace: Workspace
  /** onClick event */
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  /** Wether the workspace is selected or not */
  active: boolean
}