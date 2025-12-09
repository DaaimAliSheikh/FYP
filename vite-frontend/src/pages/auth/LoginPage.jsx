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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { loginUser } from "@/store/slices/authSlice";
import api from "@/services/api";

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
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [showResendDialog, setShowResendDialog] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

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
        // Check if it's an email verification error
        const errorData = result.payload || result.error;
        if (errorData?.code === "EMAIL_NOT_VERIFIED") {
          setSnackbarMessage(
            errorData.detail || "Please verify your email before logging in."
          );
          setSnackbarSeverity("warning");
          setResendEmail(formData.email);
          setShowResendDialog(true);
        } else {
          setSnackbarMessage(
            error || errorData?.detail || "Invalid credentials"
          );
          setSnackbarSeverity("error");
        }
        setOpenSnackbar(true);
      }
    }
  };

  const handleResendVerification = async () => {
    setResendLoading(true);
    try {
      const response = await api.post("/users/resend-verification", {
        email: resendEmail,
      });
      setSnackbarMessage(response.data.detail);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setShowResendDialog(false);
    } catch (error) {
      setSnackbarMessage(
        error.response?.data?.detail || "Failed to resend verification email"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setResendLoading(false);
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

          <Link
            component={RouterLink}
            to="/forgot-password"
            underline="hover"
            variant="body2"
            sx={{ textAlign: "center", display: "block" }}
          >
            Forgot password?
          </Link>
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
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage || error || "Invalid credentials"}
        </Alert>
      </Snackbar>

      <Dialog
        open={showResendDialog}
        onClose={() => setShowResendDialog(false)}
      >
        <DialogTitle>Email Not Verified</DialogTitle>
        <DialogContent>
          <Typography>
            Your email address has not been verified yet. Would you like us to
            resend the verification email to <strong>{resendEmail}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResendDialog(false)}>Cancel</Button>
          <Button
            onClick={handleResendVerification}
            variant="contained"
            disabled={resendLoading}
          >
            {resendLoading ? "Sending..." : "Resend Verification Email"}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
