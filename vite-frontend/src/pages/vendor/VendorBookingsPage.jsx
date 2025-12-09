import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
} from "@mui/material";
import { fetchMyBookings } from "@/store/slices/bookingSlice";

export default function VendorBookingsPage() {
  const dispatch = useDispatch();
  const { items: bookings, loading } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  // Filter bookings based on vendor type
  const filterBookingsByVendor = () => {
    if (!user?.vendor_type || !bookings) return [];

    return bookings.filter((booking) => {
      switch (user.vendor_type) {
        case "venue":
          return booking.venue_id != null;
        case "car_rental":
          return booking.car_id != null;
        case "catering":
          return booking.catering_id != null;
        case "photography":
          return booking.photography_id != null;
        default:
          return false;
      }
    });
  };

  const vendorBookings = filterBookingsByVendor();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {vendorBookings.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography color="text.secondary">
            No bookings found for your services.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Booking ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Event Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Total Amount</strong>
                </TableCell>
                <TableCell>
                  <strong>Created At</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vendorBookings.map((booking) => (
                <TableRow key={booking._id}>
                  <TableCell>{booking._id}</TableCell>
                  <TableCell>
                    {new Date(booking.booking_event_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.booking_status}
                      color={
                        booking.booking_status === "confirmed"
                          ? "success"
                          : booking.booking_status === "pending"
                          ? "warning"
                          : "default"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${booking.booking_total_amount}</TableCell>
                  <TableCell>
                    {new Date(booking.booking_created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
