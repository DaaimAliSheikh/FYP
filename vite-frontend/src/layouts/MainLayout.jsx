import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Stack,
  Button,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Home,
  BookmarkCheck,
  User,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "@/store/slices/authSlice";

const drawerWidth = 240;

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const menuItems = [
    { text: "Home", icon: <Home size={20} />, path: "/" },
    { text: "Bookings", icon: <BookmarkCheck size={20} />, path: "/bookings" },
    { text: "Profile", icon: <User size={20} />, path: "/profile" },
    { text: "Payments", icon: <CreditCard size={20} />, path: "/payments" },
    { text: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography
          color="primary"
          variant="h6"
          sx={{ fontFamily: "Dancing Script, cursive" }}
        >
          SHAADI.COM
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
            sx={{
              color:
                location.pathname === item.path ? "primary.main" : "inherit",
              bgcolor:
                location.pathname === item.path
                  ? "action.selected"
                  : "transparent",
            }}
          >
            <ListItemIcon
              sx={{
                color:
                  location.pathname === item.path ? "primary.main" : "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            color="primary"
            variant="h6"
            sx={{
              flexGrow: 1,
              fontFamily: "Dancing Script, cursive",
              display: "flex",
              alignItems: "center",
              fontSize: "1.5rem",
            }}
          >
            SHAADI.COM
            <Chip
              sx={{ ml: 2 }}
              color="primary"
              variant="filled"
              label="User"
            />
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ bgcolor: "secondary.main" }}>
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem disabled>
              <Typography variant="body2">{user?.email}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogOut size={16} style={{ marginRight: 8 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          minHeight: "100vh",
          bgcolor: (theme) => theme.palette.background.default,
          pt: 10,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
