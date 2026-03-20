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
import { deleteProductById, getProduct } from "../../api/productApi";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Role } from "../../types/role.type";
import { ProductCard, type Product } from "./productCard";
import { ProductForm } from "./productForm";
import { deleteProduct, setProduct } from "../../redux/slices/productSlice";

export function ProductList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const products = useAppSelector((state) => state.product.product);
  const role = useAppSelector((state) => state.auth.role);
  const dispatch =useAppDispatch();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProduct();
        dispatch(setProduct(data));
      } catch (error: any) {
        console.log("message:", error.response?.data);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock":
          return b.stock - a.stock;
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

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
      
       deleteProductById(productToDelete)
        dispatch(deleteProduct(productToDelete))
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // Handler for form save
  const handleSaveProduct = (productData: Omit<Product, "_id" | "createdAt" | "updatedAt"> & { _id?: string }) => {
    if (formMode === "create") {
      
      const newProduct: Product = {
        ...productData,
        _id: `temp_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      // setProducts((prev) => [newProduct, ...prev]);
    } else if (formMode === "edit" && productData._id) {
      
      // setProducts((prev) =>
      //   prev.map((p) =>
      //     p._id === productData._id
      //       ? { ...p, ...productData, updatedAt: new Date().toISOString() }
      //       : p
      //   )
      // );
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
          <TextField
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel sx={{ color: "#8b8b9e" }}>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                bgcolor: "#12121a",
                color: "#ffffff",
                borderRadius: 2,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#2a2a3e" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#00bfa5" },
                "& .MuiSvgIcon-root": { color: "#8b8b9e" },
              }}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="stock">Stock</MenuItem>
            </Select>
          </FormControl>

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
          Showing {filteredProducts.length} products
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
        ) : filteredProducts.length === 0 ? (
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
            {filteredProducts.map((product) => (
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
        onSave={handleSaveProduct}
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
