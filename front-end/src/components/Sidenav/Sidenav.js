import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import { useState } from 'react';
import { menuItems } from '../../constants/menu-items';
import { useHistory } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import { useUser } from '../../auth/useUser';

const drawerWidth = 300;

const Sidenav = React.memo((props) => {
  const user = useUser();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const history = useHistory();

  const [selected, setSelected] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuItemClick = (item) => {
    handleDrawerToggle();
    setSelected(item);
    !item.isLogOut ? history.push(item.link || '#') : logOut();
  };

  const logOut = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  const drawer = (
    <div>
      <Toolbar className="logo-wrapper">
        <div className="logo-area">
          <img src={require('../../assets/images/logo192.png').default} alt="Logo" width={45} />
        </div>
      </Toolbar>
      <Divider />
      <div className="user-mobile">
        <div className="user-area">
          <span>Hello, {user.userName || user.email}</span>
        </div>
        <Divider />
      </div>
      <List>
        {menuItems.map((category, categoryIdx) => (
          <div key={categoryIdx}>
            {category.map((item, itemIdx) => (
              <ListItem
                button
                className={item.title === selected?.title ? 'menu-item Mui-focusVisible' : 'menu-item'}
                key={itemIdx}
                onClick={() => handleMenuItemClick(item)}>
                <ListItemIcon> {item.icon} </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
            <Divider />
          </div>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <div className="sidenav">
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          style={{ color: '#fff', boxShadow: 'none' }}
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}>
          <Toolbar className="header-wrapper">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              className="sidenav-button"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}>
              <MenuIcon style={{ color: '#fff' }} />
            </IconButton>
            <div className="user-area user-desktop">
              <span>Hello, {user.userName || user.email}</span>
            </div>
          </Toolbar>
        </AppBar>
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="navigation items">
          {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
          <Drawer
            container={container}
            variant="temporary"
            className="drawer-temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                // backgroundColor: 'rgb(13, 25, 50)',
                // color: '#fff',
              },
            }}>
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            className="drawer-permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                // backgroundColor: 'rgb(13, 25, 50)',
                // color: '#fff',
              },
            }}
            open>
            {drawer}
          </Drawer>
        </Box>
      </Box>
    </div>
  );
});

Sidenav.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Sidenav;
