export interface INavbarProps {
  className: string;
  justify: 'center' | 'start' | 'end' | undefined;
}
export type IGrandSons = {
  key: string;
  value: boolean;
};
export type IShowGrandSon = {
  pos: string;
  name: string;
};
export type ICurrentMenu =
  | {
      href: string;
      label: string;
      children: {
        key: string;
        title: string;
        grandson: {
          pos: string;
          name: string;
        }[];
      }[];
    }
  | undefined;
