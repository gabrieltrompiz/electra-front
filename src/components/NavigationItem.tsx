import React from 'react';

interface NavigationItemProps {
  id: string;
  type: 'title' | 'option';
  icon?: string;
  image?: string;
}

const NavigationItem: React.FC<NavigationItemProps> = ({ id, type, icon, image }) => {

  return (
    <div id='navigation-item'>

    </div>
  );
};

export default NavigationItem;