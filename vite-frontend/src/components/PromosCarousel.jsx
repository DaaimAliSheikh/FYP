import { Box, Typography, Card, CardContent, Chip } from "@mui/material";

export default function PromosCarousel({ promos }) {
  if (!promos || promos.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Active Promotions
      </Typography>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
        {promos.map((promo) => (
          <Card
            key={promo.promo_id}
            sx={{
              minWidth: 300,
              flex: "0 0 auto",
              bgcolor: "primary.light",
              color: "white",
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {promo.promo_name}
              </Typography>
              <Chip
                label={`${(promo.promo_discount * 100).toFixed(0)}% OFF`}
                color="secondary"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2">
                Valid until: {new Date(promo.promo_expiry).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
