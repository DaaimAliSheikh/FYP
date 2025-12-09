import { Typography, Box, Grid, Card, CardContent } from "@mui/material";
import {
  EventNote,
  Place,
  Restaurant,
  DirectionsCar,
} from "@mui/icons-material";

export default function DashboardHome() {
  const stats = [
    {
      title: "Total Bookings",
      value: "0",
      icon: <EventNote />,
      color: "#1976d2",
    },
    { title: "Venues", value: "0", icon: <Place />, color: "#2e7d32" },
    { title: "Caterings", value: "0", icon: <Restaurant />, color: "#ed6c02" },
    { title: "Cars", value: "0", icon: <DirectionsCar />, color: "#9c27b0" },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: stat.color, color: "white" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography variant="h4">{stat.value}</Typography>
                    <Typography variant="body2">{stat.title}</Typography>
                  </Box>
                  <Box sx={{ fontSize: 48 }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
