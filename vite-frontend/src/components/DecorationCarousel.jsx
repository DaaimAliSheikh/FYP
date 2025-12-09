import { Box, Typography, Card, CardContent, CardMedia } from "@mui/material";

export default function DecorationCarousel({ decorations }) {
  if (!decorations || decorations.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" gutterBottom>
        Decoration Options
      </Typography>
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2 }}>
        {decorations.map((decoration) => (
          <Card
            key={decoration.decoration_id}
            sx={{ minWidth: 300, flex: "0 0 auto" }}
          >
            {decoration.decoration_image && (
              <CardMedia
                component="img"
                height="200"
                image={decoration.decoration_image}
                alt={decoration.decoration_name}
              />
            )}
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {decoration.decoration_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {decoration.decoration_description}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                ${decoration.decoration_price}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
