import { navItems } from '@/config/menu.config';
import { NavbarMenu, NavbarMenuItem } from '@heroui/navbar';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ChevronDown from './chevron.down';
import { IGrandSons, IShowGrandSon } from '@/types/menu.types';
import { Dispatch, SetStateAction } from 'react';
import { useAuthStore } from '@/store/auth.store';

interface BarProps {
  setIsMenuOpen: Dispatch<SetStateAction<boolean>>;
  isShowGrandsons: IGrandSons;
  setShowgrandsons: Dispatch<SetStateAction<IGrandSons>>;
  showGrandson: (obj: IShowGrandSon) => void;
}

const BarMenu = ({ setIsMenuOpen, isShowGrandsons, setShowgrandsons, showGrandson }: BarProps) => {
  const pathname = usePathname();

  const { isAuth, session, status, setAuthState } = useAuthStore();
  const filteredItems = navItems.filter((item) => {
    if (item.href === '/create' || item.href === '/orders' || item.href === '/search') {
      return isAuth;
    }
    return true;
  });

  return (
    <NavbarMenu>
      {filteredItems.map((navItem) => {
        const isActive = pathname === navItem.href;
        const isComplexActive = pathname.includes(navItem.href);
        return !navItem.children.length ? (
          <NavbarMenuItem key={navItem.href} onClick={() => setIsMenuOpen(false)}>
            <Link
              className={`w-full 
                    ${isActive ? 'text-blue-500' : 'text-foreground'}
                    hover:text-blue-300 hover:border
                    hover:border-blue-300 hover:rounded-md
                    transition-colors
                    transition-border 
                    duration-200`}
              color="foreground"
              href={navItem.href}
            >
              {navItem.label}
            </Link>
          </NavbarMenuItem>
        ) : (
          <Dropdown key={navItem.href}>
            <NavbarMenuItem>
              <DropdownTrigger
                onChange={(isOpen: boolean) => {
                  if (isOpen) setShowgrandsons({ key: navItem.href, value: false });
                }}
              >
                <Button
                  disableRipple
                  className={`p-0 bg-transparent data-[hover=true]:bg-transparent text-white flex justify-start text-[18px]
                          ${isComplexActive ? 'text-blue-500' : 'text-foreground'}`}
                  endContent={
                    <ChevronDown
                      fill="currentColor"
                      size={16}
                      rotateNumber={
                        isComplexActive ||
                        (isShowGrandsons.value && isShowGrandsons.key === navItem.label)
                          ? 180
                          : 0
                      }
                    />
                  }
                  radius="sm"
                  variant="light"
                >
                  {navItem.label}
                </Button>
              </DropdownTrigger>
            </NavbarMenuItem>
            <DropdownMenu
              aria-label="Components"
              itemClasses={{
                base: 'gap-4',
              }}
            >
              {navItem.children.map((item) => {
                const isItemActive = pathname.includes(item.key);
                return !item.grandson.length ? (
                  <DropdownItem key={item.key} onClick={() => setIsMenuOpen(false)}>
                    <Link
                      href={`${navItem.href}${item.key} `}
                      className={`px-3 py-1 
                  ${isItemActive ? 'text-blue-500' : 'text-background'}
                    hover:text-blue-300 hover:border
                    hover:border-blue-300 hover:rounded-md
                    transition-colors
                    transition-border 
                    duration-200`}
                      onClick={() => setShowgrandsons({ key: item.key, value: false })}
                    >
                      {item.title}
                    </Link>
                  </DropdownItem>
                ) : (
                  <>
                    <DropdownItem
                      key={item.key}
                      disableAnimation
                      // description="ACME scales apps based on demand and load"
                      // startContent={icons.chevron}
                      isReadOnly
                    >
                      <Button
                        disableRipple
                        // className={`p-0 bg-transparent data-[hover=true]:bg-transparent text-black`}
                        className={` bg-transparent data-[hover=true]:bg-transparent text-black 
                          ${isItemActive ? 'text-blue-500' : 'text-black'}`}
                        endContent={
                          <ChevronDown
                            fill="currentColor"
                            size={16}
                            rotateNumber={
                              isShowGrandsons.value && isShowGrandsons.key === item.key ? 180 : 0
                            }
                          />
                        }
                        radius="sm"
                        variant="light"
                        onPress={() => showGrandson({ pos: item.key, name: item.title })}
                      >
                        {item.title}
                      </Button>
                    </DropdownItem>

                    {isShowGrandsons.value &&
                      isShowGrandsons.key === item.key &&
                      item.grandson.map((bit) => {
                        const isBitActive = pathname.includes(bit.pos);
                        return (
                          bit.name !== '' && (
                            <DropdownItem
                              key={bit.pos}
                              className="text-black border-1"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <Link
                                href={`${navItem.href}${item.key}${bit.pos} `}
                                className={`px-6 ${isBitActive ? 'text-red-500' : 'text-background'}
                    hover:text-red-300 hover:border
                    hover:border-red-300 hover:rounded-md
                    transition-colors
                    transition-border 
                    duration-200`}
                              >
                                {bit.name}
                              </Link>
                            </DropdownItem>
                          )
                        );
                      })}
                  </>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        );
      })}
    </NavbarMenu>
  );
};

export default BarMenu;
