import { useSelector } from "react-redux";
import useEmblaCarousel from "embla-carousel-react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Link,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PhotographyCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const { items: photography } = useSelector((state) => state.photography);

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  if (!photography || photography.length === 0) return null;

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        Photography Services
      </Typography>
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{ overflow: "hidden", width: "100%" }}
          className="embla"
          ref={emblaRef}
        >
          <Box sx={{ display: "flex", gap: 2 }} className="embla__container">
            {photography.map((photographer) => (
              <Card
                key={photographer._id}
                sx={{
                  flex: "0 0 30%",
                  minWidth: 300,
                  padding: 2,
                  border: "1px solid #ccc",
                }}
              >
                {photographer.photographer_image && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={photographer.photographer_image}
                    alt={photographer.photographer_name}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {photographer.photographer_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {photographer.photographer_description}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    ${photographer.photographer_price}
                  </Typography>
                  {photographer.photographer_portfolio_url && (
                    <Link
                      href={photographer.photographer_portfolio_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: "block", mt: 1, fontSize: "0.875rem" }}
                    >
                      View Portfolio
                    </Link>
                  )}
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
