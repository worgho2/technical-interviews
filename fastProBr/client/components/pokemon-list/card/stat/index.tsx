import { Box, LinearProgress, Typography } from '@mui/material';
import React from 'react';
import { convertRange } from '../../../../utils/convert-range';

interface PokemonCardStatProps {
    name: string;
    value: number;
    progressColor: string;
}

const PokemonCardStat: React.FC<PokemonCardStatProps> = (props) => {
    const { name, value, progressColor } = props;

    const progressBarValue = convertRange({
        value,
        currentRange: [0, 255],
        targetRange: [0, 100],
        forceInteger: true,
    });

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
            <Box sx={{ width: '40px' }}>
                <Typography variant="body2" color="text.secondary" align="right">
                    {name}
                </Typography>
            </Box>
            <Box sx={{ width: '210px', padding: 1.5 }}>
                <LinearProgress
                    variant="determinate"
                    value={progressBarValue}
                    sx={{
                        backgroundColor: 'white',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: progressColor,
                        },
                    }}
                />
            </Box>
            <Box sx={{ width: '30px' }}>
                <Typography variant="body2" color="text.secondary" align="left">
                    {value}
                </Typography>
            </Box>
        </Box>
    );
};

export default PokemonCardStat;
