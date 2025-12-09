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
import { fetchCaterings, deleteCatering } from "@/store/slices/cateringSlice";
import CreateCateringForm from "@/components/CreateCateringForm";

export default function CateringsManagementPage() {
  const dispatch = useDispatch();
  const { items: caterings, loading } = useSelector((state) => state.caterings);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCaterings());
  }, [dispatch]);

  const handleDelete = async (cateringId) => {
    if (
      window.confirm("Are you sure you want to delete this catering service?")
    ) {
      await dispatch(deleteCatering(cateringId));
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
      <Typography variant="h4">Manage Caterings</Typography>

      <Grid container spacing={3}>
        {caterings?.map((catering) => (
          <Grid item xs={12} sm={6} md={4} key={catering._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardHeader
                action={
                  <IconButton
                    onClick={() => handleDelete(catering._id)}
                    color="error"
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                }
                title={catering.catering_name}
              />
              {catering.catering_image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={catering.catering_image}
                  alt={catering.catering_name}
                />
              )}
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {catering.catering_description}
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
        <CreateCateringForm setOpen={setOpen} />
      </Backdrop>
    </Stack>
  );
}
