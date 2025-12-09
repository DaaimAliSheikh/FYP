import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import { CheckCircle, XCircle } from "lucide-react";
import api from "@/services/api";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const hasVerified = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    // Prevent double verification in React StrictMode
    if (hasVerified.current) return;
    hasVerified.current = true;

    verifyEmail(token);
  }, [searchParams]);

  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      navigate("/login");
    }
  }, [status, countdown, navigate]);

  const verifyEmail = async (token) => {
    try {
      const response = await api.get(`/users/verify-email?token=${token}`);
      setStatus("success");
      setMessage(response.data.detail);
    } catch (error) {
      setStatus("error");
      setMessage(
        error.response?.data?.detail ||
          "Failed to verify email. The link may have expired."
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 500,
          width: "100%",
          textAlign: "center",
        }}
      >
        {status === "loading" && (
          <>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h5">Verifying your email...</Typography>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle
              size={80}
              color="#4caf50"
              style={{ marginBottom: 16 }}
            />
            <Typography variant="h4" gutterBottom>
              Email Verified!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Redirecting to login in {countdown} second
              {countdown !== 1 ? "s" : ""}...
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
            >
              Go to Login Now
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle size={80} color="#f44336" style={{ marginBottom: 16 }} />
            <Typography variant="h4" gutterBottom>
              Verification Failed
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {message}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button variant="outlined" onClick={() => navigate("/signup")}>
                Back to Signup
              </Button>
              <Button variant="contained" onClick={() => navigate("/login")}>
                Go to Login
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
