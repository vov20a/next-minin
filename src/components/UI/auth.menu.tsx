import { NavbarContent, NavbarItem } from '@heroui/navbar';
import { Button } from '@heroui/react';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';
import { signOutFunc } from '@/actions/sign-out';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

interface IProps {
  setIsLoginOpen: Dispatch<SetStateAction<boolean>>;
  setIsRegistrationOpen: Dispatch<SetStateAction<boolean>>;
}

const AuthMenu = ({ setIsLoginOpen, setIsRegistrationOpen }: IProps) => {
  const router = useRouter();
  const { isAuth, session, status, setAuthState } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOutFunc();
    } catch (error) {
      console.log(error);
    }
    setAuthState('unauthenticated', null);
    router.push('/');
  };

  return (
    <NavbarContent>
      {/* {isAuth && <p>Hello,{session?.user?.email?.replace(/@.*$/, '')}</p>} */}
      {isAuth && <p>{session?.user?.email?.match(/.*@/)}</p>}
      {status === 'loading' ? (
        <h3>Loading....</h3>
      ) : !isAuth ? (
        <>
          <NavbarItem>
            <Button
              as={Link}
              color="secondary"
              href="#"
              variant="ghost"
              onPress={() => setIsLoginOpen(true)}
            >
              Логин
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              color="secondary"
              href="#"
              variant="ghost"
              onPress={() => setIsRegistrationOpen(true)}
            >
              Sign Up
            </Button>
          </NavbarItem>
        </>
      ) : (
        <NavbarItem>
          <Button as={Link} color="secondary" href="#" variant="ghost" onPress={handleSignOut}>
            Выйти
          </Button>
        </NavbarItem>
      )}
    </NavbarContent>
  );
};

export default AuthMenu;
