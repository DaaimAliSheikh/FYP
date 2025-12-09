import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  fetchVenues,
  createVenue,
  deleteVenue,
} from "@/store/slices/venueSlice";

export default function DashboardVenues() {
  const dispatch = useDispatch();
  const { items: venues, loading } = useSelector((state) => state.venues);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    venue_name: "",
    venue_address: "",
    venue_capacity: "",
    venue_price_per_day: "",
    venue_image: null,
  });

  useEffect(() => {
    dispatch(fetchVenues());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("venue_name", formData.venue_name);
    data.append("venue_address", formData.venue_address);
    data.append("venue_capacity", formData.venue_capacity);
    data.append("venue_price_per_day", formData.venue_price_per_day);
    if (formData.venue_image) {
      data.append("venue_image", formData.venue_image);
    }

    await dispatch(createVenue(data));
    setOpen(false);
    setFormData({
      venue_name: "",
      venue_address: "",
      venue_capacity: "",
      venue_price_per_day: "",
      venue_image: null,
    });
    dispatch(fetchVenues());
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this venue?")) {
      await dispatch(deleteVenue(id));
      dispatch(fetchVenues());
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Manage Venues</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Venue
        </Button>
      </Box>

      <Grid container spacing={3}>
        {venues.map((venue) => (
          <Grid item xs={12} sm={6} md={4} key={venue.venue_id}>
            <Card>
              {venue.venue_image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={venue.venue_image}
                  alt={venue.venue_name}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {venue.venue_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {venue.venue_address}
                </Typography>
                <Typography variant="body2">
                  Capacity: {venue.venue_capacity}
                </Typography>
                <Typography variant="body2">
                  Price: ${venue.venue_price_per_day}/day
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(venue.venue_id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add New Venue</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Venue Name"
              value={formData.venue_name}
              onChange={(e) =>
                setFormData({ ...formData, venue_name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Address"
              value={formData.venue_address}
              onChange={(e) =>
                setFormData({ ...formData, venue_address: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Capacity"
              value={formData.venue_capacity}
              onChange={(e) =>
                setFormData({ ...formData, venue_capacity: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Price per Day"
              value={formData.venue_price_per_day}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  venue_price_per_day: e.target.value,
                })
              }
              margin="normal"
              required
            />
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, venue_image: e.target.files[0] })
                }
              />
            </Button>
            {formData.venue_image && (
              <Typography variant="caption" sx={{ ml: 2 }}>
                {formData.venue_image.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
