import { CateringModel, DishModel } from "@/types";
import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import RestaurantIcon from "@mui/icons-material/Restaurant";

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
  IconButton,
  Backdrop,
  Tooltip,
  Paper,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import api from "@/services/apiService";
import { useMutation, useQueryClient } from "react-query";

const CateringCard = ({ catering }: { catering: CateringModel }) => {
  const [dishes, setDishes] = React.useState<DishModel[]>([]);
  const [dishesOpen, setDishesOpen] = React.useState(false);
  const handleDishesClose = () => {
    setDishesOpen(false);
  };
  const handleDishesOpen = async () => {
    setDishesOpen(true);
    const { data } = await api.get("/caterings/dishes"); // Update endpoint to caterings
    setDishes(data);
  };

  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (catering_id: string) => {
      // Update to use catering_id
      const response = await api.delete(`/caterings/${catering_id}`); // Update endpoint to caterings
      return response.data;
    },
    onSettled: () => {
      queryClient.invalidateQueries(["caterings"]);
    },
  });

  return (
    <Grid key={catering.catering_id} size={{ xs: 2, sm: 4, md: 4 }}>
      <Card sx={{ height: "100%" }}>
        <CardHeader
          action={
            <>
              <Tooltip title="Manage dishes">
                <IconButton
                  sx={{ mx: 1 }}
                  onClick={handleDishesOpen} // Update to catering_id
                  aria-label="delete"
                >
                  <RestaurantIcon />
                </IconButton>
              </Tooltip>

              <IconButton
                onClick={async () => await mutate(catering.catering_id)} // Update to catering_id
                aria-label="delete"
              >
                <DeleteForeverIcon color="error" />
              </IconButton>
            </>
          }
          title={catering.catering_name} // Show catering name
        />
        {catering.catering_image && (
          <CardMedia
            component="img"
            height="140"
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
      <Backdrop
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
        open={dishesOpen}
        onClick={handleDishesClose}
      >
        <Paper elevation={3} sx={{ p: 3 }} onClick={(e) => e.stopPropagation()}>
          <Typography variant="h5">Select Dishes</Typography>
          <FormGroup>
            {dishes.map((dish) => {
              return (
                <FormControlLabel
                  key={dish.dish_id}
                  control={
                    <Checkbox
                      defaultChecked={
                        catering.catering_menu_items.find(
                          (menuItem) => menuItem.dish_id === dish.dish_id
                        ) !== undefined
                      }
                      onChange={async (e) => {
                        if (e.target.checked) {
                          await api.post(
                            `/caterings/${catering.catering_id}/dishes/${dish.dish_id}`
                          );
                        } else {
                          await api.delete(
                            `/caterings/${catering.catering_id}/dishes/${dish.dish_id}`
                          );
                        }
                        queryClient.invalidateQueries(["caterings"]);
                      }}
                    />
                  }
                  label={dish.dish_name}
                />
              );
            })}
          </FormGroup>
        </Paper>
      </Backdrop>
    </Grid>
  );
};

export default CateringCard;
