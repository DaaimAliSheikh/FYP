import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import api from "@/services/apiService"; // Assuming API setup for fetching promos
import { PromoModel } from "@/types"; // Assuming promo type is already imported
import { useQuery } from "react-query";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Fetch promo data
const fetchPromos = async (): Promise<PromoModel[]> => {
  const { data } = await api.get("/promos"); // Replace with your API endpoint for promos
  return data;
};

const PromosCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const {
    data: promos,
    isLoading,
    isError,
  } = useQuery(["promos"], fetchPromos, {
    onError: (
      error: any // eslint-disable-line @typescript-eslint/no-explicit-any
    ) => {
      console.error("Error fetching promos", error);
    },
  });

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  if (isLoading) {
    return (
      <Typography variant="h6" color="primary" align="center">
        Loading Promos...
      </Typography>
    );
  }

  if (isError) {
    return (
      <Typography variant="h6" color="error" align="center">
        Failed to load promos.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 5 }}>
      <Typography variant="h4" color="primary" align="center" gutterBottom>
        Current Promotions
      </Typography>
      <Box sx={{ position: "relative" }}>
        {/* Carousel Container */}
        <Box
          sx={{ overflow: "hidden", width: "100%" }}
          className="embla"
          ref={emblaRef}
        >
          <Box sx={{ display: "flex", gap: 2 }} className="embla__container">
            {promos?.map((promo) => {
              const expiryDate = new Date(
                promo.promo_expiry
              ).toLocaleDateString(); // Format expiry date

              return (
                <Card
                  key={promo.promo_id}
                  sx={{
                    flex: "0 0 30%",
                    padding: 2,
                    border: "1px solid #ccc",
                    borderRadius: 2,
                  }}
                >
                  <CardHeader title={promo.promo_name} />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      Discount: {promo.promo_discount * 100}% OFF
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Expiry Date: {expiryDate}
                    </Typography>
                    <Chip
                      sx={{ mt: 2 }}
                      variant="outlined"
                      color={
                        new Date(promo.promo_expiry) <= new Date()
                          ? "error"
                          : "success"
                      }
                      label={
                        new Date(promo.promo_expiry) <= new Date()
                          ? "Expired"
                          : "Valid"
                      }
                    />
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>

        {/* Left Scroll Button */}
        <IconButton
          onClick={scrollPrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
          }}
        >
          <ChevronLeftIcon />
        </IconButton>

        {/* Right Scroll Button */}
        <IconButton
          onClick={scrollNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            transform: "translateY(-50%)",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            borderRadius: "50%",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.8)",
            },
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PromosCarousel;
