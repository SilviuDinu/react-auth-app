import LogoutIcon from '@mui/icons-material/Logout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import IosShareIcon from '@mui/icons-material/IosShare';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';

export const menuItems = [
  [
    {
      title: 'Add expense category',
      icon: <AddCircleIcon color="primary" />,
      link: '/dashboard/add-expense-category',
    },
    {
      title: 'Add new expense',
      icon: <AddShoppingCartIcon color="primary" />,
      link: '/dashboard/add-expense',
    },
    {
      title: 'Share expenses',
      icon: <IosShareIcon color="primary" />,
      link: '/dashboard/share-expense',
    },
    {
      title: 'Your info',
      icon: <PersonIcon color="primary" />,
      link: '/dashboard/userinfo',
    },
    {
      title: 'Stats',
      icon: <BarChartIcon color="primary" />,
      link: '/dashboard',
    },
  ],
  [
    {
      title: 'Logout',
      icon: <LogoutIcon color="primary" />,
      link: '/dashboard',
      isLogOut: true,
    },
  ],
];
