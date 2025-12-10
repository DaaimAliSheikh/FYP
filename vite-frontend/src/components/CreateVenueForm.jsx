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
  Grid,
  Chip,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import { Close as CloseIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { createVenue } from "@/store/slices/venueSlice";

export default function CreateVenueForm({ setOpen }) {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    venue_name: "",
    venue_address: "",
    venue_capacity: "",
    venue_price_per_day: "",
    venue_bio: "",
    venue_description: "",
    venue_phone: "",
    venue_email: "",
    venue_indoor_capacity: "",
    venue_outdoor_capacity: "",
    venue_weekday_hours: "",
    venue_weekend_hours: "",
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [amenityInput, setAmenityInput] = useState("");
  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [packages, setPackages] = useState([]);
  const [packageForm, setPackageForm] = useState({
    package_name: "",
    package_price: "",
    package_features: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim()) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput("");
    }
  };

  const handleDeleteAmenity = (index) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleDeleteFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddPackage = () => {
    if (packageForm.package_name && packageForm.package_price) {
      const newPackage = {
        package_name: packageForm.package_name,
        package_price: Number(packageForm.package_price),
        package_features: packageForm.package_features
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f),
      };
      setPackages([...packages, newPackage]);
      setPackageForm({
        package_name: "",
        package_price: "",
        package_features: "",
      });
    }
  };

  const handleDeletePackage = (index) => {
    setPackages(packages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Basic fields
    data.append("venue_name", formData.venue_name);
    data.append("venue_address", formData.venue_address);
    data.append("venue_capacity", formData.venue_capacity);
    data.append("venue_price_per_day", formData.venue_price_per_day);

    // Optional detailed fields
    if (formData.venue_bio) data.append("venue_bio", formData.venue_bio);
    if (formData.venue_description)
      data.append("venue_description", formData.venue_description);
    if (formData.venue_phone) data.append("venue_phone", formData.venue_phone);
    if (formData.venue_email) data.append("venue_email", formData.venue_email);
    if (formData.venue_indoor_capacity)
      data.append("venue_indoor_capacity", formData.venue_indoor_capacity);
    if (formData.venue_outdoor_capacity)
      data.append("venue_outdoor_capacity", formData.venue_outdoor_capacity);
    if (formData.venue_weekday_hours)
      data.append("venue_weekday_hours", formData.venue_weekday_hours);
    if (formData.venue_weekend_hours)
      data.append("venue_weekend_hours", formData.venue_weekend_hours);

    // Images
    images.forEach((image) => {
      data.append("venue_images", image);
    });

    // Arrays as JSON
    if (amenities.length > 0) {
      data.append("venue_amenities", JSON.stringify(amenities));
    }
    if (features.length > 0) {
      data.append("venue_special_features", JSON.stringify(features));
    }
    if (packages.length > 0) {
      data.append("venue_packages", JSON.stringify(packages));
    }

    try {
      await dispatch(createVenue(data)).unwrap();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create venue:", error);
      alert("Failed to create venue. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        maxHeight: "90vh",
        overflow: "auto",
      }}
    >
      <Card
        sx={{ p: 3, width: "100%", maxWidth: 800, position: "relative", my: 2 }}
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h5" gutterBottom>
          Add New Venue
        </Typography>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Basic Info" />
          <Tab label="Details" />
          <Tab label="Images" />
          <Tab label="Features" />
        </Tabs>

        <Box component="form" onSubmit={handleSubmit}>
          {/* Tab 0: Basic Info */}
          {tabValue === 0 && (
            <Stack spacing={2}>
              <TextField
                label="Venue Name *"
                name="venue_name"
                value={formData.venue_name}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Address *"
                name="venue_address"
                value={formData.venue_address}
                onChange={handleChange}
                required
                fullWidth
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Capacity *"
                    name="venue_capacity"
                    type="number"
                    value={formData.venue_capacity}
                    onChange={handleChange}
                    required
                    fullWidth
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price per Day *"
                    name="venue_price_per_day"
                    type="number"
                    value={formData.venue_price_per_day}
                    onChange={handleChange}
                    required
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="venue_phone"
                    value={formData.venue_phone}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="venue_email"
                    type="email"
                    value={formData.venue_email}
                    onChange={handleChange}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Stack>
          )}

          {/* Tab 1: Details */}
          {tabValue === 1 && (
            <Stack spacing={2}>
              <TextField
                label="Bio (Short description)"
                name="venue_bio"
                value={formData.venue_bio}
                onChange={handleChange}
                multiline
                rows={2}
                fullWidth
                helperText="Max 500 characters"
                inputProps={{ maxLength: 500 }}
              />
              <TextField
                label="Full Description"
                name="venue_description"
                value={formData.venue_description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                helperText="Max 2000 characters"
                inputProps={{ maxLength: 2000 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Indoor Capacity"
                    name="venue_indoor_capacity"
                    type="number"
                    value={formData.venue_indoor_capacity}
                    onChange={handleChange}
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Outdoor Capacity"
                    name="venue_outdoor_capacity"
                    type="number"
                    value={formData.venue_outdoor_capacity}
                    onChange={handleChange}
                    fullWidth
                    inputProps={{ min: 0 }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Weekday Hours"
                    name="venue_weekday_hours"
                    value={formData.venue_weekday_hours}
                    onChange={handleChange}
                    fullWidth
                    placeholder="e.g., 9:00 AM - 11:00 PM"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Weekend Hours"
                    name="venue_weekend_hours"
                    value={formData.venue_weekend_hours}
                    onChange={handleChange}
                    fullWidth
                    placeholder="e.g., 8:00 AM - 12:00 AM"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Packages</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Package Name"
                    value={packageForm.package_name}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        package_name: e.target.value,
                      })
                    }
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Price"
                    type="number"
                    value={packageForm.package_price}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        package_price: e.target.value,
                      })
                    }
                    fullWidth
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Box display="flex" gap={1}>
                    <TextField
                      label="Features (comma-separated)"
                      value={packageForm.package_features}
                      onChange={(e) =>
                        setPackageForm({
                          ...packageForm,
                          package_features: e.target.value,
                        })
                      }
                      fullWidth
                      size="small"
                    />
                    <Button
                      onClick={handleAddPackage}
                      variant="outlined"
                      size="small"
                    >
                      Add
                    </Button>
                  </Box>
                </Grid>
              </Grid>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {packages.map((pkg, index) => (
                  <Chip
                    key={index}
                    label={`${pkg.package_name} - PKR ${pkg.package_price}`}
                    onDelete={() => handleDeletePackage(index)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Stack>
            </Stack>
          )}

          {/* Tab 2: Images */}
          {tabValue === 2 && (
            <Stack spacing={2}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Images (Max 10)
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                />
              </Button>
              {imagePreviews.length > 0 && (
                <ImageList cols={3} gap={8}>
                  {imagePreviews.map((preview, index) => (
                    <ImageListItem key={index}>
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        loading="lazy"
                        style={{ height: 150, objectFit: "cover" }}
                      />
                      <ImageListItemBar
                        actionIcon={
                          <IconButton
                            sx={{ color: "rgba(255, 255, 255, 0.8)" }}
                            onClick={() => removeImage(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )}
              {images.length === 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  No images selected. Upload images to showcase your venue.
                </Typography>
              )}
            </Stack>
          )}

          {/* Tab 3: Features */}
          {tabValue === 3 && (
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Amenities
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <TextField
                    label="Add Amenity"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    fullWidth
                    size="small"
                    placeholder="e.g., High-Speed WiFi"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddAmenity())
                    }
                  />
                  <Button onClick={handleAddAmenity} variant="outlined">
                    Add
                  </Button>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {amenities.map((amenity, index) => (
                    <Chip
                      key={index}
                      label={amenity}
                      onDelete={() => handleDeleteAmenity(index)}
                      color="secondary"
                    />
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" gutterBottom>
                  Special Features
                </Typography>
                <Box display="flex" gap={1} mb={2}>
                  <TextField
                    label="Add Feature"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    fullWidth
                    size="small"
                    placeholder="e.g., Panoramic city views"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddFeature())
                    }
                  />
                  <Button onClick={handleAddFeature} variant="outlined">
                    Add
                  </Button>
                </Box>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {features.map((feature, index) => (
                    <Chip
                      key={index}
                      label={feature}
                      onDelete={() => handleDeleteFeature(index)}
                      color="info"
                    />
                  ))}
                </Stack>
              </Box>
            </Stack>
          )}

          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button variant="outlined" onClick={() => setOpen(false)} fullWidth>
              Cancel
            </Button>
            <Button type="submit" variant="contained" fullWidth>
              Create Venue
            </Button>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}
