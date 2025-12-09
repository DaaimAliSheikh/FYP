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
import { createCatering } from "@/store/slices/cateringSlice";

export default function CreateCateringForm({ setOpen }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    catering_name: "",
    catering_description: "",
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
    data.append("catering_name", formData.catering_name);
    data.append("catering_description", formData.catering_description);
    if (image) {
      data.append("catering_image", image);
    }

    await dispatch(createCatering(data));
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
          Add Catering
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Catering Name"
              name="catering_name"
              value={formData.catering_name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="catering_description"
              value={formData.catering_description}
              onChange={handleChange}
              multiline
              rows={3}
              required
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
              Create Catering
            </Button>
          </Stack>
        </Box>
      </Card>
    </Box>
  );
}
