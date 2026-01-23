import React from 'react';

interface IProps {
  children: React.ReactNode;
}

const OrderListLayout: React.FC<IProps> = ({ children }) => {
  return <section>{children}</section>;
};

export default OrderListLayout;
