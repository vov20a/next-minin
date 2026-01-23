import { navItems } from '@/config/menu.config';
import { NavbarContent, NavbarItem } from '@heroui/navbar';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ChevronDown from './chevron.down';
import { Dispatch, SetStateAction } from 'react';
import { IGrandSons, INavbarProps, IShowGrandSon } from '@/types/menu.types';
import { useAuthStore } from '@/store/auth.store';

interface MainProps extends INavbarProps {
  isShowGrandsons: IGrandSons;
  setShowgrandsons: Dispatch<SetStateAction<IGrandSons>>;
  showGrandson: (obj: IShowGrandSon) => void;
}

const MainMenu = ({
  isShowGrandsons,
  setShowgrandsons,
  showGrandson,
  className,
  justify,
}: MainProps) => {
  const pathname = usePathname();

  const { isAuth, session } = useAuthStore();
  let filteredItems;
  if (session?.user.role === 'ADMIN') {
    filteredItems = navItems.filter((item) => item);
  }
  if (session?.user.role === 'USER') {
    filteredItems = navItems.filter((item) => {
      if (item.href === '/orders' || item.href === '/about') {
        return isAuth;
      }
      return false;
    });
  } else if (session?.user.role === undefined) {
    filteredItems = navItems.filter((item) => {
      if (item.href === '/about') {
        return true;
      }
      return false;
    });
  }
  // console.log(filteredItems, session?.user.role, navItems);
  return (
    <NavbarContent className={className} justify={justify}>
      {filteredItems &&
        filteredItems.map((navItem) => {
          const isActive = pathname === navItem.href;
          const isComplexActive = pathname.includes(navItem.href);
          return !navItem.children.length ? (
            <NavbarItem
              key={navItem.href}
              onClick={() => setShowgrandsons({ key: navItem.href, value: false })}
            >
              <Link
                href={navItem.href}
                className={`px-3 py-1 
              ${isActive ? 'text-blue-500' : 'text-foreground'}
                hover:text-blue-300 hover:border
                hover:border-blue-300 hover:rounded-md
                transition-colors
                transition-border 
                duration-200`}
              >
                {navItem.label}
              </Link>
            </NavbarItem>
          ) : (
            <Dropdown key={navItem.href}>
              <NavbarItem>
                <DropdownTrigger
                  onChange={(isOpen: boolean) => {
                    if (isOpen) setShowgrandsons({ key: navItem.href, value: false });
                  }}
                >
                  <Button
                    disableRipple
                    className={`p-0 bg-transparent data-[hover=true]:bg-transparent text-white text-[16px]
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
              </NavbarItem>
              <DropdownMenu
                aria-label="Components"
                itemClasses={{
                  base: 'gap-4',
                }}
              >
                {navItem.children.map((item) => {
                  const isItemActive =
                    pathname.includes(navItem.href + item.key) ||
                    pathname.includes(navItem.href + item.key + '/');

                  return !item.grandson.length ? (
                    <DropdownItem
                      key={item.key}
                      // description="ACME scales apps based on demand and load"
                      // startContent={icons.chevron}
                    >
                      <Link
                        href={navItem.href + item.key}
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
                          className={`px-3 bg-transparent data-[hover=true]:bg-transparent text-black
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
                          const isBitActive = pathname === navItem.href + item.key + bit.pos;
                          return (
                            bit.name !== '' && (
                              <DropdownItem key={bit.pos} className="text-black border-1">
                                <Link
                                  href={`${navItem.href}${item.key}${bit.pos} `}
                                  className={`px-6 ${
                                    isBitActive ? 'text-red-500' : 'text-background'
                                  }
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
    </NavbarContent>
  );
};

export default MainMenu;
