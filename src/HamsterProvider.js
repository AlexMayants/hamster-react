import React from 'react';
import HamsterContext from './HamsterContext';

export default function HamsterProvider({ hamster, children }) {
  return (
    <HamsterContext.Provider value={hamster}>
      {children}
    </HamsterContext.Provider>
  );
}
