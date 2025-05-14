import { Box, Card, CardMedia, Typography } from '@mui/material';
import { FPBRAPIPokemon } from '../../../models/fpbr-api';
import React from 'react';
import { Balance, Height } from '@mui/icons-material';
import PokemonCardStat from './stat';
import Image from 'next/image';

interface PokemonCardProps {
    data: FPBRAPIPokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = (props) => {
    const { data } = props;
    const { name, height, weight, imageUrl, stats } = data;

    return (
        <Card
            elevation={10}
            sx={{
                padding: '20px 30px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: '30px',
            }}
        >
            <Box
                component="div"
                sx={{
                    maxWidth: '300px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        width: '280px',
                        height: '100px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h4" component="div" align="center">
                        {name}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'row', pb: 1 }}>
                    <Height htmlColor="#FFFFFF" /> {height / 10} m &nbsp;
                    <Balance htmlColor="#FFFFFF" /> &nbsp; {weight / 10} kg
                </Box>

                <Image
                    src={imageUrl || '/placeholder.png'}
                    placeholder="blur"
                    alt={name}
                    width={200}
                    height={200}
                    blurDataURL="/placeholder.png"
                />

                <PokemonCardStat name="HP" value={stats.hp} progressColor="#ae2012" />
                <PokemonCardStat name="ATK" value={stats.attack} progressColor="#ee9b00" />
                <PokemonCardStat name="DEF" value={stats.defense} progressColor="#005f73" />
                <PokemonCardStat name="S.ATK" value={stats['special-attack']} progressColor="#ca6702" />
                <PokemonCardStat name="S.DEF" value={stats['special-defense']} progressColor="#0a9396" />
                <PokemonCardStat name="SPD" value={stats.speed} progressColor="#f15bb5" />
            </Box>
        </Card>
    );
};

export default PokemonCard;
