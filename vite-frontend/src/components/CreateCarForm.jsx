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
import { createCar } from "@/store/slices/carSlice";

export default function CreateCarForm({ setOpen }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    car_make: "",
    car_model: "",
    car_year: "",
    car_rental_price: "",
    car_quantity: "",
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
    try {
      const data = new FormData();
      data.append("car_make", formData.car_make);
      data.append("car_model", formData.car_model);
      data.append("car_year", formData.car_year);
      data.append("car_rental_price", formData.car_rental_price);
      data.append("car_quantity", formData.car_quantity);
      if (image) {
        data.append("car_image", image);
      }

      await dispatch(createCar(data)).unwrap();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create car:", error);
      alert("Failed to create car: " + (error.message || "Unknown error"));
    }
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
          Add Car
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Car Make"
              name="car_make"
              value={formData.car_make}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Car Model"
              name="car_model"
              value={formData.car_model}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Year"
              name="car_year"
              type="number"
              value={formData.car_year}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 1886, max: new Date().getFullYear() + 1 }}
            />
            <TextField
              label="Rental Price"
              name="car_rental_price"
              type="number"
              value={formData.car_rental_price}
              onChange={handleChange}
              required
              fullWidth
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Quantity"
              name="car_quantity"
              type="number"
              value={formData.car_quantity}
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
              Create Car
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
