import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Stack,
  Rating,
  Avatar,
} from "@mui/material";
import { Search, Star, RefreshCcw, MessageSquare } from "lucide-react";
import api from "@/services/api";

export default function VendorReviewsPage() {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user?._id) {
      fetchReviews();
    }
  }, [user?._id]);

  const fetchReviews = async () => {
    if (!user?._id) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.get("/venues/vendor/reviews");
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter reviews based on search term and rating
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      !searchTerm ||
      review.venue_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.venue_review_text
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      review.user_id?.username
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesRating =
      ratingFilter === "all" || review.venue_rating === parseInt(ratingFilter);

    return matchesSearch && matchesRating;
  });

  // Truncate text for table display
  const truncateText = (text, maxLength = 100) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.venue_rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  // Count reviews by rating
  const ratingCounts = {
    5: reviews.filter((r) => r.venue_rating === 5).length,
    4: reviews.filter((r) => r.venue_rating === 4).length,
    3: reviews.filter((r) => r.venue_rating === 3).length,
    2: reviews.filter((r) => r.venue_rating === 2).length,
    1: reviews.filter((r) => r.venue_rating === 1).length,
  };

  if (!user?.role || user.role !== "vendor") {
    return (
      <Box p={4}>
        <Alert severity="error">
          Access denied. This page is only available to vendors.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Typography variant="h4" fontWeight="bold">
              Customer Reviews
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshCcw size={16} />}
              onClick={fetchReviews}
              disabled={loading}
            >
              Refresh
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{ mb: 3 }}
              onClose={() => setSuccess("")}
            >
              {success}
            </Alert>
          )}
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Total Reviews
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {reviews.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Average Rating
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h3" fontWeight="bold">
                  {averageRating}
                </Typography>
                <Star size={32} fill="gold" color="gold" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                5-Star Reviews
              </Typography>
              <Typography variant="h3" fontWeight="bold" color="success.main">
                {ratingCounts[5]}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Rating Breakdown
              </Typography>
              <Stack spacing={0.5}>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Box key={rating} display="flex" alignItems="center" gap={1}>
                    <Typography variant="caption" width={20}>
                      {rating}★
                    </Typography>
                    <Box
                      sx={{
                        flexGrow: 1,
                        height: 8,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 1,
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          width: `${
                            reviews.length > 0
                              ? (ratingCounts[rating] / reviews.length) * 100
                              : 0
                          }%`,
                          height: "100%",
                          backgroundColor: "primary.main",
                        }}
                      />
                    </Box>
                    <Typography variant="caption" width={30}>
                      {ratingCounts[rating]}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Filters */}
        <Grid item xs={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                alignItems="center"
              >
                <TextField
                  placeholder="Search reviews..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search size={18} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flexGrow: 1, minWidth: 250 }}
                />

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Rating</InputLabel>
                  <Select
                    value={ratingFilter}
                    label="Rating"
                    onChange={(e) => setRatingFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Ratings</MenuItem>
                    <MenuItem value="5">5 Stars</MenuItem>
                    <MenuItem value="4">4 Stars</MenuItem>
                    <MenuItem value="3">3 Stars</MenuItem>
                    <MenuItem value="2">2 Stars</MenuItem>
                    <MenuItem value="1">1 Star</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Reviews Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>
                        <strong>Customer</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Venue</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Rating</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Review</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Date</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography>Loading reviews...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : filteredReviews.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography color="text.secondary">
                            {reviews.length === 0
                              ? "No reviews received yet."
                              : "No reviews match your filters."}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredReviews.map((review) => (
                        <TableRow key={review._id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {review.user_id?.username?.[0]?.toUpperCase() ||
                                  "?"}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" fontWeight="bold">
                                  {review.user_id?.username || "Anonymous"}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {review.user_id?.email || "N/A"}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {review.venue_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={0.5}>
                              <Rating
                                value={review.venue_rating}
                                readOnly
                                size="small"
                              />
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                color="primary"
                              >
                                {review.venue_rating}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 400 }}>
                            <Typography variant="body2">
                              {truncateText(review.venue_review_text)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(
                                review.venue_review_created_at
                              ).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(
                                review.venue_review_created_at
                              ).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
