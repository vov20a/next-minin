import React from 'react';

interface Iprops {
  children: React.ReactNode;
}

const AboutLayout: React.FC<Iprops> = ({ children }) => {
  return <section>{children}</section>;
};

export default AboutLayout;
