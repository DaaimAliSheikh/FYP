import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/store/slices/authSlice";
import { fetchVenues } from "@/store/slices/venueSlice";
import { fetchCaterings } from "@/store/slices/cateringSlice";
import { fetchDecorations } from "@/store/slices/decorationSlice";
import { fetchCars } from "@/store/slices/carSlice";
import { fetchPromos } from "@/store/slices/promoSlice";
import { fetchDishes } from "@/store/slices/dishSlice";
import VenueCarousel from "@/components/VenueCarousel";
import CateringCarousel from "@/components/CateringCarousel";
import DecorationCarousel from "@/components/DecorationCarousel";
import CarsCarousel from "@/components/CarsCarousel";
import PromosCarousel from "@/components/PromosCarousel";
import DishesCarousel from "@/components/DishesCarousel";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { loading: venuesLoading } = useSelector((state) => state.venues);

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    dispatch(fetchVenues());
    dispatch(fetchCaterings());
    dispatch(fetchDecorations());
    dispatch(fetchCars());
    dispatch(fetchPromos());
    dispatch(fetchDishes());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  if (venuesLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: "background.paper",
        }}
      >
        <Toolbar>
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
          <Stack direction="row" gap={2}>
            <Button
              sx={{ py: 0 }}
              size="small"
              variant="contained"
              onClick={() => navigate("/bookings")}
            >
              Bookings
            </Button>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
          </Stack>
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          bgcolor: (theme) => theme.palette.background.default,
          minHeight: "100vh",
          pt: 10,
        }}
      >
        <VenueCarousel />
        <CateringCarousel />
        <DecorationCarousel />
        <CarsCarousel />
        <DishesCarousel />
        <PromosCarousel />
      </Box>
    </Box>
  );
}
