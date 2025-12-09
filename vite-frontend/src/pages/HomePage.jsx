import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/store/slices/authSlice";
import { fetchVenues } from "@/store/slices/venueSlice";
import { fetchCaterings } from "@/store/slices/cateringSlice";
import { fetchDecorations } from "@/store/slices/decorationSlice";
import { fetchCars } from "@/store/slices/carSlice";
import { fetchPromos } from "@/store/slices/promoSlice";
import VenueCarousel from "@/components/VenueCarousel";
import CateringCarousel from "@/components/CateringCarousel";
import DecorationCarousel from "@/components/DecorationCarousel";
import CarsCarousel from "@/components/CarsCarousel";
import PromosCarousel from "@/components/PromosCarousel";
import BookingDialog from "@/components/BookingDialog";

export default function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items: venues, loading: venuesLoading } = useSelector(
    (state) => state.venues
  );
  const { items: caterings } = useSelector((state) => state.caterings);
  const { items: decorations } = useSelector((state) => state.decorations);
  const { items: cars } = useSelector((state) => state.cars);
  const { items: promos } = useSelector((state) => state.promos);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchVenues());
    dispatch(fetchCaterings());
    dispatch(fetchDecorations());
    dispatch(fetchCars());
    dispatch(fetchPromos());
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
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontFamily: "Dancing Script, cursive" }}
          >
            SHAADI.COM
          </Typography>
          <Button color="inherit" onClick={() => navigate("/bookings")}>
            My Bookings
          </Button>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ ml: 2 }}
          >
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

      <Container sx={{ mt: 4 }}>
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h3" gutterBottom>
            Welcome to Shaadi.com
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Book your perfect event venue with us
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => setOpenBookingDialog(true)}
            sx={{ mt: 2 }}
          >
            Create Booking
          </Button>
        </Box>

        <VenueCarousel venues={venues} />
        <CateringCarousel caterings={caterings} />
        <DecorationCarousel decorations={decorations} />
        <CarsCarousel cars={cars} />
        <PromosCarousel promos={promos} />
      </Container>

      <BookingDialog
        open={openBookingDialog}
        onClose={() => setOpenBookingDialog(false)}
        bookingId={null}
      />
    </Box>
  );
}
