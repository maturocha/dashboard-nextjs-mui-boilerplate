import { Button, ButtonProps, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";

interface CustomButtonProps extends Omit<ButtonProps, "color"> {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "text" | "contained" | "outlined";
  onClick?: () => void;
  disabled?: boolean;
}

export default function CustomButton({
  label,
  icon,
  href,
  color = "primary",
  fullWidth = false,
  size = "medium",
  variant = "contained",
  sx,
  onClick,
  disabled,
  ...props
}: CustomButtonProps) {
  const theme = useTheme();

  const buttonStyles = {
    px: 3,
    py: 1.2,
    borderRadius: 2,
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 4px 12px rgba(99, 102, 241, 0.3)"
        : "0 4px 12px rgba(99, 102, 241, 0.15)",
    ...sx,
  };

  const buttonContent = (
    <Button
      onClick={onClick}
      disabled={disabled}
      color={color}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      startIcon={icon}
      sx={buttonStyles}
      {...props}
    >
      <Box sx={{ display: { xs: "block", sm: "block" } }}>{label}</Box>
    </Button>
  );

  if (href) {
    return (
      <Link href={href} style={{ textDecoration: "none" }}>
        {buttonContent}
      </Link>
    );
  }

  return buttonContent;
} 