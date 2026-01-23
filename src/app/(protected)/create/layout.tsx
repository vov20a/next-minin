import React from 'react';

interface IProps {
  children: React.ReactNode;
}

const OrderLayout: React.FC<IProps> = ({ children }) => {
  return <section>{children}</section>;
};

export default OrderLayout;
