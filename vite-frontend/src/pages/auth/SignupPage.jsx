import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Stack,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Button,
  Link,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import { signupUser } from "@/store/slices/authSlice";

export default function SignupPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    vendor_type: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setFormData({
      ...formData,
      role: newValue === 0 ? "user" : "vendor",
      vendor_type: newValue === 0 ? "" : formData.vendor_type,
    });
  };

  const validate = () => {
    const errors = {};
    if (!formData.username || formData.username.length < 1) {
      errors.username = "Username is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.password || formData.password.length < 6) {
      errors.password = "Password should be at least 6 characters";
    }
    if (formData.role === "vendor" && !formData.vendor_type) {
      errors.vendor_type = "Vendor category is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const result = await dispatch(signupUser(formData));
      if (signupUser.fulfilled.match(result)) {
        const user = result.payload;
        if (user.is_admin) {
          navigate("/dashboard");
        } else if (user.role === "vendor") {
          navigate(`/dashboard/${user.vendor_type}/bookings`);
        } else {
          navigate("/");
        }
      } else {
        setOpenSnackbar(true);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Stack
      sx={{ width: "100%", maxWidth: "400px", mx: "auto", my: 2, p: 1 }}
      spacing={3}
    >
      <Stack spacing={1}>
        <Typography
          variant="h3"
          color="primary"
          sx={{ textAlign: "center", fontFamily: "Dancing Script, cursive" }}
        >
          SHAADI.COM
        </Typography>
        <Typography variant="h4">Sign up</Typography>
        <Typography color="text.secondary" variant="body2">
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="hover"
            variant="subtitle2"
          >
            Sign in
          </Link>
        </Typography>
      </Stack>

      <form noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="User" />
            <Tab label="Vendor" />
          </Tabs>

          <FormControl error={Boolean(formErrors.username)}>
            <InputLabel>Username</InputLabel>
            <OutlinedInput
              name="username"
              value={formData.username}
              onChange={handleChange}
              label="Username"
            />
            {formErrors.username && (
              <FormHelperText>{formErrors.username}</FormHelperText>
            )}
          </FormControl>

          <FormControl error={Boolean(formErrors.email)}>
            <InputLabel>Email address</InputLabel>
            <OutlinedInput
              name="email"
              value={formData.email}
              onChange={handleChange}
              label="Email address"
              type="email"
            />
            {formErrors.email && (
              <FormHelperText>{formErrors.email}</FormHelperText>
            )}
          </FormControl>

          <FormControl error={Boolean(formErrors.password)}>
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              name="password"
              value={formData.password}
              onChange={handleChange}
              label="Password"
              type="password"
            />
            {formErrors.password && (
              <FormHelperText>{formErrors.password}</FormHelperText>
            )}
          </FormControl>

          {tabValue === 1 && (
            <FormControl error={Boolean(formErrors.vendor_type)}>
              <InputLabel>Vendor Category</InputLabel>
              <Select
                name="vendor_type"
                value={formData.vendor_type}
                onChange={handleChange}
                label="Vendor Category"
              >
                <MenuItem value="venue">Venue</MenuItem>
                <MenuItem value="car_rental">Car Rental</MenuItem>
                <MenuItem value="catering">Catering</MenuItem>
                <MenuItem value="photography">Photography</MenuItem>
              </Select>
              {formErrors.vendor_type && (
                <FormHelperText>{formErrors.vendor_type}</FormHelperText>
              )}
            </FormControl>
          )}

          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            fullWidth
          >
            {loading ? "Creating account..." : "Sign up"}
          </Button>
        </Stack>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          variant="filled"
        >
          {error || "Signup failed"}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
