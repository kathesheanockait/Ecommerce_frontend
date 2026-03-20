/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Drawer from "@mui/material/Drawer";
import Chip from "@mui/material/Chip";
import Close from "@mui/icons-material/Close";
import CloudUpload from "@mui/icons-material/CloudUpload";
import Save from "@mui/icons-material/Save";
import AccessTime from "@mui/icons-material/AccessTime";
import ImageNotSupported from "@mui/icons-material/ImageNotSupported";

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

interface ImageEntry {
  /** object-URL (local file) or remote URL string */
  src: string;
  /** original file name, present only for local uploads */
  fileName?: string;
  /** the raw File object – only present for local uploads */
  file?: File;
}

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  product?: Product | null;
  onSave: (
    product: Omit<Product, "_id" | "createdAt" | "updatedAt"> & { _id?: string; files?: File[] }
  ) => void;
}

function formatDate(iso?: string) {
  if (!iso) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

export function ProductForm({ open, onClose, mode, product }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    isAvailable: true,
  });
  const [images, setImages] = useState<ImageEntry[]>([{ src: "" }]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs on unmount / reset
  const revokeObjectURLs = (entries: ImageEntry[]) => {
    entries.forEach((e) => {
      if (e.file && e.src.startsWith("blob:")) URL.revokeObjectURL(e.src);
    });
  };

  useEffect(() => {
    if (mode === "edit" && product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        isAvailable: product.isAvailable,
      });
      setImages(
        product.images.length > 0
          ? product.images.map((src) => ({ src }))
          : [{ src: "" }]
      );
    } else if (mode === "create") {
      setFormData({ name: "", price: "", stock: "", isAvailable: true });
      setImages([{ src: "" }]);
    }
  }, [mode, product, open]);

  useEffect(() => {
    if (!open) {
      revokeObjectURLs(images);
    }
  }, [open]);

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const addFilesAsImages = (files: FileList | File[]) => {
    const entries: ImageEntry[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({ src: URL.createObjectURL(f), fileName: f.name, file: f }));
    if (!entries.length) return;

    setImages((prev) => {
      const withoutEmpty = prev.filter((e) => e.src.trim() !== "");
      return [...withoutEmpty, ...entries];
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFilesAsImages(e.target.files);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files) addFilesAsImages(e.dataTransfer.files);
  };


  const removeImage = (index: number) => {
    setImages((prev) => {
      const entry = prev[index];
      if (entry.file && entry.src.startsWith("blob:")) URL.revokeObjectURL(entry.src);
      const next = prev.filter((_, i) => i !== index);
      return next.length ? next : [{ src: "" }];
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    
  };


  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#1a1a24",
      color: "#ffffff",
      "& fieldset": { borderColor: "#2a2a3e" },
      "&:hover fieldset": { borderColor: "#00bfa5" },
      "&.Mui-focused fieldset": { borderColor: "#00bfa5" },
    },
    "& .MuiInputLabel-root": { color: "#8b8b9e" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#00bfa5" },
  };


  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100%", sm: 500 },
          bgcolor: "#0a0a0f",
          borderLeft: "1px solid #1e1e2e",
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            p: 3,
            borderBottom: "1px solid #1e1e2e",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: 700 }}>
              {mode === "create" ? "Add New Product" : "Edit Product"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#8b8b9e", mt: 0.5 }}>
              {mode === "create"
                ? "Fill in the details to add a new product"
                : "Update the product information"}
            </Typography>

            {mode === "edit" && product?.updatedAt && (
              <Chip
                icon={<AccessTime sx={{ fontSize: 14, color: "#00bfa5 !important" }} />}
                label={`Last updated: ${formatDate(product.updatedAt)}`}
                size="small"
                sx={{
                  mt: 1,
                  bgcolor: "rgba(0,191,165,0.08)",
                  border: "1px solid rgba(0,191,165,0.25)",
                  color: "#00bfa5",
                  fontSize: 11,
                  height: 22,
                  "& .MuiChip-label": { px: 1 },
                }}
              />
            )}
          </Box>
          <IconButton
            onClick={onClose}
            sx={{ color: "#8b8b9e", "&:hover": { color: "#ffffff", bgcolor: "#1a1a24" } }}
          >
            <Close />
          </IconButton>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            overflow: "auto",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            fullWidth
            label="Product Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            sx={textFieldSx}
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange("price", e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography sx={{ color: "#8b8b9e" }}>₹</Typography>
                  </InputAdornment>
                ),
              }}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Stock Quantity"
              type="number"
              value={formData.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              required
              sx={textFieldSx}
            />
          </Box>

          <Box
            sx={{
              p: 2,
              bgcolor: "#12121a",
              borderRadius: 2,
              border: "1px solid #1e1e2e",
            }}
          >
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isAvailable}
                  onChange={(e) => handleChange("isAvailable", e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: "#00bfa5" },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#00bfa5" },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body1" sx={{ color: "#ffffff" }}>
                    Available for Sale
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#8b8b9e" }}>
                    Toggle off to hide from customers
                  </Typography>
                </Box>
              }
              sx={{ mx: 0, justifyContent: "space-between", width: "100%" }}
              labelPlacement="start"
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ color: "#ffffff", fontWeight: 600, mb: 2 }}>
              Product Images
            </Typography>

            <Box
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: `2px dashed ${dragOver ? "#00bfa5" : "#2a2a3e"}`,
                borderRadius: 2,
                p: 3,
                mb: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
                bgcolor: dragOver ? "rgba(0,191,165,0.05)" : "#12121a",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "#00bfa5",
                  bgcolor: "rgba(0,191,165,0.04)",
                },
              }}
            >
              <CloudUpload sx={{ fontSize: 36, color: dragOver ? "#00bfa5" : "#4a4a5e" }} />
              <Typography variant="body2" sx={{ color: "#8b8b9e", textAlign: "center" }}>
                <Box component="span" sx={{ color: "#00bfa5", fontWeight: 600 }}>
                  Click to upload
                </Box>{" "}
                or drag & drop images here
              </Typography>
              <Typography variant="caption" sx={{ color: "#4a4a5e" }}>
                PNG, JPG, WEBP supported
              </Typography>
            </Box>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={handleFileInput}
            />

            {images.some((e) => e.src.trim() !== "") && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 1.5,
                  mb: 2,
                }}
              >
                {images
                  .filter((e) => e.src.trim() !== "")
                  .map((entry, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid #2a2a3e",
                        aspectRatio: "1",
                        bgcolor: "#12121a",
                        "&:hover .delete-btn": { opacity: 1 },
                      }}
                    >
                      <Box
                        component="img"
                        src={entry.src}
                        alt={entry.fileName || `Image ${index + 1}`}
                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.nextSibling as HTMLElement;
                          if (fallback) fallback.style.display = "flex";
                        }}
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                      <Box
                        sx={{
                          display: "none",
                          position: "absolute",
                          inset: 0,
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          gap: 0.5,
                          bgcolor: "#1a1a24",
                        }}
                      >
                        <ImageNotSupported sx={{ color: "#4a4a5e", fontSize: 28 }} />
                        <Typography variant="caption" sx={{ color: "#4a4a5e", fontSize: 10 }}>
                          Invalid URL
                        </Typography>
                      </Box>

                      {index === 0 && (
                        <Chip
                          label="Main"
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            left: 4,
                            height: 18,
                            fontSize: 10,
                            bgcolor: "rgba(0,191,165,0.85)",
                            color: "#0a0a0f",
                            fontWeight: 700,
                            "& .MuiChip-label": { px: 0.75 },
                          }}
                        />
                      )}

                      {entry.fileName && (
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            bgcolor: "rgba(0,0,0,0.7)",
                            px: 1,
                            py: 0.25,
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#ccc",
                              fontSize: 9,
                              display: "block",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {entry.fileName}
                          </Typography>
                        </Box>
                      )}

                      <IconButton
                        className="delete-btn"
                        size="small"
                        onClick={(e) => { e.stopPropagation(); removeImage(images.findIndex((im) => im === entry)); }}
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          opacity: 0,
                          transition: "opacity 0.2s",
                          bgcolor: "rgba(244,67,54,0.85)",
                          color: "#fff",
                          p: 0.25,
                          "&:hover": { bgcolor: "#f44336" },
                        }}
                      >
                        <Close sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            p: 3,
            borderTop: "1px solid #1e1e2e",
            display: "flex",
            gap: 2,
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            onClick={onClose}
            sx={{
              py: 1.5,
              borderColor: "#2a2a3e",
              color: "#ffffff",
              textTransform: "none",
              "&:hover": { borderColor: "#00bfa5", bgcolor: "#12121a" },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            startIcon={<Save />}
            onClick={handleSubmit}
            sx={{
              py: 1.5,
              bgcolor: "#00bfa5",
              color: "#0a0a0f",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "#00a392" },
            }}
          >
            {mode === "create" ? "Create Product" : "Save Changes"}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}