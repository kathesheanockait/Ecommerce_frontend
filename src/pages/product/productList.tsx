"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Search from "@mui/icons-material/Search";
import GridView from "@mui/icons-material/GridView";
import ViewList from "@mui/icons-material/ViewList";
import Add from "@mui/icons-material/Add";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Role } from "../../types/role.type";
import { ProductCard, type Product } from "./productCard";
import { ProductForm } from "./productForm";
import { deleteProductThunk, fetchProducts, filterProductThunk, } from "../../redux/slices/productSlice";

const FILTER_SESSION_KEY = "productFilters";

interface FilterState {
  name: string;
  minStock: number;
  maxStock: number;
  sortBy: string;
  createdAt: string;
}

const defaultFilters: FilterState = {
  name: "",
  minStock: 0,
  maxStock: 1000,
  sortBy: "newest",
  createdAt: "",
};

function getInitialFilters(): FilterState {
  if (typeof window === "undefined") return defaultFilters;
  
  const savedFilters = sessionStorage.getItem(FILTER_SESSION_KEY);
  if (savedFilters) {
    try {
      return JSON.parse(savedFilters);
    } catch (error) {
      console.error("Failed to parse saved filters:", error);
      return defaultFilters;
    }
  }
  return defaultFilters;
}

export function ProductList() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { product:products,loading} = useAppSelector((state) => state.product);
  const role = useAppSelector((state) => state.auth.role);
  const dispatch =useAppDispatch();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<FilterState>(getInitialFilters);
  const [isInitialized, setIsInitialized] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    sessionStorage.setItem(FILTER_SESSION_KEY, JSON.stringify(filters));

    const delayDebounce = setTimeout(() => {
      const queryParams: any = {};
      
      if (filters.name.trim()) {
        queryParams.name = filters.name;
      }
      
      if (filters.minStock !== 0) {
        queryParams.minStock = filters.minStock;
      }
      
      if (filters.maxStock !== 1000) {
        queryParams.maxStock = filters.maxStock;
      }
      
      if (filters.createdAt) {
        queryParams.createdAt = new Date(filters.createdAt);
      }

      if (Object.keys(queryParams).length === 0) {
        dispatch(fetchProducts());
      } else {
        queryParams.isAvailable = true;
        dispatch(filterProductThunk(queryParams));
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [filters, isInitialized, dispatch]);

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, name: value }));
  };

  const handleMinStockChange = (value: number) => {
    setFilters((prev) => ({ ...prev, minStock: value }));
  };

  const handleMaxStockChange = (value: number) => {
    setFilters((prev) => ({ ...prev, maxStock: value }));
  };

  const handleSortByChange = (value: string) => {
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleDateChange = (value: string) => {
    setFilters((prev) => ({ ...prev, createdAt: value }));
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    sessionStorage.removeItem(FILTER_SESSION_KEY);
  };

  const handleAddProduct = () => {
    setFormMode("create");
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setFormMode("edit");
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      console.log(productToDelete);
      
        dispatch(deleteProductThunk(productToDelete))
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0f", py: 4 }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            mb: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h3"
            sx={{ color: "#ffffff", fontWeight: 700, mb: 1 }}
          >
            Products
          </Typography>
          {role === Role.ADMIN && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddProduct}
              sx={{
                bgcolor: "#00bfa5",
                color: "#0a0a0f",
                textTransform: "none",
                fontWeight: 600,
                px: 3,
                py: 1,
                "&:hover": { bgcolor: "#00a392" },
              }}
            >
              Add Product
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 4,
            alignItems: "center",
          }}
        >
          {/* Search Filter - Name Only */}
          <TextField
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: "#8b8b9e" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              minWidth: 280,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#12121a",
                color: "#ffffff",
                borderRadius: 2,
                "& fieldset": { borderColor: "#2a2a3e" },
                "&:hover fieldset": { borderColor: "#00bfa5" },
                "&.Mui-focused fieldset": { borderColor: "#00bfa5" },
              },
            }}
          />

          {/* Stock Range Filter */}
          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: "#8b8b9e" }}>Min Stock</InputLabel>
            <Select
              value={filters.minStock}
              label="Min Stock"
              onChange={(e) => handleMinStockChange(Number(e.target.value))}
              sx={{
                bgcolor: "#12121a",
                color: "#ffffff",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a2a3e" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00bfa5" },
                "& .MuiSvgIcon-root": { color: "#8b8b9e" },
              }}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 140 }}>
            <InputLabel sx={{ color: "#8b8b9e" }}>Max Stock</InputLabel>
            <Select
              value={filters.maxStock}
              label="Max Stock"
              onChange={(e) => handleMaxStockChange(Number(e.target.value))}
              sx={{
                bgcolor: "#12121a",
                color: "#ffffff",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a2a3e" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00bfa5" },
                "& .MuiSvgIcon-root": { color: "#8b8b9e" },
              }}
            >
              <MenuItem value={100}>100</MenuItem>
              <MenuItem value={500}>500</MenuItem>
              <MenuItem value={1000}>1000</MenuItem>
              <MenuItem value={5000}>5000</MenuItem>
              <MenuItem value={10000}>10000</MenuItem>
            </Select>
          </FormControl>

          {/* Date Filter */}
          <TextField
            type="date"
            label="Filter by Date"
            value={filters.createdAt}
            onChange={(e) => handleDateChange(e.target.value)}
            InputLabelProps={{ shrink: true, sx: { color: "#8b8b9e" } }}
            sx={{
              minWidth: 160,
              "& .MuiOutlinedInput-root": {
                bgcolor: "#12121a",
                color: "#ffffff",
                borderRadius: 2,
                "& fieldset": { borderColor: "#2a2a3e" },
                "&:hover fieldset": { borderColor: "#00bfa5" },
                "&.Mui-focused fieldset": { borderColor: "#00bfa5" },
              },
            }}
          />

          {/* Reset Filters Button */}
          <Button
            onClick={handleResetFilters}
            sx={{
              bgcolor: "#1a1a24",
              color: "#ffffff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              border: "1px solid #2a2a3e",
              "&:hover": { bgcolor: "#2a2a3e" },
            }}
          >
            Reset Filters
          </Button>

          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              onClick={() => setViewMode("grid")}
              sx={{
                bgcolor: viewMode === "grid" ? "#00bfa5" : "#12121a",
                color: viewMode === "grid" ? "#0a0a0f" : "#ffffff",
                borderRadius: 2,
                "&:hover": {
                  bgcolor: viewMode === "grid" ? "#00a392" : "#1a1a24",
                },
              }}
            >
              <GridView />
            </IconButton>
            <IconButton
              onClick={() => setViewMode("list")}
              sx={{
                bgcolor: viewMode === "list" ? "#00bfa5" : "#12121a",
                color: viewMode === "list" ? "#0a0a0f" : "#ffffff",
                borderRadius: 2,
                "&:hover": {
                  bgcolor: viewMode === "list" ? "#00a392" : "#1a1a24",
                },
              }}
            >
              <ViewList />
            </IconButton>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ color: "#8b8b9e", mb: 3 }}>
          Showing {products.length} products
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 8,
            }}
          >
            <CircularProgress sx={{ color: "#00bfa5" }} />
          </Box>
        ) : products.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "#12121a",
              borderRadius: 3,
              border: "1px solid #1e1e2e",
            }}
          >
            <Typography variant="h6" sx={{ color: "#ffffff", mb: 1 }}>
              No products found
            </Typography>
            <Typography variant="body2" sx={{ color: "#8b8b9e" }}>
              Try adjusting your search
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns:
                viewMode === "grid"
                  ? {
                      xs: "1fr",
                      sm: "repeat(2, 1fr)",
                      md: "repeat(3, 1fr)",
                      lg: "repeat(4, 1fr)",
                    }
                  : "1fr",
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={(p) => console.log("Add to cart:", p)}
                onViewDetails={(p) => console.log("View details:", p)}
                onEdit={handleEditProduct}
                onDelete={handleDeleteClick}
              />
            ))}
          </Box>
        )}
      </Container>

      {/* Product Form Drawer */}
      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        mode={formMode}
        product={selectedProduct}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#12121a",
            border: "1px solid #1e1e2e",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: "#ffffff" }}>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#8b8b9e" }}>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: "#8b8b9e",
              textTransform: "none",
              "&:hover": { bgcolor: "#1a1a24" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={{
              bgcolor: "#f44336",
              color: "#ffffff",
              textTransform: "none",
              "&:hover": { bgcolor: "#d32f2f" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
