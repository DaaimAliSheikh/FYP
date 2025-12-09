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
} from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  fetchDecorations,
  createDecoration,
  deleteDecoration,
} from "@/store/slices/decorationSlice";

export default function DashboardDecorations() {
  const dispatch = useDispatch();
  const { items: decorations, loading } = useSelector(
    (state) => state.decorations
  );
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    decoration_name: "",
    decoration_price: "",
    decoration_description: "",
    decoration_image: null,
  });

  useEffect(() => {
    dispatch(fetchDecorations());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("decoration_name", formData.decoration_name);
    data.append("decoration_price", formData.decoration_price);
    data.append("decoration_description", formData.decoration_description);
    if (formData.decoration_image) {
      data.append("decoration_image", formData.decoration_image);
    }

    await dispatch(createDecoration(data));
    setOpen(false);
    setFormData({
      decoration_name: "",
      decoration_price: "",
      decoration_description: "",
      decoration_image: null,
    });
    dispatch(fetchDecorations());
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this decoration?")) {
      await dispatch(deleteDecoration(id));
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
        <Typography variant="h4">Manage Decorations</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Decoration
        </Button>
      </Box>

      <Grid container spacing={3}>
        {decorations.map((decoration) => (
          <Grid item xs={12} sm={6} md={4} key={decoration.decoration_id}>
            <Card>
              {decoration.decoration_image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={decoration.decoration_image}
                  alt={decoration.decoration_name}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {decoration.decoration_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {decoration.decoration_description}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Price: ${decoration.decoration_price}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(decoration.decoration_id)}
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
          <DialogTitle>Add New Decoration</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Decoration Name"
              value={formData.decoration_name}
              onChange={(e) =>
                setFormData({ ...formData, decoration_name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Price"
              value={formData.decoration_price}
              onChange={(e) =>
                setFormData({ ...formData, decoration_price: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.decoration_description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  decoration_description: e.target.value,
                })
              }
              margin="normal"
              multiline
              rows={3}
              required
            />
            <Button variant="outlined" component="label" sx={{ mt: 2 }}>
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    decoration_image: e.target.files[0],
                  })
                }
              />
            </Button>
            {formData.decoration_image && (
              <Typography variant="caption" sx={{ ml: 2 }}>
                {formData.decoration_image.name}
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
