import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Rating,
  Button,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ImageList,
  ImageListItem,
} from "@mui/material";
import {
  ChevronDown,
  MapPin,
  Users,
  Calendar,
  Clock,
  Phone,
  Mail,
  Star,
  Wifi,
  Car,
  Music,
  Camera,
  Utensils,
  AirVent,
  ShowerHead,
  ArrowLeft,
  Send,
} from "lucide-react";
import api from "@/services/api";

// Mock data for detailed venue information
const createVenueMockData = (venueId) => ({
  id: venueId,
  name: "Royal Gardens Wedding Venue",
  bio: "With over 15 years of experience in creating magical wedding moments, Royal Gardens has been the premier choice for couples seeking an enchanting venue. Our passionate team specializes in transforming dreams into reality with personalized service and attention to every detail.",
  description:
    "Nestled in the heart of the city, Royal Gardens offers a perfect blend of elegance and natural beauty. Our venue features stunning architecture, manicured gardens, and world-class amenities that create the ideal backdrop for your special day. From intimate gatherings to grand celebrations, we provide flexible spaces that can be customized to match your vision.",
  profileImage:
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&h=400&fit=crop&crop=face",
  gallery: [
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=600",
    "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600",
    "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&h=600",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600",
    "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600",
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600",
  ],
  contact: {
    phone: "+92 300 1234567",
    email: "info@royalgardens.com",
    address: "123 Garden Avenue, DHA Phase 5, Karachi",
  },
  capacity: {
    indoor: 300,
    outdoor: 500,
    total: 800,
  },
  pricing: {
    basePrice: 150000,
    weekendSurcharge: 25000,
    decorationPackage: 50000,
    cateringPerHead: 2500,
  },
  amenities: [
    {
      icon: Wifi,
      label: "High-Speed WiFi",
      description: "Complimentary throughout the venue",
    },
    {
      icon: Car,
      label: "Valet Parking",
      description: "200+ car parking spaces",
    },
    {
      icon: Music,
      label: "Sound System",
      description: "Professional audio equipment",
    },
    {
      icon: Camera,
      label: "Photography Area",
      description: "Dedicated photo zones",
    },
    {
      icon: Utensils,
      label: "Catering Kitchen",
      description: "Full commercial kitchen",
    },
    {
      icon: AirVent,
      label: "Climate Control",
      description: "Central air conditioning",
    },
    {
      icon: ShowerHead,
      label: "Bridal Suite",
      description: "Luxury preparation rooms",
    },
  ],
  packages: [
    {
      name: "Premium Package",
      price: 250000,
      features: [
        "Full venue access",
        "Decoration setup",
        "Sound system",
        "Valet parking",
        "Bridal suite",
      ],
    },
    {
      name: "Standard Package",
      price: 180000,
      features: ["Venue access", "Basic decoration", "Sound system", "Parking"],
    },
    {
      name: "Basic Package",
      price: 120000,
      features: ["Venue access", "Basic amenities"],
    },
  ],
  operatingHours: {
    weekdays: "9:00 AM - 11:00 PM",
    weekends: "8:00 AM - 12:00 AM",
  },
  specialFeatures: [
    "Panoramic city skyline views",
    "Indoor/outdoor ceremony options",
    "Professional event coordination",
    "On-site catering services",
    "Customizable lighting systems",
    "Wheelchair accessible",
    "Security personnel",
    "Guest accommodation arrangements",
  ],
});

export default function VenueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [mockData, setMockData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    enquiry_name: "",
    enquiry_email: "",
    enquiry_phone: "",
    enquiry_message: "",
  });
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  useEffect(() => {
    const fetchVenueDetails = async () => {
      try {
        // Fetch basic venue data from API
        const response = await api.get(`/venues/${id}`);
        setVenue(response.data);

        // Calculate average rating
        const venueReviews = response.data.venue_reviews || [];
        setReviews(venueReviews);
        if (venueReviews.length > 0) {
          const avgRating =
            venueReviews.reduce((sum, review) => sum + review.venue_rating, 0) /
            venueReviews.length;
          setAverageRating(avgRating);
        }

        // Set mock data for detailed information
        setMockData(createVenueMockData(id));
      } catch (error) {
        console.error("Error fetching venue details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVenueDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      await api.post(`/venues/reviews/${id}`, {
        venue_rating: reviewRating,
        venue_review_text: reviewComment,
      });

      // Refresh venue data to get updated reviews
      const response = await api.get(`/venues/${id}`);
      setVenue(response.data);
      setReviews(response.data.venue_reviews || []);

      // Recalculate average rating
      const venueReviews = response.data.venue_reviews || [];
      if (venueReviews.length > 0) {
        const avgRating =
          venueReviews.reduce((sum, review) => sum + review.venue_rating, 0) /
          venueReviews.length;
        setAverageRating(avgRating);
      }

      // Reset form
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert(error.response?.data?.detail || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (
      !enquiryForm.enquiry_name ||
      !enquiryForm.enquiry_email ||
      !enquiryForm.enquiry_phone ||
      !enquiryForm.enquiry_message
    ) {
      alert("Please fill in all fields");
      return;
    }

    setSubmittingEnquiry(true);
    try {
      await api.post("/enquiries", {
        ...enquiryForm,
        vendor_type: "venue",
        vendor_id: id,
      });

      // Reset form
      setEnquiryForm({
        enquiry_name: "",
        enquiry_email: "",
        enquiry_phone: "",
        enquiry_message: "",
      });

      setEnquirySuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setEnquirySuccess(false), 5000);
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
      alert(error.response?.data?.detail || "Failed to submit enquiry");
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  const handleEnquiryChange = (field) => (e) => {
    setEnquiryForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading venue details...</Typography>
      </Container>
    );
  }

  if (!venue || !mockData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Venue not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowLeft />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
        variant="outlined"
      >
        Back to Venues
      </Button>

      {/* Hero Section with Gallery */}
      <Paper elevation={3} sx={{ mb: 4, overflow: "hidden", borderRadius: 3 }}>
        <ImageList
          variant="quilted"
          cols={4}
          rowHeight={200}
          sx={{ margin: 0 }}
        >
          {mockData.gallery.slice(0, 8).map((image, index) => (
            <ImageListItem
              key={index}
              cols={index === 0 ? 2 : 1}
              rows={index === 0 ? 2 : 1}
            >
              <img
                src={image}
                alt={`${venue.venue_name} ${index + 1}`}
                loading="lazy"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Venue Header */}
          <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Box display="flex" alignItems="center" mb={3}>
                <Avatar
                  src={mockData.profileImage}
                  alt={venue.venue_name}
                  sx={{ width: 80, height: 80, mr: 3 }}
                />
                <Box flex={1}>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {venue.venue_name}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Rating value={averageRating} precision={0.5} readOnly />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ ml: 1 }}
                    >
                      ({reviews.length} reviews)
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {mockData.bio}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Description */}
          <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                About This Venue
              </Typography>
              <Typography variant="body1" lineHeight={1.8} paragraph>
                {mockData.description}
              </Typography>
            </CardContent>
          </Card>

          {/* Special Features */}
          <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Special Features
              </Typography>
              <Grid container spacing={2}>
                {mockData.specialFeatures.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Chip
                      icon={<Star size={16} />}
                      label={feature}
                      variant="outlined"
                      sx={{ width: "100%", justifyContent: "flex-start" }}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Amenities & Services
              </Typography>
              <Grid container spacing={3}>
                {mockData.amenities.map((amenity, index) => {
                  const IconComponent = amenity.icon;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <IconComponent size={20} style={{ marginRight: 8 }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          {amenity.label}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {amenity.description}
                      </Typography>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Reviews & Ratings
              </Typography>

              {/* Add Review Form */}
              <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Share Your Experience
                </Typography>
                <form onSubmit={handleReviewSubmit}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <Typography variant="body1" sx={{ mr: 2 }}>
                      Your Rating:
                    </Typography>
                    <Rating
                      value={reviewRating}
                      onChange={(_, newValue) => setReviewRating(newValue || 1)}
                      size="large"
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Write your review"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    sx={{ mb: 3 }}
                    placeholder="Tell others about your experience with this venue..."
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submittingReview || !reviewComment.trim()}
                    sx={{ px: 4 }}
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </Paper>

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <Stack spacing={3}>
                  {reviews.map((review, index) => (
                    <Paper
                      key={review._id || index}
                      elevation={1}
                      sx={{ p: 3, borderRadius: 2 }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {review.user_id?.username || "Anonymous"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(
                              review.venue_review_created_at
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </Typography>
                        </Box>
                        <Rating
                          value={review.venue_rating}
                          readOnly
                          size="small"
                        />
                      </Box>
                      <Typography variant="body1">
                        {review.venue_review_text}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No reviews yet. Be the first to share your experience!
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Booking Info */}
          <Card elevation={2} sx={{ mb: 3, borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Venue Details
              </Typography>

              <List dense>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <MapPin size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Location"
                    secondary={venue.venue_address || mockData.contact.address}
                  />
                </ListItem>

                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Users size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Capacity"
                    secondary={`Up to ${
                      venue.venue_capacity || mockData.capacity.total
                    } guests`}
                  />
                </ListItem>

                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Clock size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary="Operating Hours"
                    secondary={mockData.operatingHours.weekdays}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 3 }} />

              <Typography
                variant="h6"
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                Starting from PKR{" "}
                {venue.venue_price_per_day?.toLocaleString() ||
                  mockData.pricing.basePrice.toLocaleString()}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={3}
              >
                *Prices may vary based on date and package
              </Typography>

              <Button variant="contained" fullWidth size="large" sx={{ mb: 2 }}>
                Book Now
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Phone size={16} />}
              >
                Contact Venue
              </Button>
            </CardContent>
          </Card>

          {/* Package Options */}
          <Card elevation={2} sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Package Options
              </Typography>

              <Stack spacing={2}>
                {mockData.packages.map((pkg, index) => (
                  <Paper
                    key={index}
                    elevation={1}
                    sx={{ p: 2, borderRadius: 2 }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mb={1}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {pkg.name}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="primary"
                        fontWeight="bold"
                      >
                        PKR {pkg.price.toLocaleString()}
                      </Typography>
                    </Box>
                    <List dense>
                      {pkg.features.map((feature, fIndex) => (
                        <ListItem key={fIndex} disablePadding>
                          <Typography variant="caption" color="text.secondary">
                            • {feature}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>

          {/* Enquiry Form */}
          <Card elevation={2} sx={{ borderRadius: 3, mt: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Send Enquiry
              </Typography>

              {enquirySuccess && (
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    mb: 3,
                    backgroundColor: "#e8f5e8",
                    borderLeft: "4px solid #4caf50",
                    borderRadius: 2,
                  }}
                >
                  <Typography color="success.main" fontWeight="bold">
                    ✓ Enquiry sent successfully!
                  </Typography>
                  <Typography variant="body2" color="success.dark">
                    The venue will receive your enquiry and contact you soon.
                  </Typography>
                </Paper>
              )}

              <form onSubmit={handleEnquirySubmit}>
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  value={enquiryForm.enquiry_name}
                  onChange={handleEnquiryChange("enquiry_name")}
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={enquiryForm.enquiry_email}
                  onChange={handleEnquiryChange("enquiry_email")}
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  value={enquiryForm.enquiry_phone}
                  onChange={handleEnquiryChange("enquiry_phone")}
                  sx={{ mb: 2 }}
                  required
                />

                <TextField
                  fullWidth
                  label="Your Message"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={enquiryForm.enquiry_message}
                  onChange={handleEnquiryChange("enquiry_message")}
                  sx={{ mb: 3 }}
                  placeholder="Please let us know your event date, guest count, and any specific requirements..."
                  required
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  startIcon={<Send size={16} />}
                  disabled={submittingEnquiry}
                  sx={{ py: 1.5 }}
                >
                  {submittingEnquiry ? "Sending..." : "Send Enquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
