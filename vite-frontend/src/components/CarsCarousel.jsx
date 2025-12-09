import { useSelector } from "react-redux";
import useEmblaCarousel from "embla-carousel-react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CarsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const { items: cars } = useSelector((state) => state.cars);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  if (!cars || cars.length === 0) return null;

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        Available Cars for Rent
      </Typography>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{ overflow: "hidden", width: "100%" }}
          className="embla"
          ref={emblaRef}
        >
          <Box sx={{ display: "flex", gap: 2 }} className="embla__container">
            {cars.map((car) => (
              <Card
                key={car.car_id}
                sx={{
                  flex: "0 0 30%",
                  minWidth: 300,
                  padding: 2,
                  border: "1px solid #ccc",
                }}
              >
                {car.car_image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:8000${car.car_image}`}
                    alt={`${car.car_make} ${car.car_model}`}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {car.car_make} {car.car_model}
                  </Typography>
                  <Typography variant="body2">Year: {car.car_year}</Typography>
                  <Typography variant="body2" color="primary">
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

        <IconButton
          onClick={scrollPrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <IconButton
          onClick={scrollNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Box>
    </Box>
  );
}
