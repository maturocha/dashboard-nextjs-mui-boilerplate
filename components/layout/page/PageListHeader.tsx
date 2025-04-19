import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/navigation";
import Link from "next/link";
interface PageListHeaderProps {
  createUrl: string;
  labels: {
    plural: string;
    singular: string;
  };
}

export default function PageListHeader({ labels, createUrl }: PageListHeaderProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
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
        <Typography variant="h4" component="h1" fontWeight="bold">
          {labels.plural}
        </Typography>
      </Box>

      <Button
         component={Link}
         href={createUrl}
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          px: 3,
          py: 1.2,
          borderRadius: 2,
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 4px 12px rgba(99, 102, 241, 0.3)"
              : "0 4px 12px rgba(99, 102, 241, 0.15)",
        }}
      >
        <Box sx={{ display: { xs: "block", sm: "block" } }} >
          {isMobile ? "Nuevo" : `Nuevo ${labels.singular}`}
        </Box>
      </Button>
    </Box>
  );
}
