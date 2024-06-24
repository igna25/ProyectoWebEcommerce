import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Home',
    path: '/admin',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'Productos',
    path: '/admin/activos',
    icon: <Icon icon="lucide:archive" width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Activos', path: '/admin/activos' },
      { title: 'Inactivos', path: '/admin/inactivos' },
      { title: 'Agregar', path: '/admin/nuevo' }
    ],
  },
  {
    title: 'Ventas',
    path: '/admin/ventas',
    icon: <Icon icon="lucide:book-open-check" width="24" height="24" />
  }
];
