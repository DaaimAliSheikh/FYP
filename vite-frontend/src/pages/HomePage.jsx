import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";
import { fetchVenues } from "@/store/slices/venueSlice";
import { fetchCaterings } from "@/store/slices/cateringSlice";
import { fetchPhotography } from "@/store/slices/photographySlice";
import { fetchCars } from "@/store/slices/carSlice";
import { fetchPromos } from "@/store/slices/promoSlice";
import { fetchDishes } from "@/store/slices/dishSlice";
import VenueCarousel from "@/components/VenueCarousel";
import CateringCarousel from "@/components/CateringCarousel";
import PhotographyCarousel from "@/components/PhotographyCarousel";
import CarsCarousel from "@/components/CarsCarousel";
import PromosCarousel from "@/components/PromosCarousel";
import DishesCarousel from "@/components/DishesCarousel";

export default function HomePage() {
  const dispatch = useDispatch();
  const { loading: venuesLoading } = useSelector((state) => state.venues);

  useEffect(() => {
    dispatch(fetchVenues());
    dispatch(fetchCaterings());
    dispatch(fetchPhotography());
    dispatch(fetchCars());
    dispatch(fetchPromos());
    dispatch(fetchDishes());
  }, [dispatch]);

  if (venuesLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <VenueCarousel />
      <CateringCarousel />
      <PhotographyCarousel />
      <CarsCarousel />
      <DishesCarousel />
      <PromosCarousel />
    </Box>
  );
}
