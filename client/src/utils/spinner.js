import React, { useState } from 'react';
import FullPageLoader from '../components/fullpageloader';

const useSpinner = () => {
  const [visible, setVisible] = useState(false);
  const showSpinner = () => setVisible(true);
  const hideSpinner = () => setVisible(false);
  const spinner = visible ? <FullPageLoader /> : null;
  return [spinner, showSpinner, hideSpinner];
};

export default useSpinner;
