import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import {
  fetchBookings,
  deleteBooking,
  updateBooking,
} from "@/store/slices/bookingSlice";

export default function DashboardBookings() {
  const dispatch = useDispatch();
  const { items: bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const handleStatusChange = async (id, currentStatus) => {
    const statuses = ["pending", "confirmed", "declined"];
    const currentIndex = statuses.indexOf(currentStatus);
    const newStatus = statuses[(currentIndex + 1) % statuses.length];

    await dispatch(
      updateBooking({
        id,
        data: { booking: { booking_status: newStatus } },
      })
    );
    dispatch(fetchBookings());
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      await dispatch(deleteBooking(id));
      dispatch(fetchBookings());
    }
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
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage Bookings
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Event Date</TableCell>
              <TableCell>Guests</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.booking_id}>
                  <TableCell>{booking.user_id?.username || "N/A"}</TableCell>
                  <TableCell>{booking.venue_id?.venue_name || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(booking.booking_event_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{booking.booking_guest_count}</TableCell>
                  <TableCell>${booking.payment?.total_amount || 0}</TableCell>
                  <TableCell>
                    <Chip
                      label={booking.booking_status}
                      color={getStatusColor(booking.booking_status)}
                      size="small"
                      onClick={() =>
                        handleStatusChange(
                          booking.booking_id,
                          booking.booking_status
                        )
                      }
                      sx={{ cursor: "pointer" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(booking.booking_id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
