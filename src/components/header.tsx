'use client';

import { Navbar, NavbarMenuToggle, NavbarContent } from '@heroui/react';

import { useState } from 'react';
import Navbarbrand from './UI/navbar.brand';
import AuthMenu from './UI/auth.menu';
import MainMenu from './UI/main.menu';
import { IShowGrandSon } from '@/types/menu.types';
import BarMenu from './UI/bar.menu';
import RegistrationModal from './UI/modals/registration.modal';
import LoginModal from './UI/modals/login.modal';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isShowGrandsons, setShowgrandsons] = useState<{ key: string; value: boolean }>({
    key: '',
    value: false,
  });

  const showGrandson = (obj: { pos: string; name: string }) => {
    if (isShowGrandsons.key !== obj.pos) {
      setShowgrandsons({ key: obj.pos, value: true });
    } else if (isShowGrandsons.key === obj.pos && !isShowGrandsons.value) {
      setShowgrandsons({ key: obj.pos, value: true });
    } else {
      setShowgrandsons({ key: obj.pos, value: false });
    }
  };

  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // console.log(isMenuOpen);
  return (
    <Navbar
      disableAnimation
      isBordered
      className=" justify-between "
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Open menu' : 'Close menu'}
          className="sm:hidden"
          data-open={isMenuOpen ? true : false}
        />
      </NavbarContent>

      {/* <640px */}
      <Navbarbrand className="sm:hidden pr-3" justify="center" />

      {/* >640px*/}
      <Navbarbrand className="hidden sm:flex gap-4" justify="center" />

      <MainMenu
        isShowGrandsons={isShowGrandsons}
        setShowgrandsons={setShowgrandsons}
        showGrandson={(obj: IShowGrandSon) => showGrandson(obj)}
        className="hidden sm:flex gap-4"
        justify="center"
      />

      <AuthMenu setIsLoginOpen={setIsLoginOpen} setIsRegistrationOpen={setIsRegistrationOpen} />

      <BarMenu
        isShowGrandsons={isShowGrandsons}
        setShowgrandsons={setShowgrandsons}
        showGrandson={(obj: IShowGrandSon) => showGrandson(obj)}
        setIsMenuOpen={setIsMenuOpen}
      />
      <RegistrationModal isOpen={isRegistrationOpen} onClose={() => setIsRegistrationOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </Navbar>
  );
}
