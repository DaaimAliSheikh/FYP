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
import { fetchCars, createCar, deleteCar } from "@/store/slices/carSlice";

export default function DashboardCars() {
  const dispatch = useDispatch();
  const { items: cars, loading } = useSelector((state) => state.cars);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    car_make: "",
    car_model: "",
    car_year: "",
    car_rental_price: "",
    car_quantity: "",
    car_image: null,
  });

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("car_make", formData.car_make);
    data.append("car_model", formData.car_model);
    data.append("car_year", formData.car_year);
    data.append("car_rental_price", formData.car_rental_price);
    data.append("car_quantity", formData.car_quantity);
    if (formData.car_image) {
      data.append("car_image", formData.car_image);
    }

    await dispatch(createCar(data));
    setOpen(false);
    setFormData({
      car_make: "",
      car_model: "",
      car_year: "",
      car_rental_price: "",
      car_quantity: "",
      car_image: null,
    });
    dispatch(fetchCars());
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this car?")) {
      await dispatch(deleteCar(id));
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
        <Typography variant="h4">Manage Cars</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Car
        </Button>
      </Box>

      <Grid container spacing={3}>
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car.car_id}>
            <Card>
              {car.car_image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={car.car_image}
                  alt={`${car.car_make} ${car.car_model}`}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {car.car_make} {car.car_model}
                </Typography>
                <Typography variant="body2">Year: {car.car_year}</Typography>
                <Typography variant="body2">
                  Rental: ${car.car_rental_price}
                </Typography>
                <Typography variant="body2">
                  Available: {car.car_quantity}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(car.car_id)}
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
          <DialogTitle>Add New Car</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Make"
              value={formData.car_make}
              onChange={(e) =>
                setFormData({ ...formData, car_make: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Model"
              value={formData.car_model}
              onChange={(e) =>
                setFormData({ ...formData, car_model: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Year"
              value={formData.car_year}
              onChange={(e) =>
                setFormData({ ...formData, car_year: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Rental Price"
              value={formData.car_rental_price}
              onChange={(e) =>
                setFormData({ ...formData, car_rental_price: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={formData.car_quantity}
              onChange={(e) =>
                setFormData({ ...formData, car_quantity: e.target.value })
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
                  setFormData({ ...formData, car_image: e.target.files[0] })
                }
              />
            </Button>
            {formData.car_image && (
              <Typography variant="caption" sx={{ ml: 2 }}>
                {formData.car_image.name}
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
