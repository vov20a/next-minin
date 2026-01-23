interface IProps {
  children: React.ReactNode;
}

const Layout = ({ children }: IProps) => {
  return <section>{children}</section>;
};

export default Layout;
