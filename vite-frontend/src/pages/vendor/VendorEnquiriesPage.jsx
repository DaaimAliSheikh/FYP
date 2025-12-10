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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Alert,
  Stack,
} from "@mui/material";
import {
  Search,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Circle,
  Eye,
  Filter,
  RefreshCcw,
} from "lucide-react";
import api from "@/services/api";

export default function VendorEnquiriesPage() {
  const { user } = useSelector((state) => state.auth);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Get vendor type and find vendor ID from user
  const vendorType = user?.vendor_type;

  useEffect(() => {
    if (vendorType) {
      fetchEnquiries();
    }
  }, [vendorType]);

  const fetchEnquiries = async () => {
    if (!vendorType) return;

    setLoading(true);
    setError("");

    try {
      // For this example, we'll fetch all venues for this user to get the vendor ID
      // In a real scenario, you might store the vendor ID in the user profile
      let vendorId = null;

      switch (vendorType) {
        case "venue":
          const venuesResponse = await api.get("/venues");
          const userVenues =
            venuesResponse.data.venues?.filter((v) => v.user_id === user._id) ||
            [];
          if (userVenues.length > 0) vendorId = userVenues[0]._id;
          break;
        case "catering":
          const cateringsResponse = await api.get("/caterings");
          const userCaterings =
            cateringsResponse.data.caterings?.filter(
              (c) => c.user_id === user._id
            ) || [];
          if (userCaterings.length > 0) vendorId = userCaterings[0]._id;
          break;
        case "car_rental":
          const carsResponse = await api.get("/cars");
          const userCars =
            carsResponse.data.cars?.filter((c) => c.user_id === user._id) || [];
          if (userCars.length > 0) vendorId = userCars[0]._id;
          break;
        case "photography":
          const photosResponse = await api.get("/photography");
          const userPhotos =
            photosResponse.data.photography?.filter(
              (p) => p.user_id === user._id
            ) || [];
          if (userPhotos.length > 0) vendorId = userPhotos[0]._id;
          break;
      }

      if (!vendorId) {
        setError(
          "No vendor profile found. Please create your business profile first."
        );
        setLoading(false);
        return;
      }

      // Fetch enquiries for this vendor
      const response = await api.get(`/enquiries/${vendorType}/${vendorId}`);
      setEnquiries(response.data.enquiries || []);
    } catch (error) {
      console.error("Error fetching enquiries:", error);
      setError("Failed to load enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsClosed = async (enquiryId) => {
    try {
      await api.patch(`/enquiries/${enquiryId}/close`);
      setSuccess("Enquiry marked as closed successfully!");

      // Update local state
      setEnquiries((prev) =>
        prev.map((enq) =>
          enq._id === enquiryId
            ? {
                ...enq,
                enquiry_status: "closed",
                enquiry_closed_at: new Date(),
              }
            : enq
        )
      );

      setDialogOpen(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error closing enquiry:", error);
      setError("Failed to close enquiry. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleMarkAsOpen = async (enquiryId) => {
    try {
      await api.patch(`/enquiries/${enquiryId}/open`);
      setSuccess("Enquiry reopened successfully!");

      // Update local state
      setEnquiries((prev) =>
        prev.map((enq) =>
          enq._id === enquiryId
            ? { ...enq, enquiry_status: "open", enquiry_closed_at: null }
            : enq
        )
      );

      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Error opening enquiry:", error);
      setError("Failed to reopen enquiry. Please try again.");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedEnquiry(null);
  };

  // Filter enquiries based on search term and status
  const filteredEnquiries = enquiries.filter((enquiry) => {
    const matchesSearch =
      !searchTerm ||
      enquiry.enquiry_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.enquiry_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enquiry.enquiry_phone.includes(searchTerm) ||
      enquiry.enquiry_message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || enquiry.enquiry_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Truncate text for table display
  const truncateText = (text, maxLength = 50) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const getStatusColor = (status) => {
    return status === "open" ? "success" : "default";
  };

  const getStatusIcon = (status) => {
    return status === "open" ? <Circle size={16} /> : <CheckCircle size={16} />;
  };

  if (!vendorType) {
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
              Customer Enquiries
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshCcw size={16} />}
              onClick={fetchEnquiries}
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
                  placeholder="Search enquiries..."
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
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="open">Open</MenuItem>
                    <MenuItem value="closed">Closed</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Enquiries Table */}
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>
                        <strong>Enquiry ID</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Customer</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Contact</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Message</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Date</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Actions</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography>Loading enquiries...</Typography>
                        </TableCell>
                      </TableRow>
                    ) : filteredEnquiries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography color="text.secondary">
                            {enquiries.length === 0
                              ? "No enquiries received yet."
                              : "No enquiries match your filters."}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEnquiries.map((enquiry) => (
                        <TableRow key={enquiry._id} hover>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              #{enquiry._id.slice(-8).toUpperCase()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="bold">
                              {enquiry.enquiry_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Box display="flex" alignItems="center" mb={0.5}>
                                <Mail size={14} style={{ marginRight: 4 }} />
                                <Typography variant="caption">
                                  {truncateText(enquiry.enquiry_email, 20)}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center">
                                <Phone size={14} style={{ marginRight: 4 }} />
                                <Typography variant="caption">
                                  {enquiry.enquiry_phone}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Tooltip title="Click to view full message">
                              <Typography
                                variant="body2"
                                sx={{ cursor: "pointer" }}
                                onClick={() => handleViewDetails(enquiry)}
                              >
                                {truncateText(enquiry.enquiry_message)}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(
                                enquiry.enquiry_created_at
                              ).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(
                                enquiry.enquiry_created_at
                              ).toLocaleTimeString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getStatusIcon(enquiry.enquiry_status)}
                              label={enquiry.enquiry_status.toUpperCase()}
                              color={getStatusColor(enquiry.enquiry_status)}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => handleViewDetails(enquiry)}
                                >
                                  <Eye size={16} />
                                </IconButton>
                              </Tooltip>
                              {enquiry.enquiry_status === "open" ? (
                                <Tooltip title="Mark as Closed">
                                  <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() =>
                                      handleMarkAsClosed(enquiry._id)
                                    }
                                  >
                                    <CheckCircle size={16} />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Tooltip title="Mark as Open">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() =>
                                      handleMarkAsOpen(enquiry._id)
                                    }
                                  >
                                    <Circle size={16} />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
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

      {/* Enquiry Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" fontWeight="bold">
              Enquiry Details
            </Typography>
            {selectedEnquiry && (
              <Chip
                icon={getStatusIcon(selectedEnquiry.enquiry_status)}
                label={selectedEnquiry.enquiry_status.toUpperCase()}
                color={getStatusColor(selectedEnquiry.enquiry_status)}
                variant="outlined"
              />
            )}
          </Box>
        </DialogTitle>

        <DialogContent>
          {selectedEnquiry && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    ENQUIRY ID
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" mb={2}>
                    #{selectedEnquiry._id.slice(-8).toUpperCase()}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    CUSTOMER NAME
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    {selectedEnquiry.enquiry_name}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    EMAIL ADDRESS
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    {selectedEnquiry.enquiry_email}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    PHONE NUMBER
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    {selectedEnquiry.enquiry_phone}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    ENQUIRY DATE
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    {new Date(
                      selectedEnquiry.enquiry_created_at
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>

                  {selectedEnquiry.enquiry_closed_at && (
                    <>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        CLOSED DATE
                      </Typography>
                      <Typography variant="body1" mb={2}>
                        {new Date(
                          selectedEnquiry.enquiry_closed_at
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    CUSTOMER MESSAGE
                  </Typography>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      backgroundColor: "#f9f9f9",
                      borderRadius: 2,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Typography
                      variant="body1"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {selectedEnquiry.enquiry_message}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          {selectedEnquiry && selectedEnquiry.enquiry_status === "open" ? (
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircle size={16} />}
              onClick={() => handleMarkAsClosed(selectedEnquiry._id)}
            >
              Mark as Closed
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Circle size={16} />}
              onClick={() => handleMarkAsOpen(selectedEnquiry._id)}
            >
              Reopen Enquiry
            </Button>
          )}
          <Button onClick={handleCloseDialog} variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
