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
  Link,
  Grid,
} from "@mui/material";

import {
  Add as AddIcon,
  DeleteForever as DeleteForeverIcon,
} from "@mui/icons-material";
import {
  fetchPhotography,
  deletePhotography,
} from "@/store/slices/photographySlice";
import CreatePhotographyForm from "@/components/CreatePhotographyForm";

export default function PhotographyManagementPage() {
  const dispatch = useDispatch();
  const { items: photography, loading } = useSelector(
    (state) => state.photography
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPhotography());
  }, [dispatch]);

  const handleDelete = async (photographyId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this photography service?"
      )
    ) {
      await dispatch(deletePhotography(photographyId));
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
      <Typography variant="h4">Manage Photography Services</Typography>

      <Grid container spacing={3}>
        {photography?.map((photographer) => (
          <Grid item xs={12} sm={6} md={4} key={photographer._id}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardHeader
                action={
                  <IconButton
                    onClick={() => handleDelete(photographer._id)}
                    color="error"
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                }
                title={photographer.photographer_name}
              />
              {photographer.photographer_image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={photographer.photographer_image}
                  alt={photographer.photographer_name}
                />
              )}
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {photographer.photographer_description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                  ${photographer.photographer_price}
                </Typography>
                {photographer.photographer_portfolio_url && (
                  <Link
                    href={photographer.photographer_portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ display: "block", mt: 1 }}
                  >
                    View Portfolio
                  </Link>
                )}
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
        <CreatePhotographyForm setOpen={setOpen} />
      </Backdrop>
    </Stack>
  );
}
