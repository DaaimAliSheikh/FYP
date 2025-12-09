import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  Rating,
  Stack,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import api from "@/services/api";
import { fetchVenues } from "@/store/slices/venueSlice";

export default function VenueCard({ venue, averageRating }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [comment, setComment] = useState("");

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!comment) return;

    try {
      await api.post("/venues/reviews/" + venue.venue_id, {
        venue_rating: value,
        venue_review_text: comment,
      });
      dispatch(fetchVenues());
      setComment("");
      setValue(1);
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  return (
    <>
      <Card
        sx={{
          flex: "0 0 30%",
          minWidth: 300,
          padding: 2,
          border: "1px solid #ccc",
          cursor: "pointer",
          ":hover": {
            boxShadow: 10,
            bgcolor: "#f5f5f5",
          },
        }}
        onClick={() => setOpen(true)}
      >
        <CardHeader title={venue.venue_name} />
        {venue.venue_image && (
          <CardMedia
            component="img"
            alt={venue.venue_name}
            height="140"
            image={`${venue.venue_image}`}
          />
        )}
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            Location: {venue.venue_address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Capacity: {venue.venue_capacity}
          </Typography>
          <Typography variant="body2" color="primary">
            ${venue.venue_price_per_day}/day
          </Typography>
          <Box mt={2}>
            {averageRating > 0 ? (
              <Rating value={averageRating} readOnly />
            ) : (
              <Typography variant="caption">No ratings yet</Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        sx={(theme) => ({
          color: "#fff",
          zIndex: theme.zIndex.drawer + 1,
        })}
      >
        <Card
          sx={{
            padding: 2,
            border: "1px solid #ccc",
          }}
        >
          <CardHeader color="primary.main" title={venue.venue_name} />
          {venue.venue_image && (
            <CardMedia
              component="img"
              alt={venue.venue_name}
              height="200"
              image={`${venue.venue_image}`}
            />
          )}
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              Location: {venue.venue_address}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Capacity: {venue.venue_capacity}
            </Typography>
            <Typography variant="body2" color="primary">
              ${venue.venue_price_per_day}/day
            </Typography>
          </CardContent>

          <Typography variant="h5" sx={{ mt: 3, px: 2 }} gutterBottom>
            Add Review
          </Typography>
          <form onSubmit={handleSubmit} style={{ padding: "0 16px" }}>
            <TextField
              fullWidth
              label="Your Comment"
              multiline
              rows={4}
              variant="outlined"
              value={comment}
              onChange={handleCommentChange}
              sx={{ mb: 3 }}
            />

            <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mr: 2 }}>
                Your Rating:
              </Typography>
              <Rating
                value={value}
                onChange={(_, newValue) => setValue(newValue || 1)}
                size="large"
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                padding: "10px 0",
                fontSize: "16px",
                fontWeight: "bold",
                borderRadius: "5px",
              }}
            >
              Submit
            </Button>
          </form>

          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary
              expandIcon={<ChevronDown />}
              aria-controls="panel1-content"
            >
              <Typography>
                Reviews ({venue.venue_reviews?.length || 0})
              </Typography>
            </AccordionSummary>
            {venue.venue_reviews?.map((review) => (
              <AccordionDetails key={review.venue_review_id}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {review.user?.username || "Anonymous"}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(
                        review.venue_review_created_at
                      ).toLocaleString()}
                    </Typography>
                  </Box>
                  <Rating value={review.venue_rating} readOnly size="small" />
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {review.venue_review_text}
                </Typography>
              </AccordionDetails>
            ))}
          </Accordion>
        </Card>
      </Dialog>
    </>
  );
}
