import React from 'react';

interface IProps {
  children: React.ReactNode;
}

const SearchLayout: React.FC<IProps> = ({ children }) => {
  return <section>{children}</section>;
};

export default SearchLayout;
