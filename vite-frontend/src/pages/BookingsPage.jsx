import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Fab,
  Button,
} from "@mui/material";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import { fetchMyBookings, deleteBooking } from "@/store/slices/bookingSlice";
import { fetchVenues } from "@/store/slices/venueSlice";
import { fetchCaterings } from "@/store/slices/cateringSlice";
import { fetchDecorations } from "@/store/slices/decorationSlice";
import { fetchCars } from "@/store/slices/carSlice";
import { fetchPromos } from "@/store/slices/promoSlice";
import { fetchDishes } from "@/store/slices/dishSlice";
import BookingDialog from "@/components/BookingDialog";

export default function BookingsPage() {
  const dispatch = useDispatch();
  const { myBookings, loading } = useSelector((state) => state.bookings);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchMyBookings());
    // Fetch all data needed for BookingDialog
    dispatch(fetchVenues());
    dispatch(fetchCaterings());
    dispatch(fetchDecorations());
    dispatch(fetchCars());
    dispatch(fetchPromos());
    dispatch(fetchDishes());
  }, [dispatch]);

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

  const handleCreateBooking = () => {
    setSelectedBookingId(null);
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
    <>
      <Box>
        <Typography variant="h6" gutterBottom color="primary">
          Bookings
        </Typography>

        {myBookings.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            You don't have any bookings yet.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
              gap: 3,
            }}
          >
            {myBookings.map((booking) => (
              <Card key={booking.booking_id}>
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
            ))}
          </Box>
        )}
      </Box>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        onClick={handleCreateBooking}
      >
        <Plus size={24} />
      </Fab>

      <BookingDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setSelectedBookingId(null);
        }}
        bookingId={selectedBookingId}
      />
    </>
  );
}
