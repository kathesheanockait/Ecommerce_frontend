"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Avatar from "@mui/material/Avatar";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import Search from "@mui/icons-material/Search";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Person from "@mui/icons-material/Person";
import MenuIcon from "@mui/icons-material/Menu";
import Close from "@mui/icons-material/Close";
import Logout from "@mui/icons-material/Logout";
import Dashboard from "@mui/icons-material/Dashboard";
import Receipt from "@mui/icons-material/Receipt";
import { Outlet, useNavigate } from "react-router-dom";
import { logOut } from "../redux/slices/authSlice";
import { useAppDispatch } from "../redux/hooks";

interface NavbarProps {
  user?: { name: string; email: string; role: "user" | "admin" } | null;
  cartItemCount?: number;
}

const navLinks = [
  { href: "/dashboard/products", label: "Products" },
  // { href: "/dashboard/categories", label: "Categories" },
  // { href: "/dashboard/deals", label: "Deals" },
  // { href: "/dashboard/about", label: "About" },
];

export function Navbar({ user = null, cartItemCount = 0 }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    <AppBar position="sticky" sx={{ bgcolor: "#12121a", borderBottom: "1px solid #1e1e2e", boxShadow: "none" }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 0 }, minHeight: 64 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 4 }}>
            <Box sx={{ width: 36, height: 36, bgcolor: "#00bfa5", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ShoppingBag sx={{ color: "#0a0a0f", fontSize: 22 }} />
            </Box>
            <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700, display: { xs: "none", sm: "block" } }}>ShopHub</Typography>
          </Box>

          {/* Desktop Nav Links */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3, flex: 1 }}>
            {navLinks.map((link) => (
              <Button key={link.href} sx={{ color: "#8b8b9e", textTransform: "none", fontWeight: 500, "&:hover": { color: "#ffffff", bgcolor: "transparent" } }}
              onClick={()=>navigate(link.href)}
              >
                {link.label}
              </Button>
            ))}
            {user?.role === "admin" && (
              <Button sx={{ color: "#00bfa5", textTransform: "none", fontWeight: 500, "&:hover": { color: "#00bfa5", bgcolor: "transparent" } }}>Admin</Button>
            )}
          </Box>

          {/* Right Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={() => setSearchOpen(!searchOpen)} sx={{ color: "#8b8b9e", "&:hover": { color: "#ffffff" } }}>
              <Search />
            </IconButton>

            <IconButton sx={{ color: "#8b8b9e", "&:hover": { color: "#ffffff" }, display: { xs: "none", sm: "flex" } }}>
              <FavoriteBorder />
            </IconButton>

            <IconButton sx={{ color: "#8b8b9e", "&:hover": { color: "#ffffff" } }}>
              <Badge badgeContent={cartItemCount} sx={{ "& .MuiBadge-badge": { bgcolor: "#00bfa5", color: "#0a0a0f", fontWeight: 600 } }}>
                <ShoppingCart />
              </Badge>
            </IconButton>

            {user ? (
              <>
                <IconButton onClick={handleUserMenuOpen} sx={{ ml: 1 }}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: "#00bfa5", color: "#0a0a0f", fontWeight: 600, fontSize: 14 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  PaperProps={{ sx: { bgcolor: "#12121a", border: "1px solid #1e1e2e", mt: 1, minWidth: 200 } }}
                >
                  <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #1e1e2e" }}>
                    <Typography variant="body2" sx={{ color: "#ffffff", fontWeight: 500 }}>{user.name}</Typography>
                    <Typography variant="caption" sx={{ color: "#8b8b9e" }}>{user.email}</Typography>
                  </Box>
                  <MenuItem onClick={handleUserMenuClose} sx={{ color: "#ffffff", gap: 1.5, py: 1.5, "&:hover": { bgcolor: "#1a1a24" } }}>
                    <Person sx={{ fontSize: 20 }} /> Profile
                  </MenuItem>
                  <MenuItem onClick={handleUserMenuClose} sx={{ color: "#ffffff", gap: 1.5, py: 1.5, "&:hover": { bgcolor: "#1a1a24" } }}>
                    <Receipt sx={{ fontSize: 20 }} /> Orders
                  </MenuItem>
                  {user.role === "admin" && (
                    <MenuItem onClick={handleUserMenuClose} sx={{ color: "#ffffff", gap: 1.5, py: 1.5, "&:hover": { bgcolor: "#1a1a24" } }}>
                      <Dashboard sx={{ fontSize: 20 }} /> Admin Dashboard
                    </MenuItem>
                  )}
                  <Divider sx={{ borderColor: "#1e1e2e" }} />
                  <MenuItem onClick={handleUserMenuClose} sx={{ color: "#f44336", gap: 1.5, py: 1.5, "&:hover": { bgcolor: "#1a1a24" } }}>
                    <Logout sx={{ fontSize: 20 }} /> Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: { xs: "none", sm: "flex" }, gap: 1, ml: 1 }}>
                {/* <Button sx={{ color: "#8b8b9e", textTransform: "none", "&:hover": { color: "#ffffff" } }}>Sign In</Button> */}
                <Button variant="contained" sx={{ bgcolor: "#00bfa5", color: "#0a0a0f", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#00a392" } }}
                onClick={()=>{
                  console.log("koo");
                  dispatch(logOut())
                 
                }}>Log Out</Button>
              </Box>
            )}

            <IconButton onClick={() => setMobileMenuOpen(true)} sx={{ color: "#8b8b9e", display: { md: "none" }, ml: 1 }}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Search Bar */}
        {searchOpen && (
          <Box sx={{ pb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search products..."
              autoFocus
              InputProps={{ startAdornment: <InputAdornment position="start"><Search sx={{ color: "#8b8b9e" }} /></InputAdornment> }}
              sx={{ "& .MuiOutlinedInput-root": { bgcolor: "#1a1a24", color: "#ffffff", "& fieldset": { borderColor: "#2a2a3e" }, "&:hover fieldset": { borderColor: "#00bfa5" }, "&.Mui-focused fieldset": { borderColor: "#00bfa5" } } }}
            />
          </Box>
        )}
      </Container>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} PaperProps={{ sx: { width: 280, bgcolor: "#12121a", borderLeft: "1px solid #1e1e2e" } }}>
        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1e1e2e" }}>
          <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>Menu</Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: "#8b8b9e" }}><Close /></IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.href} disablePadding>
              <ListItemButton onClick={() => setMobileMenuOpen(false)} sx={{ py: 1.5, "&:hover": { bgcolor: "#1a1a24" } }}>
                <ListItemText primary={link.label} sx={{ "& .MuiTypography-root": { color: "#8b8b9e" } }} />
              </ListItemButton>
            </ListItem>
          ))}
          {user?.role === "admin" && (
            <ListItem disablePadding>
              <ListItemButton onClick={() => setMobileMenuOpen(false)} sx={{ py: 1.5, "&:hover": { bgcolor: "#1a1a24" } }}>
                <ListItemText primary="Admin Dashboard" sx={{ "& .MuiTypography-root": { color: "#00bfa5" } }} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
        {!user && (
          <Box sx={{ p: 2, mt: "auto", borderTop: "1px solid #1e1e2e", display: "flex", flexDirection: "column", gap: 2 }}>
            {/* <Button fullWidth variant="outlined" sx={{ borderColor: "#2a2a3e", color: "#ffffff", textTransform: "none", "&:hover": { borderColor: "#00bfa5" } }}>Sign In</Button> */}
            <Button fullWidth variant="contained" sx={{ bgcolor: "#00bfa5", color: "#0a0a0f", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#00a392" } }}>Log Out</Button>
          </Box>
        )}
      </Drawer>
    </AppBar>
      <Outlet/>
    </>
  );
}
