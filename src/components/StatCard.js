import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  CircularProgress,
  useTheme,
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
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        ...sx,
      }}
      {...rest}
    >
      <CardHeader
        avatar={
          icon && (
            <Box
              sx={{
                bgcolor: theme.palette[paletteColor].light,
                color: theme.palette[paletteColor].main,
                width: 42,
                height: 42,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 50,
                mr: 2,
                fontSize: 30,
              }}
            >
              {icon}
            </Box>
          )
        }
        title={
          <Typography
            variant="body2"
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: theme.palette[paletteColor].main,
            }}
          >
            {title}
          </Typography>
        }
        sx={{ pb: 0 }}
      />
      <CardContent>
        {loading ? (
          <Box
            sx={{
              minHeight: 72,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress color={paletteColor} />
          </Box>
        ) : (
          <>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "text.primary",
                mb: 0.5,
              }}
            >
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary" fontSize={15}>
                {subtitle}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
