import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardHeader,
  IconButton,
  CircularProgress,
  Fab,
  Backdrop,
  Stack,
  Grid,
} from "@mui/material";
import {
  Add as AddIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import { fetchCars, deleteCar } from "@/store/slices/carSlice";
import CreateCarForm from "@/components/CreateCarForm";

export default function CarsManagementPage() {
  const dispatch = useDispatch();
  const { items: cars, loading } = useSelector((state) => state.cars);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const handleDelete = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      await dispatch(deleteCar(carId));
    }
  };

  const handleOpen = () => setOpen(true);

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
    <Stack direction="column" spacing={2} sx={{ flexGrow: 1 }}>
      <Typography variant="h4">Manage Cars</Typography>

      <Grid container spacing={3}>
        {cars?.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardHeader
                action={
                  <IconButton
                    onClick={() => handleDelete(car._id)}
                    color="error"
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                }
                title={`${car.car_make} ${car.car_model}`}
              />
              {car.car_image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={car.car_image}
                  alt={`${car.car_make} ${car.car_model}`}
                />
              )}
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  Year: {car.car_year}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Quantity: {car.car_quantity}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${car.car_rental_price}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        color="primary"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        size="medium"
        onClick={handleOpen}
        aria-label="add"
      >
        <AddIcon />
      </Fab>

      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          "&.MuiBackdrop-root": {
            marginTop: "0 !important",
          },
        }}
        open={open}
      >
        <CreateCarForm setOpen={setOpen} />
      </Backdrop>
    </Stack>
  );
}
