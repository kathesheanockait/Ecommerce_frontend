"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Rating from "@mui/material/Rating";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import ArrowBack from "@mui/icons-material/ArrowBack";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Share from "@mui/icons-material/Share";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import LocalShipping from "@mui/icons-material/LocalShipping";
import Security from "@mui/icons-material/Security";
import Replay from "@mui/icons-material/Replay";
import Check from "@mui/icons-material/Check";

const product = {
  id: "1",
  name: "Premium Wireless Headphones",
  description: "Experience crystal-clear sound with our premium wireless headphones. Featuring advanced noise cancellation technology, these headphones deliver an immersive audio experience whether you're commuting, working, or relaxing at home.",
  price: 299.99,
  originalPrice: 399.99,
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80",
  ],
  rating: 4.5,
  reviews: 128,
  category: "Electronics",
  inStock: true,
  isNew: true,
  discount: 25,
  colors: ["Black", "Silver", "Rose Gold"],
  features: ["Active Noise Cancellation", "40-hour battery life", "Bluetooth 5.3", "Premium leather cushions", "Foldable design", "Built-in microphone"],
  specifications: { "Driver Size": "40mm", "Frequency Response": "20Hz - 20kHz", "Impedance": "32 Ohms", "Weight": "250g", "Connectivity": "Bluetooth 5.3, 3.5mm aux", "Battery Life": "40 hours" },
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return <Box hidden={value !== index} sx={{ pt: 3 }}>{value === index && children}</Box>;
}

export function ProductDetail() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#0a0a0f" }}>
      <Box sx={{ borderBottom: "1px solid #1e1e2e", bgcolor: "#12121a" }}>
                  <Typography variant="overline" sx={{ color: "#00bfa5", fontWeight: 600, letterSpacing: 2 }}>Hello</Typography>

        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Button startIcon={<ArrowBack />} sx={{ color: "#8b8b9e", textTransform: "none", "&:hover": { color: "#ffffff" } }}>Back to Products</Button>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 6 }}>
          {/* Image Gallery */}
          <Box>
            
            <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden", bgcolor: "#12121a", mb: 2 }}>
              {product.isNew && <Chip label="NEW" size="small" sx={{ position: "absolute", top: 16, left: 16, zIndex: 1, bgcolor: "#00bfa5", color: "#0a0a0f", fontWeight: 700 }} />}
              {product.discount && <Chip label={`-${product.discount}%`} size="small" sx={{ position: "absolute", top: 16, left: 80, zIndex: 1, bgcolor: "#f44336", color: "#ffffff", fontWeight: 700 }} />}
              <Box component="img" src={product.images[selectedImage]} alt={product.name} sx={{ width: "100%", height: 500, objectFit: "cover" }} />
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
              {product.images.map((image, index) => (
                <Box key={index} onClick={() => setSelectedImage(index)} sx={{ borderRadius: 2, overflow: "hidden", border: selectedImage === index ? "2px solid #00bfa5" : "2px solid #2a2a3e", cursor: "pointer", transition: "all 0.2s", "&:hover": { borderColor: "#00bfa5" } }}>
                  <Box component="img" src={image} alt={`${product.name} ${index + 1}`} sx={{ width: "100%", height: 100, objectFit: "cover" }} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Product Info */}
          <Box>
            <Typography variant="overline" sx={{ color: "#00bfa5", fontWeight: 600, letterSpacing: 2 }}>{product.category}</Typography>
            <Typography variant="h3" sx={{ color: "#ffffff", fontWeight: 700, mb: 2 }}>{product.name}</Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Rating value={product.rating} precision={0.5} readOnly sx={{ "& .MuiRating-iconFilled": { color: "#ffc107" }, "& .MuiRating-iconEmpty": { color: "#2a2a3e" } }} />
              <Typography variant="body2" sx={{ color: "#8b8b9e" }}>{product.rating} ({product.reviews} reviews)</Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 4 }}>
              <Typography variant="h4" sx={{ color: "#ffffff", fontWeight: 700 }}>${product.price.toFixed(2)}</Typography>
              {product.originalPrice && (
                <>
                  <Typography variant="h5" sx={{ color: "#5a5a6e", textDecoration: "line-through" }}>${product.originalPrice.toFixed(2)}</Typography>
                  <Chip label={`Save $${(product.originalPrice - product.price).toFixed(2)}`} size="small" sx={{ bgcolor: "rgba(0,191,165,0.1)", color: "#00bfa5", fontWeight: 600 }} />
                </>
              )}
            </Box>

            <Typography variant="body1" sx={{ color: "#8b8b9e", mb: 4, lineHeight: 1.8 }}>{product.description}</Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ color: "#ffffff", mb: 2, fontWeight: 600 }}>Color: {selectedColor}</Typography>
              <Box sx={{ display: "flex", gap: 2 }}>
                {product.colors.map((color) => (
                  <Button key={color} variant={selectedColor === color ? "contained" : "outlined"} onClick={() => setSelectedColor(color)} sx={{ bgcolor: selectedColor === color ? "#00bfa5" : "transparent", color: selectedColor === color ? "#0a0a0f" : "#ffffff", borderColor: "#2a2a3e", textTransform: "none", "&:hover": { bgcolor: selectedColor === color ? "#00a392" : "#1a1a24", borderColor: "#00bfa5" } }}>
                    {color}
                  </Button>
                ))}
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ color: "#ffffff", mb: 2, fontWeight: 600 }}>Quantity</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", border: "1px solid #2a2a3e", borderRadius: 2 }}>
                  <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))} sx={{ color: "#8b8b9e" }}><Remove /></IconButton>
                  <Typography sx={{ color: "#ffffff", px: 2, minWidth: 40, textAlign: "center" }}>{quantity}</Typography>
                  <IconButton onClick={() => setQuantity(quantity + 1)} sx={{ color: "#8b8b9e" }}><Add /></IconButton>
                </Box>
                {product.inStock ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "#00bfa5" }}>
                    <Check sx={{ fontSize: 18 }} />
                    <Typography variant="body2">In Stock</Typography>
                  </Box>
                ) : (
                  <Typography variant="body2" sx={{ color: "#f44336" }}>Out of Stock</Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              <Button fullWidth variant="contained" startIcon={<ShoppingCart />} disabled={!product.inStock} sx={{ py: 1.5, bgcolor: "#00bfa5", color: "#0a0a0f", textTransform: "none", fontWeight: 600, fontSize: 16, "&:hover": { bgcolor: "#00a392" }, "&:disabled": { bgcolor: "#2a2a3e", color: "#5a5a6e" } }}>
                Add to Cart
              </Button>
              <IconButton onClick={() => setIsFavorite(!isFavorite)} sx={{ border: "1px solid #2a2a3e", borderRadius: 2, "&:hover": { borderColor: "#00bfa5" } }}>
                {isFavorite ? <Favorite sx={{ color: "#f44336" }} /> : <FavoriteBorder sx={{ color: "#ffffff" }} />}
              </IconButton>
              <IconButton sx={{ border: "1px solid #2a2a3e", borderRadius: 2, "&:hover": { borderColor: "#00bfa5" } }}>
                <Share sx={{ color: "#ffffff" }} />
              </IconButton>
            </Box>

            <Divider sx={{ borderColor: "#2a2a3e", my: 4 }} />

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 3 }}>
              {[
                { icon: LocalShipping, title: "Free Shipping", subtitle: "On orders $100+" },
                { icon: Security, title: "2 Year Warranty", subtitle: "Full coverage" },
                { icon: Replay, title: "Easy Returns", subtitle: "30 day return" },
              ].map(({ icon: Icon, title, subtitle }) => (
                <Box key={title} sx={{ textAlign: "center" }}>
                  <Box sx={{ width: 48, height: 48, mx: "auto", mb: 1.5, borderRadius: "50%", bgcolor: "rgba(0,191,165,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon sx={{ color: "#00bfa5" }} />
                  </Box>
                  <Typography variant="body2" sx={{ color: "#ffffff", fontWeight: 600 }}>{title}</Typography>
                  <Typography variant="caption" sx={{ color: "#8b8b9e" }}>{subtitle}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Tabs Section */}
        <Box sx={{ mt: 8 }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ borderBottom: "1px solid #2a2a3e", "& .MuiTab-root": { color: "#8b8b9e", textTransform: "none", fontWeight: 600, "&.Mui-selected": { color: "#00bfa5" } }, "& .MuiTabs-indicator": { bgcolor: "#00bfa5" } }}>
            <Tab label="Features" />
            <Tab label="Specifications" />
            <Tab label={`Reviews (${product.reviews})`} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
              {product.features.map((feature, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2, p: 2, bgcolor: "#12121a", borderRadius: 2, border: "1px solid #1e1e2e" }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "rgba(0,191,165,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check sx={{ color: "#00bfa5", fontSize: 18 }} />
                  </Box>
                  <Typography sx={{ color: "#ffffff" }}>{feature}</Typography>
                </Box>
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ bgcolor: "#12121a", borderRadius: 3, border: "1px solid #1e1e2e", overflow: "hidden" }}>
              {Object.entries(product.specifications).map(([key, value], index) => (
                <Box key={key} sx={{ display: "flex", justifyContent: "space-between", p: 2, bgcolor: index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <Typography sx={{ color: "#ffffff", fontWeight: 500 }}>{key}</Typography>
                  <Typography sx={{ color: "#8b8b9e" }}>{value}</Typography>
                </Box>
              ))}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography sx={{ color: "#8b8b9e" }}>Reviews section - integrate with your backend</Typography>
            </Box>
          </TabPanel>
        </Box>
      </Container>
    </Box>
  );
}
