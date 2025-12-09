import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import {
  fetchPromos,
  createPromo,
  deletePromo,
} from "@/store/slices/promoSlice";

export default function DashboardPromos() {
  const dispatch = useDispatch();
  const { items: promos, loading } = useSelector((state) => state.promos);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    promo_name: "",
    promo_expiry: "",
    promo_discount: "",
  });

  useEffect(() => {
    dispatch(fetchPromos());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(
      createPromo({
        promo_name: formData.promo_name,
        promo_expiry: new Date(formData.promo_expiry).toISOString(),
        promo_discount: parseFloat(formData.promo_discount),
      })
    );
    setOpen(false);
    setFormData({ promo_name: "", promo_expiry: "", promo_discount: "" });
    dispatch(fetchPromos());
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this promo?")) {
      await dispatch(deletePromo(id));
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Manage Promos</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Promo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Promo Name</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No promos found
                </TableCell>
              </TableRow>
            ) : (
              promos.map((promo) => (
                <TableRow key={promo.promo_id}>
                  <TableCell>{promo.promo_name}</TableCell>
                  <TableCell>
                    {(promo.promo_discount * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell>
                    {new Date(promo.promo_expiry).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(promo.promo_id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add New Promo</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Promo Name"
              value={formData.promo_name}
              onChange={(e) =>
                setFormData({ ...formData, promo_name: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              type="number"
              label="Discount (0.01 to 0.99)"
              value={formData.promo_discount}
              onChange={(e) =>
                setFormData({ ...formData, promo_discount: e.target.value })
              }
              margin="normal"
              inputProps={{ min: 0.01, max: 0.99, step: 0.01 }}
              required
            />
            <TextField
              fullWidth
              type="date"
              label="Expiry Date"
              value={formData.promo_expiry}
              onChange={(e) =>
                setFormData({ ...formData, promo_expiry: e.target.value })
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
