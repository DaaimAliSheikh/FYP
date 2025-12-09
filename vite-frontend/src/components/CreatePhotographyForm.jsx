import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { createPhotography } from "@/store/slices/photographySlice";

export default function CreatePhotographyForm({ setOpen }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    photographer_name: "",
    photographer_price: "",
    photographer_description: "",
    photographer_portfolio_url: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("photographer_name", formData.photographer_name);
    data.append("photographer_price", formData.photographer_price);
    data.append("photographer_description", formData.photographer_description);
    if (formData.photographer_portfolio_url) {
      data.append(
        "photographer_portfolio_url",
        formData.photographer_portfolio_url
      );
    }
    if (image) {
      data.append("photographer_image", image);
    }

    await dispatch(createPhotography(data));
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <Card sx={{ p: 3, width: "100%", maxWidth: 600, position: "relative" }}>
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" gutterBottom>
          Add Photography Service
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Photographer Name"
              name="photographer_name"
              value={formData.photographer_name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Price"
              name="photographer_price"
              type="number"
              value={formData.photographer_price}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="photographer_description"
              value={formData.photographer_description}
              onChange={handleChange}
              multiline
              rows={3}
              required
              fullWidth
            />
            <TextField
              label="Portfolio URL (optional)"
              name="photographer_portfolio_url"
              value={formData.photographer_portfolio_url}
              onChange={handleChange}
              fullWidth
            />
            <Button variant="outlined" component="label" fullWidth>
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {image && (
              <Typography variant="caption" color="text.secondary">
                Selected: {image.name}
              </Typography>
            )}
            <Button type="submit" variant="contained" fullWidth>
              Create Photography Service
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
