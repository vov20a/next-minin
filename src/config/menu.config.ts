export const menuItems = [
  'Profile',
  'Dashboard',
  'Activity',
  'Analytics',
  'System',
  'Deployments',
  'My Settings',
  'Team Settings',
  'Help & Feedback',
  'Log Out',
];
export const navItems = [
  {
    href: '/create',
    label: 'Create',
    children: [] as { key: string; title: string; grandson: [] }[],
  },
  {
    href: '/orders',
    label: 'Orders',
    children: [] as { key: string; title: string; grandson: [] }[],
  },
  {
    href: '/search',
    label: 'Search',
    children: [
      { key: '/byname', title: 'By Name', grandson: [] as { pos: string; name: string }[] },
      { key: '/bytort', title: 'By Tort', grandson: [] as { pos: string; name: string }[] },
      { key: '/bydate', title: 'By Date', grandson: [] as { pos: string; name: string }[] },
      { key: '/bystatus', title: 'By Status', grandson: [] as { pos: string; name: string }[] },
    ],
  },
  // {
  //   href: '/complex',
  //   label: 'Complex',
  //   children: [
  //     { key: '/metrics', title: 'Usage Metrics', grandson: [] },
  //     {
  //       key: '/production',
  //       title: 'Production Ready',
  //       grandson: [
  //         {
  //           pos: '/category',
  //           name: 'Production Category',
  //         },
  //         { pos: '/rubrica', name: 'Production Rubrica' },
  //       ],
  //     },
  //     { key: '/uptime', title: 'Uptime', grandson: [] },
  //     { key: '/supreme', title: 'Supreme Support', grandson: [] },
  //   ],
  // },
  // {
  //   href: '/family',
  //   label: 'Family',
  //   children: [
  //     {
  //       key: '/daughter',
  //       title: 'Daughter',
  //       grandson: [
  //         {
  //           pos: '/granddaughter',
  //           name: 'Grand Daughter',
  //         },
  //         { pos: '/grandson', name: 'Grand Son' },
  //       ],
  //     },
  //     { key: '/son', title: 'Son', grandson: [] },
  //   ],
  // },
  { href: '/about', label: 'About', children: [] },
];
