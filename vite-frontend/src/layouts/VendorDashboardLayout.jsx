import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  EventNote,
  Place,
  DirectionsCar,
  Restaurant,
  CameraAlt,
  Logout,
} from "@mui/icons-material";
import { logoutUser } from "@/store/slices/authSlice";

const drawerWidth = 240;

const getMenuItemsForVendor = (vendorType) => {
  const baseItems = [
    {
      text: "Bookings",
      icon: <EventNote />,
      path: `/dashboard/${vendorType}/bookings`,
    },
  ];

  const vendorSpecificItems = {
    venue: [
      { text: "Venues", icon: <Place />, path: "/dashboard/venue/venues" },
    ],
    car_rental: [
      {
        text: "Cars",
        icon: <DirectionsCar />,
        path: "/dashboard/car_rental/cars",
      },
    ],
    catering: [
      {
        text: "Caterings",
        icon: <Restaurant />,
        path: "/dashboard/catering/caterings",
      },
    ],
    photography: [
      {
        text: "Photography",
        icon: <CameraAlt />,
        path: "/dashboard/photography/photography",
      },
    ],
  };

  return [...baseItems, ...(vendorSpecificItems[vendorType] || [])];
};

const getTitleForVendor = (vendorType) => {
  const titles = {
    venue: "Venue Vendor Dashboard",
    car_rental: "Car Rental Vendor Dashboard",
    catering: "Catering Vendor Dashboard",
    photography: "Photography Vendor Dashboard",
  };
  return titles[vendorType] || "Vendor Dashboard";
};

export default function VendorDashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const vendorType = user?.vendor_type;
  const menuItems = getMenuItemsForVendor(vendorType);
  const dashboardTitle = getTitleForVendor(vendorType);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ fontFamily: "Dancing Script, cursive", color: "primary.main" }}
        >
          SHAADI.COM
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {dashboardTitle}
          </Typography>
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.email}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} fontSize="small" />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
