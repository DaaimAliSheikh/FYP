import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import {
  createBooking,
  updateBooking,
  fetchMyBookings,
} from "@/store/slices/bookingSlice";
import { fetchVenues } from "@/store/slices/venueSlice";
import { fetchCaterings } from "@/store/slices/cateringSlice";
import { fetchPhotography } from "@/store/slices/photographySlice";
import { fetchCars } from "@/store/slices/carSlice";
import { fetchPromos } from "@/store/slices/promoSlice";
import api from "@/services/api";

export default function BookingDialog({ open, onClose, bookingId }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: venues } = useSelector((state) => state.venues);
  const { items: caterings } = useSelector((state) => state.caterings);
  const { items: photography } = useSelector((state) => state.photography);
  const { items: cars } = useSelector((state) => state.cars);
  const { items: promos } = useSelector((state) => state.promos);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    booking_event_date: "",
    booking_guest_count: 1,
    venue_id: "",
    catering_id: "",
    photography_id: "",
    promo_id: "",
    car_ids: [],
    payment_method: "debit_card",
  });
  const [totalCost, setTotalCost] = useState(0);
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    if (open && bookingId) {
      loadBooking();
    }
    if (open && !bookingId) {
      // Reset form for new booking
      setFormData({
        booking_event_date: "",
        booking_guest_count: 1,
        venue_id: "",
        catering_id: "",
        photography_id: "",
        promo_id: "",
        car_ids: [],
        payment_method: "debit_card",
      });
    }
  }, [open, bookingId]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await api.get("/caterings/dishes");
        setDishes(response.data);
      } catch (error) {
        console.error("Failed to load dishes:", error);
      }
    };
    if (open && formData.catering_id) {
      fetchDishes();
    }
  }, [open, formData.catering_id]);

  const loadBooking = async () => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      const booking = response.data;
      setFormData({
        booking_event_date: booking.booking_event_date.split("T")[0],
        booking_guest_count: booking.booking_guest_count,
        venue_id: booking.venue_id?._id || booking.venue_id || "",
        catering_id: booking.catering_id?._id || booking.catering_id || "",
        photography_id:
          booking.photography_id?._id || booking.photography_id || "",
        promo_id: booking.promo_id?._id || booking.promo_id || "",
        car_ids: booking.car_reservations?.map((r) => r.car_id) || [],
        payment_method: booking.payment?.payment_method || "debit_card",
      });
    } catch (error) {
      console.error("Failed to load booking:", error);
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [formData, venues, caterings, photography, cars, promos, dishes]);

  const calculateTotal = () => {
    let total = 0;

    const venue = venues.find((v) => v.venue_id === formData.venue_id);
    if (venue) total += venue.venue_price_per_day;

    const catering = caterings.find(
      (c) => c.catering_id === formData.catering_id
    );
    // Calculate dish cost per serving for the selected catering
    const dishCostPerServing = dishes.reduce(
      (sum, dish) =>
        sum + dish.dish_cost_per_serving * formData.booking_guest_count,
      0
    );
    if (catering) total += dishCostPerServing;

    const photographyService = photography.find(
      (p) => p._id === formData.photography_id
    );
    if (photographyService) total += photographyService.photographer_price;

    formData.car_ids.forEach((carId) => {
      const car = cars.find((c) => c.car_id === carId);
      if (car) total += car.car_rental_price;
    });

    const promo = promos.find((p) => p.promo_id === formData.promo_id);
    if (promo) {
      total = total * (1 - promo.promo_discount);
    }

    setTotalCost(Math.ceil(total));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const bookingData = {
        booking: {
          booking_event_date: new Date(
            formData.booking_event_date
          ).toISOString(),
          booking_guest_count: parseInt(formData.booking_guest_count),
          user_id: user.user_id,
          venue_id: formData.venue_id,
          catering_id: formData.catering_id || undefined,
          photography_id: formData.photography_id || undefined,
          promo_id: formData.promo_id || undefined,
        },
        payment: {
          amount_payed: totalCost,
          discount: 0,
          total_amount: totalCost,
          payment_method: formData.payment_method,
        },
        car_ids: formData.car_ids,
      };

      if (bookingId) {
        await dispatch(updateBooking({ id: bookingId, data: bookingData }));
      } else {
        await dispatch(createBooking(bookingData));
      }

      dispatch(fetchMyBookings());
      onClose();
    } catch (error) {
      console.error("Failed to submit booking:", error);
      alert(error.response?.data?.detail || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handleCarToggle = (carId) => {
    setFormData((prev) => ({
      ...prev,
      car_ids: prev.car_ids.includes(carId)
        ? prev.car_ids.filter((id) => id !== carId)
        : [...prev.car_ids, carId],
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {bookingId ? "Edit Booking" : "Create New Booking"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="date"
            label="Event Date"
            value={formData.booking_event_date}
            onChange={(e) =>
              setFormData({ ...formData, booking_event_date: e.target.value })
            }
            margin="normal"
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: new Date().toISOString().split("T")[0] }}
            required
          />

          <TextField
            fullWidth
            type="number"
            label="Guest Count"
            value={formData.booking_guest_count}
            onChange={(e) =>
              setFormData({ ...formData, booking_guest_count: e.target.value })
            }
            margin="normal"
            inputProps={{ min: 1 }}
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Venue</InputLabel>
            <Select
              value={formData.venue_id}
              onChange={(e) =>
                setFormData({ ...formData, venue_id: e.target.value })
              }
              label="Venue"
            >
              {venues.map((venue) => (
                <MenuItem key={venue.venue_id} value={venue.venue_id}>
                  {venue.venue_name} - ${venue.venue_price_per_day}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Catering (Optional)</InputLabel>
            <Select
              value={formData.catering_id}
              onChange={(e) =>
                setFormData({ ...formData, catering_id: e.target.value })
              }
              label="Catering (Optional)"
            >
              <MenuItem value="">None</MenuItem>
              {caterings.map((catering) => (
                <MenuItem
                  key={catering.catering_id}
                  value={catering.catering_id}
                >
                  {catering.catering_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Photography (Optional)</InputLabel>
            <Select
              value={formData.photography_id}
              onChange={(e) =>
                setFormData({ ...formData, photography_id: e.target.value })
              }
              label="Photography (Optional)"
            >
              <MenuItem value="">None</MenuItem>
              {photography.map((photographer) => (
                <MenuItem key={photographer._id} value={photographer._id}>
                  {photographer.photographer_name} - $
                  {photographer.photographer_price}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Promo Code (Optional)</InputLabel>
            <Select
              value={formData.promo_id}
              onChange={(e) =>
                setFormData({ ...formData, promo_id: e.target.value })
              }
              label="Promo Code (Optional)"
            >
              <MenuItem value="">None</MenuItem>
              {promos.map((promo) => (
                <MenuItem key={promo.promo_id} value={promo.promo_id}>
                  {promo.promo_name} - {(promo.promo_discount * 100).toFixed(0)}
                  % OFF
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Cars (Optional)
            </Typography>
            {cars.map((car) => (
              <FormControlLabel
                key={car.car_id}
                control={
                  <Checkbox
                    checked={formData.car_ids.includes(car.car_id)}
                    onChange={() => handleCarToggle(car.car_id)}
                    disabled={
                      car.car_quantity === 0 &&
                      !formData.car_ids.includes(car.car_id)
                    }
                  />
                }
                label={`${car.car_make} ${car.car_model} - $${car.car_rental_price} (Available: ${car.car_quantity})`}
              />
            ))}
          </Box>

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={formData.payment_method}
              onChange={(e) =>
                setFormData({ ...formData, payment_method: e.target.value })
              }
              label="Payment Method"
            >
              <MenuItem value="debit_card">Debit Card</MenuItem>
              <MenuItem value="credit_card">Credit Card</MenuItem>
              <MenuItem value="easypaisa">Easypaisa</MenuItem>
              <MenuItem value="jazzcash">JazzCash</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 3, p: 2, bgcolor: "primary.light", borderRadius: 1 }}>
            <Typography variant="h6" color="white">
              Total Cost: ${totalCost.toFixed(2)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? (
              <CircularProgress size={24} />
            ) : bookingId ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
