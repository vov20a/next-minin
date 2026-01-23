'use client';

import { useAuthStore } from '@/store/auth.store';
import { useOrderStore } from '@/store/order.store';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

const AppLoader = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const { ordersCount, findTotalPrice } = useOrderStore();
  const { isAuth, setAuthState } = useAuthStore();
  // const { role, getUserRole } = useUserStore();

  useEffect(() => {
    setAuthState(status, session);
  }, [status, session, setAuthState]);

  useEffect(() => {
    if (isAuth) {
      // getUserRole(session);
      ordersCount();
      findTotalPrice();
    }
  }, [isAuth, ordersCount, findTotalPrice]);

  // useEffect(() => {
  //   loadRecipes();
  // }, [loadRecipes]);
  // console.log(role);

  return <>{children}</>;
};

export default AppLoader;
