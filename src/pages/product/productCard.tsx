"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Visibility from "@mui/icons-material/Visibility";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import { useAppSelector } from "../../redux/hooks";
import { Role } from "../../types/role.type";

export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  images: string[];
  createdAt: string;
  updatedAt?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onViewDetails,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const role = useAppSelector((state) => state.auth.role);
  
  const images =
    product.images?.length > 0
      ? product.images
      : [`https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`];

  const hasMultipleImages = images.length > 1;

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(product);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(product._id);
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        bgcolor: "#12121a",
        borderRadius: 3,
        border: "1px solid #1e1e2e",
        overflow: "hidden",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        boxShadow: isHovered ? "0 20px 40px rgba(0,191,165,0.15)" : "none",
        "&:hover": { borderColor: "#00bfa5" },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {/* Image Container */}
        <Box sx={{ position: "relative", height: 200, overflow: "hidden" }}>
          <Box
            component="img"
            src={images[currentImageIndex]}
            alt={`${product.name} - Image ${currentImageIndex + 1}`}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />

          {/* Navigation Arrows */}
          {hasMultipleImages && isHovered && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: "absolute",
                  left: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  color: "#ffffff",
                  width: 32,
                  height: 32,
                  "&:hover": { bgcolor: "rgba(0, 191, 165, 0.8)" },
                  transition: "all 0.2s ease",
                }}
              >
                <ChevronLeft fontSize="small" />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  color: "#ffffff",
                  width: 32,
                  height: 32,
                  "&:hover": { bgcolor: "rgba(0, 191, 165, 0.8)" },
                  transition: "all 0.2s ease",
                }}
              >
                <ChevronRight fontSize="small" />
              </IconButton>
            </>
          )}

          {/* Image Indicators */}
          {hasMultipleImages && (
            <Box
              sx={{
                position: "absolute",
                bottom: isHovered ? 60 : 8,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 0.5,
                transition: "bottom 0.3s ease",
              }}
            >
              {images.map((_, index) => (
                <Box
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  sx={{
                    width: index === currentImageIndex ? 16 : 6,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: index === currentImageIndex ? "#00bfa5" : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: index === currentImageIndex ? "#00bfa5" : "rgba(255,255,255,0.8)",
                    },
                  }}
                />
              ))}
            </Box>
          )}

          {/* Image Counter Badge */}
          {hasMultipleImages && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                bgcolor: "rgba(0, 0, 0, 0.7)",
                color: "#ffffff",
                px: 1,
                py: 0.25,
                borderRadius: 1,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {currentImageIndex + 1} / {images.length}
            </Box>
          )}
        </Box>

        {/* Stock Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          {product.isAvailable ? (
            <Chip
              label={`${product.stock} in stock`}
              size="small"
              sx={{ bgcolor: "#00bfa5", color: "#0a0a0f", fontWeight: 700, fontSize: 11 }}
            />
          ) : (
            <Chip
              label="OUT OF STOCK"
              size="small"
              sx={{ bgcolor: "#5a5a6e", color: "#ffffff", fontWeight: 600, fontSize: 10 }}
            />
          )}
        </Box>

        {/* Admin Edit/Delete Buttons */}
        {isHovered && role === Role.ADMIN && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 1,
              borderRadius: 2,
              transition: "all 0.3s ease",
            }}
          >
            <Tooltip title="Edit Product">
              <IconButton
                onClick={handleEdit}
                sx={{
                  color: "#00bfa5",
                  bgcolor: "rgba(0,0,0,0.6)",
                  "&:hover": { bgcolor: "rgba(0, 191, 165, 0.3)" },
                }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete Product">
              <IconButton
                onClick={handleDelete}
                sx={{
                  color: "#f44336",
                  bgcolor: "rgba(0,0,0,0.6)",
                  "&:hover": { bgcolor: "rgba(244, 67, 54, 0.3)" },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Favorite Button */}
        <IconButton
          onClick={() => setIsFavorite(!isFavorite)}
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            bgcolor: "rgba(18, 18, 26, 0.8)",
            backdropFilter: "blur(4px)",
            "&:hover": { bgcolor: "rgba(18, 18, 26, 0.95)" },
          }}
        >
          {isFavorite ? (
            <Favorite sx={{ color: "#f44336" }} />
          ) : (
            <FavoriteBorder sx={{ color: "#ffffff" }} />
          )}
        </IconButton>

        {/* Hover Actions */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            display: "flex",
            gap: 1,
            bgcolor: "rgba(10, 10, 15, 0.9)",
            backdropFilter: "blur(8px)",
            transform: isHovered ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.3s ease",
          }}
        >
          <Button
            fullWidth
            variant="contained"
            startIcon={<ShoppingCart />}
            disabled={!product.isAvailable}
            onClick={() => onAddToCart?.(product)}
            sx={{
              bgcolor: "#00bfa5",
              color: "#0a0a0f",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "#00a392" },
              "&:disabled": { bgcolor: "#2a2a3e", color: "#5a5a6e" },
            }}
          >
            Add to Cart
          </Button>
          <Tooltip title="View Details">
            <IconButton
              onClick={() => onViewDetails?.(product)}
              sx={{
                border: "1px solid #2a2a3e",
                color: "#ffffff",
                "&:hover": { borderColor: "#00bfa5", bgcolor: "#1a1a24" },
              }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <CardContent sx={{ p: 2.5 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#ffffff",
            fontWeight: 600,
            mb: 1.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {product.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h5" sx={{ color: "#00bfa5", fontWeight: 700 }}>
            ₹{product.price.toLocaleString()}
          </Typography>
          <Typography variant="caption" sx={{ color: "#8b8b9e" }}>
            Stock: {product.stock}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
