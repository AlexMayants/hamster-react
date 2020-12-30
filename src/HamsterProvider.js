import React from 'react';
import PropTypes from 'prop-types';
import Hamster from 'hamster-redux';
import HamsterContext from './HamsterContext';

export default function HamsterProvider({ hamster, children }) {
  return (
    <HamsterContext.Provider value={hamster}>
      {children}
    </HamsterContext.Provider>
  );
}

HamsterProvider.propTypes = {
  hamster: PropTypes.instanceOf(Hamster).isRequired,
  children: PropTypes.node,
};
