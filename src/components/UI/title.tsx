'use client';

import { navItems } from '@/config/menu.config';
import { usePathname } from 'next/navigation';

const Title = () => {
  const pathname = usePathname();

  const pageTitle = () => {
    let currentMenu = undefined;

    for (const item of navItems) {
      if (!item.children.length && item.href === pathname) {
        return item.href;
      } else if (item.children.length > 0) {
        const level1 = item.children.find(
          (child) => !child.grandson.length && pathname === item.href + child.key,
        );

        if (level1?.title && !level1.grandson.length) {
          currentMenu = item.href + level1.key;
          break;
        } else {
          for (const son of item.children) {
            const level2 = son.grandson.find((bit) => pathname === item.href + son.key + bit.pos);
            if (level2?.name) {
              currentMenu = item.href + son.key + level2.pos;
              break;
            }
          }
        }
      }
    }

    return currentMenu;
  };

  return (
    <div className=" flex justify-start  items-center mb-6 px-5 bg-stone-800">
      <h3 className="text-1xl ">{pageTitle()}</h3>
    </div>
  );
};

export default Title;
