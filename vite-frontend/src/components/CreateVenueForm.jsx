import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { createVenue } from "@/store/slices/venueSlice";

export default function CreateVenueForm({ setOpen }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    venue_name: "",
    venue_address: "",
    venue_capacity: "",
    venue_price_per_day: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("venue_name", formData.venue_name);
    data.append("venue_address", formData.venue_address);
    data.append("venue_capacity", formData.venue_capacity);
    data.append("venue_price_per_day", formData.venue_price_per_day);
    if (image) {
      data.append("venue_image", image);
    }

    await dispatch(createVenue(data));
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Card sx={{ p: 3, width: "100%", maxWidth: 600, position: "relative" }}>
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" gutterBottom>
          Add Venue
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Venue Name"
              name="venue_name"
              value={formData.venue_name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Address"
              name="venue_address"
              value={formData.venue_address}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Capacity"
              name="venue_capacity"
              type="number"
              value={formData.venue_capacity}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Price per Day"
              name="venue_price_per_day"
              type="number"
              value={formData.venue_price_per_day}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />
            <Button variant="outlined" component="label" fullWidth>
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {image && (
              <Typography variant="caption" color="text.secondary">
                Selected: {image.name}
              </Typography>
            )}
            <Button type="submit" variant="contained" fullWidth>
              Create Venue
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
