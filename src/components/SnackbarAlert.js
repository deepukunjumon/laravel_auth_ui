import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SnackbarAlert = ({
    open,
    onClose,
    severity = "success",
    message,
    autoHideDuration = 6000,
    anchorOrigin = { vertical: "top", horizontal: "right" },
}) => (
    <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={anchorOrigin}
    >
        <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
            {message}
        </Alert>
    </Snackbar>
);

export default SnackbarAlert; 