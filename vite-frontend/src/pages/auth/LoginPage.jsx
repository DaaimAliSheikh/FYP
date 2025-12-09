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
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/store/slices/authSlice";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "daaim@shaadi.com",
    password: "abc_123",
  });
  const [formErrors, setFormErrors] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const validate = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const result = await dispatch(loginUser(formData));
      if (loginUser.fulfilled.match(result)) {
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
      spacing={4}
    >
      <Typography
        variant="h3"
        color="primary"
        sx={{ textAlign: "center", fontFamily: "Dancing Script, cursive" }}
      >
        SHAADI.COM
      </Typography>

      <Stack spacing={1}>
        <Typography variant="h4">Sign in</Typography>
        <Typography color="text.secondary" variant="body2">
          Don&apos;t have an account?{" "}
          <Link
            component={RouterLink}
            to="/signup"
            underline="hover"
            variant="subtitle2"
          >
            Sign up
          </Link>
        </Typography>
      </Stack>

      <form noValidate onSubmit={handleSubmit}>
        <Stack spacing={2}>
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
              type={showPassword ? "text" : "password"}
              endAdornment={
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </IconButton>
              }
            />
            {formErrors.password && (
              <FormHelperText>{formErrors.password}</FormHelperText>
            )}
          </FormControl>

          <Button
            disabled={loading}
            type="submit"
            variant="contained"
            fullWidth
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </Stack>
      </form>

      <Alert severity="warning">
        Use <strong>daaim@shaadi.com</strong> with password{" "}
        <strong>abc_123</strong> to log in as admin user
      </Alert>

      <Alert severity="success">
        Use <strong>daaimalisheikh23@gmail.com</strong> with password{" "}
        <strong>abc_123</strong> to log in as normal user
      </Alert>

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
          {error || "Invalid credentials"}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
