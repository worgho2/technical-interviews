import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loader: React.FC = () => {
    return (
        <Box
            component="div"
            sx={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <CircularProgress />
        </Box>
    );
};

export default Loader;
