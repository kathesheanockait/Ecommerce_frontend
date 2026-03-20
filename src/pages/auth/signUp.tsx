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
import CircularProgress from "@mui/material/CircularProgress";
import LinearProgress from "@mui/material/LinearProgress";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import { Link, useNavigate } from "react-router-dom";
import { signUp } from "../../api/authApi";
import { useSnackbar } from "../../commponent/useSnackBar";


export function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState<number>()
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const getPasswordStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthColors = ["#f44336", "#ff9800", "#ffeb3b", "#8bc34a", "#4caf50"];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
    { label: "One number", met: /[0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    
    e.preventDefault();
    if (password !== confirmPassword ) return;
    
    setLoading(true);
    
  try {
    const data = await signUp({ name: firstName, email, password, confirmPassword, phone });
    console.log("response data:", data);
    showSnackbar("Account created!", "success");
    resetForm();
    navigate('/')

  } catch (error:any) {
    console.log("message:", error.response?.data)  
    
    const msg = error.response?.data?.message
      ?? error.response?.data?.message      
      ?? "Something went wrong";
    showSnackbar(msg, "error");

  } finally {
    setLoading(false);
  }

  };

  const resetForm = () => {
  setFirstName(""); setEmail(""); setPassword("");
  setConfirmPassword(""); setPhone("");
  setShowPassword(false); setShowConfirmPassword(false);
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
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#0a0a0f", p: 2, py: 4 }}>
      <Card sx={{ maxWidth: 500, width: "100%", bgcolor: "#12121a", borderRadius: 3, border: "1px solid #1e1e2e" }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#ffffff", mb: 1 }}>Create Account</Typography>
            <Typography variant="body2" sx={{ color: "#8b8b9e" }}>Join ShopHub and start shopping today</Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", gap: 2, mb: 2.5 }}>
              <TextField fullWidth label="Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required sx={textFieldSx} />
            </Box>

            <TextField fullWidth label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required sx={{ ...textFieldSx, mb: 2.5 }} />

            <TextField
              fullWidth
              label="phone"
              type={"number"}
              value={phone}
              onChange={(e) => setPhone(Number(e.target.value))}
              required
             
              sx={{ ...textFieldSx, mb: 1 }}
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
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#8b8b9e" }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ ...textFieldSx, mb: 1 }}
            />

            {password && (
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(passwordStrength / 5) * 100}
                    sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: "#2a2a3e", "& .MuiLinearProgress-bar": { bgcolor: strengthColors[passwordStrength - 1] || "#2a2a3e", borderRadius: 3 } }}
                  />
                  <Typography variant="caption" sx={{ color: strengthColors[passwordStrength - 1] || "#8b8b9e", minWidth: 70 }}>
                    {strengthLabels[passwordStrength - 1] || ""}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {passwordRequirements.map((req) => (
                    <Box key={req.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      {req.met ? <CheckCircle sx={{ fontSize: 14, color: "#4caf50" }} /> : <Cancel sx={{ fontSize: 14, color: "#5a5a6e" }} />}
                      <Typography variant="caption" sx={{ color: req.met ? "#4caf50" : "#5a5a6e" }}>{req.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              error={confirmPassword !== "" && confirmPassword !== password}
              helperText={confirmPassword !== "" && confirmPassword !== password ? "Passwords do not match" : ""}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" sx={{ color: "#8b8b9e" }}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ ...textFieldSx, mb: 2.5 }}
            />

            <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ py: 1.5, bgcolor: "#00bfa5", color: "#0a0a0f", fontWeight: 600, textTransform: "none", fontSize: 16, borderRadius: 2, "&:hover": { bgcolor: "#00a392" }, "&:disabled": { bgcolor: "#1a1a24", color: "#4a4a5e" } }}>
              {loading ? <CircularProgress size={24} sx={{ color: "#0a0a0f" }} 
              onClick={handleSubmit}
              /> : "Create Account"}
            </Button>
          </Box>

          <Typography variant="body2" sx={{ textAlign: "center", mt: 3, color: "#8b8b9e" }}>
            Already have an account?{" "}
            <Link to={'/'} >Sign In</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

