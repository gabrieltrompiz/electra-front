import React from 'react';
import NavigationItem from './NavigationItem';


interface NavigationProps {
  /** Receives Items to navigate */
  items?: any;
  /** Focuses item which matches with the current id */
  actualItem?: string;
}

/**
 * Navigation module to change app views (workspaces, notifications, profile and logout button)
 * @visibleName Toolbar
 * @author Gabriel Trompiz (https://github.com/gabrieltrompiz)
 * @author Luis Petrella (https://github.com/Ptthappy)
 */
const Navigation: React.FC<NavigationProps> = ({ items, actualItem }) => {

  return (
    <div id='navigation'>

    </div>
  );
};

export default Navigation;