'use client';

import { pagesContent } from '@/config/pagesContent';
import { usePathname } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';
import parse from 'html-react-parser';

const PageContent = () => {
  const pathname = usePathname();
  const pageContent = pagesContent[pathname as keyof typeof pagesContent];

  if (!pageContent) {
    return <div>Страница не найдена</div>;
  }

  const cleanHTML = DOMPurify.sanitize(pageContent.content);

  return <div>{parse(cleanHTML)}</div>;
};

export default PageContent;
