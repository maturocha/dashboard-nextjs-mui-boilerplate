import CustomButton from "@/components/shared/CustomButton";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  cta: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }
}

export default function PageHeader({ title, subtitle, cta }: PageHeaderProps) {

  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "row", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        gap: 2,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
      </Box>

      {cta && (
        <CustomButton
          label={cta.label}
          onClick={cta.onClick}
          icon={cta.icon}
        />
      )}
    </Box>
  );
}
