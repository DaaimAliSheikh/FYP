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
  fetchCaterings,
  createCatering,
  deleteCatering,
} from "@/store/slices/cateringSlice";

export default function DashboardCaterings() {
  const dispatch = useDispatch();
  const { items: caterings, loading } = useSelector((state) => state.caterings);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    catering_name: "",
    catering_description: "",
    catering_image: null,
  });

  useEffect(() => {
    dispatch(fetchCaterings());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("catering_name", formData.catering_name);
    data.append("catering_description", formData.catering_description);
    if (formData.catering_image) {
      data.append("catering_image", formData.catering_image);
    }

    await dispatch(createCatering(data));
    setOpen(false);
    setFormData({
      catering_name: "",
      catering_description: "",
      catering_image: null,
    });
    dispatch(fetchCaterings());
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this catering?")) {
      await dispatch(deleteCatering(id));
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
        <Typography variant="h4">Manage Caterings</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Catering
        </Button>
      </Box>

      <Grid container spacing={3}>
        {caterings.map((catering) => (
          <Grid item xs={12} sm={6} md={4} key={catering.catering_id}>
            <Card>
              {catering.catering_image && (
                <CardMedia
                  component="img"
                  height="200"
                  image={catering.catering_image}
                  alt={catering.catering_name}
                />
              )}
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {catering.catering_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {catering.catering_description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDelete(catering.catering_id)}
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
          <DialogTitle>Add New Catering</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Catering Name"
              value={formData.catering_name}
              onChange={(e) =>
                setFormData({ ...formData, catering_name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.catering_description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  catering_description: e.target.value,
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
                    catering_image: e.target.files[0],
                  })
                }
              />
            </Button>
            {formData.catering_image && (
              <Typography variant="caption" sx={{ ml: 2 }}>
                {formData.catering_image.name}
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
