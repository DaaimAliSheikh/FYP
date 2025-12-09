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
import { fetchVenues, deleteVenue } from "@/store/slices/venueSlice";
import CreateVenueForm from "@/components/CreateVenueForm";

export default function VenuesManagementPage() {
  const dispatch = useDispatch();
  const { items: venues, loading } = useSelector((state) => state.venues);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchVenues());
  }, [dispatch]);

  const handleDelete = async (venueId) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      await dispatch(deleteVenue(venueId));
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
      <Typography variant="h4">Manage Venues</Typography>

      <Grid container spacing={3}>
        {venues?.map((venue) => (
          <Grid item xs={12} sm={6} md={4} key={venue._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardHeader
                action={
                  <IconButton
                    onClick={() => handleDelete(venue._id)}
                    color="error"
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                }
                title={venue.venue_name}
              />
              {venue.venue_image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={venue.venue_image}
                  alt={venue.venue_name}
                />
              )}
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {venue.venue_address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Capacity: {venue.venue_capacity}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${venue.venue_price_per_day}/day
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
        <CreateVenueForm setOpen={setOpen} />
      </Backdrop>
    </Stack>
  );
}
