import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { fetchDishes, createDish, deleteDish } from "@/store/slices/dishSlice";

export default function DashboardDishes() {
  const dispatch = useDispatch();
  const { items: dishes, loading } = useSelector((state) => state.dishes);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    dish_name: "",
    dish_description: "",
    dish_type: "main",
    dish_cost_per_serving: "",
    dish_image: null,
  });

  useEffect(() => {
    dispatch(fetchDishes());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("dish_name", formData.dish_name);
    data.append("dish_description", formData.dish_description);
    data.append("dish_type", formData.dish_type);
    data.append("dish_cost_per_serving", formData.dish_cost_per_serving);
    if (formData.dish_image) {
      data.append("dish_image", formData.dish_image);
    }

    await dispatch(createDish(data));
    setOpen(false);
    setFormData({
      dish_name: "",
      dish_description: "",
      dish_type: "main",
      dish_cost_per_serving: "",
      dish_image: null,
    });
    dispatch(fetchDishes());
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this dish?")) {
      await dispatch(deleteDish(id));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Manage Dishes</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Dish
        </Button>
      </Box>

      <Grid container spacing={3}>
        {dishes.map((dish) => (
          <Grid item xs={12} sm={6} md={4} key={dish.dish_id}>
            <Card>
              {dish.dish_image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={dish.dish_image}
                  alt={dish.dish_name}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {dish.dish_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {dish.dish_description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Type: {dish.dish_type} | Cost: ${dish.dish_cost_per_serving}
                  /serving
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(dish.dish_id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add New Dish</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Dish Name"
              value={formData.dish_name}
              onChange={(e) =>
                setFormData({ ...formData, dish_name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.dish_description}
              onChange={(e) =>
                setFormData({ ...formData, dish_description: e.target.value })
              }
              margin="normal"
              multiline
              rows={2}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Dish Type</InputLabel>
              <Select
                value={formData.dish_type}
                onChange={(e) =>
                  setFormData({ ...formData, dish_type: e.target.value })
                }
                label="Dish Type"
              >
                <MenuItem value="starter">Starter</MenuItem>
                <MenuItem value="main">Main</MenuItem>
                <MenuItem value="dessert">Dessert</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="number"
              label="Cost per Serving"
              value={formData.dish_cost_per_serving}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dish_cost_per_serving: e.target.value,
                })
              }
              margin="normal"
              required
            />
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, dish_image: e.target.files[0] })
                }
              />
            </Button>
            {formData.dish_image && (
              <Typography variant="caption" sx={{ ml: 2 }}>
                {formData.dish_image.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
