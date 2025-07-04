import React from "react";
import {
  Card,
  Typography,
  Box,
  CircularProgress,
  useTheme,
  Stack,
} from "@mui/material";

const StatCard = ({
  title,
  value,
  subtitle,
  color = "primary",
  icon,
  loading = false,
  sx = {},
  ...rest
}) => {
  const theme = useTheme();
  const paletteColor = [
    "primary",
    "secondary",
    "success",
    "warning",
    "info",
    "error",
  ].includes(color)
    ? color
    : "primary";

  return (
    <Card
      elevation={3}
      sx={{
        bgcolor: "#fff",
        borderRadius: 3,
        boxShadow: "0 2px 8px 0 rgba(31,41,55,0.07)",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        height: 90,
        minWidth: 180,
        width: "100%",
        px: 2,
        py: 1,
        ...sx,
      }}
      {...rest}
    >
      {icon && (
        <Box
          sx={{
            bgcolor: theme.palette[paletteColor].light,
            color: theme.palette[paletteColor].main,
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            fontSize: 24,
            mr: 2,
          }}
        >
          {icon}
        </Box>
      )}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: theme.palette[paletteColor].main,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </Typography>
        {loading ? (
          <Box
            sx={{
              minHeight: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <CircularProgress size={20} color={paletteColor} />
          </Box>
        ) : (
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 0.2,
              fontSize: 20,
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </Typography>
        )}
        {subtitle && !loading && (
          <Typography
            variant="caption"
            color="text.secondary"
            fontSize={12}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>
    </Card>
  );
};

export default StatCard;
