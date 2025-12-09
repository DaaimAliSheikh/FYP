import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";

export default function CarsCarousel({ cars }) {
  if (!cars || cars.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Available Cars
      </Typography>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
        {cars.map((car) => (
          <Card key={car.car_id} sx={{ minWidth: 300, flex: "0 0 auto" }}>
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
          </Card>
        ))}
      </Box>
    </Box>
  );
}
