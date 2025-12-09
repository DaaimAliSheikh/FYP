import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  CircularProgress,
} from "@mui/material";
import { LogOut, Calendar, MapPin, Users } from "lucide-react";
import { fetchMyBookings, deleteBooking } from "@/store/slices/bookingSlice";
import { logoutUser } from "@/store/slices/authSlice";
import BookingDialog from "@/components/BookingDialog";

export default function BookingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { myBookings, loading } = useSelector((state) => state.bookings);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  const handleDeleteBooking = async (id) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      await dispatch(deleteBooking(id));
      dispatch(fetchMyBookings());
    }
  };

  const handleEditBooking = (id) => {
    setSelectedBookingId(id);
    setOpenDialog(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "declined":
        return "error";
      default:
        return "default";
    }
  };

  if (loading) {
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
          <Button color="inherit" onClick={() => navigate("/")}>
            Home
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
        <Typography variant="h4" gutterBottom>
          My Bookings
        </Typography>

        {myBookings.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You don't have any bookings yet.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {myBookings.map((booking) => (
              <Grid item xs={12} md={6} key={booking.booking_id}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">
                        {booking.venue?.venue_name || "Venue"}
                      </Typography>
                      <Chip
                        label={booking.booking_status}
                        color={getStatusColor(booking.booking_status)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Calendar size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2">
                        {new Date(
                          booking.booking_event_date
                        ).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <MapPin size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2">
                        {booking.venue?.venue_address}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Users size={16} style={{ marginRight: 8 }} />
                      <Typography variant="body2">
                        {booking.booking_guest_count} guests
                      </Typography>
                    </Box>
                    {booking.payment && (
                      <Typography
                        variant="body2"
                        sx={{ mt: 2, fontWeight: "bold" }}
                      >
                        Total: ${booking.payment.total_amount}
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => handleEditBooking(booking.booking_id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteBooking(booking.booking_id)}
                    >
                      Cancel
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <BookingDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedBookingId(null);
        }}
        bookingId={selectedBookingId}
      />
    </Box>
  );
}
