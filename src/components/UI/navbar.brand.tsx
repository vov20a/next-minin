import { NavbarContent, NavbarBrand } from '@heroui/navbar';
import Link from 'next/link';
import AcmeLogo from './acme.logo';
import { INavbarProps } from '@/types/menu.types';

const Navbarbrand = ({ className, justify }: INavbarProps) => {
  return (
    <NavbarContent className={className} justify={justify}>
      <NavbarBrand>
        <Link href="/">
          <AcmeLogo />
        </Link>
      </NavbarBrand>
    </NavbarContent>
  );
};

export default Navbarbrand;
