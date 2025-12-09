import { useSelector } from "react-redux";
import useEmblaCarousel from "embla-carousel-react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PromosCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const { items: promos } = useSelector((state) => state.promos);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  if (!promos || promos.length === 0) return null;

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        Active Promotions
      </Typography>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{ overflow: "hidden", width: "100%" }}
          className="embla"
          ref={emblaRef}
        >
          <Box sx={{ display: "flex", gap: 2 }} className="embla__container">
            {promos.map((promo) => (
              <Card
                key={promo.promo_id}
                sx={{
                  flex: "0 0 30%",
                  minWidth: 300,
                  padding: 2,
                  bgcolor: "primary.light",
                  color: "white",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {promo.promo_name}
                  </Typography>
                  <Chip
                    label={`${(promo.promo_discount * 100).toFixed(0)}% OFF`}
                    color="secondary"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2">
                    Valid until:{" "}
                    {new Date(promo.promo_expiry).toLocaleDateString()}
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
