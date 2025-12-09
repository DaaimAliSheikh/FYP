import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";

export default function CateringCarousel({ caterings }) {
  if (!caterings || caterings.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Catering Services
      </Typography>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
        {caterings.map((catering) => (
          <Card
            key={catering.catering_id}
            sx={{ minWidth: 300, flex: "0 0 auto" }}
          >
            {catering.catering_image && (
              <CardMedia
                component="img"
                height="200"
                image={catering.catering_image}
                alt={catering.catering_name}
              />
            )}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {catering.catering_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {catering.catering_description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
