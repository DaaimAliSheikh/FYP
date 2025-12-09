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

export default function DecorationCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const { items: decorations } = useSelector((state) => state.decorations);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  if (!decorations || decorations.length === 0) return null;

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        Decoration Options
      </Typography>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{ overflow: "hidden", width: "100%" }}
          className="embla"
          ref={emblaRef}
        >
          <Box sx={{ display: "flex", gap: 2 }} className="embla__container">
            {decorations.map((decoration) => (
              <Card
                key={decoration.decoration_id}
                sx={{
                  flex: "0 0 30%",
                  minWidth: 300,
                  padding: 2,
                  border: "1px solid #ccc",
                }}
              >
                {decoration.decoration_image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={`http://localhost:8000${decoration.decoration_image}`}
                    alt={decoration.decoration_name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {decoration.decoration_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {decoration.decoration_description}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    ${decoration.decoration_price}
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
