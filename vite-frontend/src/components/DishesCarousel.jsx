import { useSelector } from "react-redux";
import useEmblaCarousel from "embla-carousel-react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DishesCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const { items: dishes } = useSelector((state) => state.dishes);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  if (!dishes || dishes.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        Delicious Dishes which are ready to serve
      </Typography>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{ overflow: "hidden", width: "100%" }}
          className="embla"
          ref={emblaRef}
        >
          <Box sx={{ display: "flex", gap: 2 }} className="embla__container">
            {dishes.map((dish) => (
              <Card
                key={dish.dish_id}
                sx={{
                  flex: "0 0 30%",
                  minWidth: 300,
                  padding: 2,
                  border: "1px solid #ccc",
                }}
              >
                <CardHeader title={dish.dish_name} />
                {dish.dish_image && (
                  <CardMedia
                    component="img"
                    alt={dish.dish_name}
                    height="140"
                    image={`http://localhost:8000${dish.dish_image}`}
                  />
                )}
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                    Type: {dish.dish_type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Description: {dish.dish_description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cost per serving: ${dish.dish_cost_per_serving}
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
