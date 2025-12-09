import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Rating,
} from "@mui/material";

export default function VenueCarousel({ venues }) {
  if (!venues || venues.length === 0) return null;

  const calculateAverageRating = (venue) => {
    if (!venue.venue_reviews || venue.venue_reviews.length === 0) return 0;
    const sum = venue.venue_reviews.reduce(
      (acc, review) => acc + review.venue_rating,
      0
    );
    return sum / venue.venue_reviews.length;
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Available Venues
      </Typography>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
        {venues.map((venue) => (
          <Card key={venue.venue_id} sx={{ minWidth: 300, flex: "0 0 auto" }}>
            {venue.venue_image && (
              <CardMedia
                component="img"
                height="200"
                image={venue.venue_image}
                alt={venue.venue_name}
              />
            )}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {venue.venue_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {venue.venue_address}
              </Typography>
              <Typography variant="body2">
                Capacity: {venue.venue_capacity} | ${venue.venue_price_per_day}
                /day
              </Typography>
              <Rating
                value={calculateAverageRating(venue)}
                readOnly
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
