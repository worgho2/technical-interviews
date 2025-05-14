import { Box, Button } from '@mui/material';
import React from 'react';

interface RetryOperationProps {
    buttonText: string;
    onRetry: () => Promise<void>;
}

const RetryOperation: React.FC<RetryOperationProps> = (props) => {
    const { buttonText, onRetry } = props;
    return (
        <Box
            component="div"
            sx={{
                display: 'grid',
                height: '90vh',
                width: '90vw',
                margin: '0',
                padding: '0',
                placeItems: 'center',
                position: 'absolute',
            }}
        >
            <Button
                variant="contained"
                size="large"
                onClick={onRetry}
                sx={{
                    marginBottom: '2rem',
                    width: '300px',
                    height: '60px',
                }}
            >
                {buttonText}
            </Button>
        </Box>
    );
};

export default RetryOperation;
