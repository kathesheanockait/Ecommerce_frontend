"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../../api/authApi";
import { useAppDispatch } from "../../redux/hooks";
import { loginSuccess } from "../../redux/slices/authSlice";
import { useSnackbar } from "../../commponent/useSnackBar";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const dispatch =useAppDispatch()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
     try {
    const data = await signIn({
        email,
        password
      })
      
      dispatch(loginSuccess({
      role: data.role,
      token: data.access_token
    }));

    showSnackbar('Login successfully', "success");
    resetForm();
    navigate('/dashboard')
     } catch (error:any) {
      console.log("message:", error.response?.data)  
    
    const msg = error.response?.data?.message
      ?? error.response?.data?.message      
      ?? "Something went wrong";
    showSnackbar(msg, "error");
     }
     finally{
       setLoading(false);
     }
  };

   const resetForm = () => {
  setEmail(""); setPassword("");
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0a0a0f",
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 440,
          width: "100%",
          bgcolor: "#12121a",
          borderRadius: 3,
          border: "1px solid #1e1e2e",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
           
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#ffffff", mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: "#8b8b9e" }}>
              Sign in to your account to continue shopping
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                mb: 2.5,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#1a1a24",
                  color: "#ffffff",
                  "& fieldset": { borderColor: "#2a2a3e" },
                  "&:hover fieldset": { borderColor: "#00bfa5" },
                  "&.Mui-focused fieldset": { borderColor: "#00bfa5" },
                },
                "& .MuiInputLabel-root": { color: "#8b8b9e" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#00bfa5" },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "#8b8b9e" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#1a1a24",
                  color: "#ffffff",
                  "& fieldset": { borderColor: "#2a2a3e" },
                  "&:hover fieldset": { borderColor: "#00bfa5" },
                  "&.Mui-focused fieldset": { borderColor: "#00bfa5" },
                },
                "& .MuiInputLabel-root": { color: "#8b8b9e" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#00bfa5" },
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <FormControlLabel
                hidden
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{ color: "#2a2a3e", "&.Mui-checked": { color: "#00bfa5" } }}
                  />
                }
                label={<Typography variant="body2" sx={{ color: "#8b8b9e" }}>Remember me</Typography>}
              />
              <Link to={'signup'}>
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                bgcolor: "#00bfa5",
                color: "#0a0a0f",
                fontWeight: 600,
                textTransform: "none",
                fontSize: 16,
                borderRadius: 2,
                "&:hover": { bgcolor: "#00a392" },
                "&:disabled": { bgcolor: "#1a1a24", color: "#4a4a5e" },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#0a0a0f" }} /> : "Sign In"}
            </Button>
          </Box>


          <Typography variant="body2" sx={{ textAlign: "center", mt: 3, color: "#8b8b9e" }}>
            {"Don't have an account? "}
            <Link to={'/signup'}
            >
              Sign Up
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
