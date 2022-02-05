import LogoutIcon from '@mui/icons-material/Logout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// import IosShareIcon from '@mui/icons-material/IosShare';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import SettingsIcon from '@mui/icons-material/Settings';

export const menuItems = [
  [
    {
      title: 'Add expense category',
      icon: <AddCircleIcon color="primary" />,
      link: '/dashboard/add-expense-category',
      className: 'menu-item',
    },
    {
      title: 'Add new expense',
      icon: <AddShoppingCartIcon color="primary" />,
      link: '/dashboard/add-expense',
      className: 'menu-item',
    },
    // {
    //   title: 'Share expenses',
    //   icon: <IosShareIcon color="primary" />,
    //   link: '/dashboard/share-expense',
    //   className: 'menu-item',
    // },
    // {
    //   title: 'Your info',
    //   icon: <PersonIcon color="primary" />,
    //   link: '/dashboard/userinfo',
    //   className: 'menu-item',
    // },
    {
      title: 'Your expenses',
      icon: <FormatListNumberedIcon color="primary" />,
      link: '/dashboard/expenses',
      className: 'menu-item',
    },
    {
      title: 'Stats',
      icon: <BarChartIcon color="primary" />,
      link: '/dashboard',
      className: 'menu-item',
    },
  ],
  [
    {
      title: 'Settings',
      icon: <SettingsIcon color="primary" />,
      link: '/dashboard/settings',
    },
    {
      title: 'Logout',
      icon: <LogoutIcon color="primary" />,
      link: '/dashboard',
      isLogOut: true,
    },
  ],
];
