"use client";
import React from "react";
import {
  Typography,
  CircularProgress,
  Box,
  Fab,
  Backdrop,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid2";
import api from "@/services/apiService";
import { CateringModel } from "@/types"; // Update import to CateringModel
import CreateCateringForm from "@/components/CreateCateringForm"; // Update to create catering form
import { useQuery } from "react-query";
import CateringCard from "@/components/CateringCard";

const fetchCaterings = async (): Promise<CateringModel[]> => {
  const { data } = await api.get("/caterings"); // Update endpoint to caterings
  return data;
};

const Caterings = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const {
    data: caterings,
    isLoading,
    error,
  } = useQuery(["caterings"], fetchCaterings, {
    onError: () => {
      console.error("Error fetching caterings");
    },
  });

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Failed to load caterings.</Typography>;
  }

  return (
    <Stack
      direction="column"
      justifyContent={"space-between"}
      flexGrow={1}
      spacing={2}
      sx={{
        p: 2,
        justifySelf: "stretch",
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 2, sm: 8, md: 12 }}
      >
        {caterings?.map((catering) => (
          <CateringCard key={catering.catering_id} catering={catering} />
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
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={open}
      >
        <CreateCateringForm setOpen={setOpen} />
      </Backdrop>
    </Stack>
  );
};

export default Caterings;
