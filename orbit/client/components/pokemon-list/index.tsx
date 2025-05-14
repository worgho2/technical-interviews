/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Box, Pagination } from '@mui/material';
import PokemonCard from './card';
import { Stack } from '@mui/system';
import { usePokemonContext } from '../../hooks/pokemon-provider';
import RetryOperation from '../retry-operation';

const PokemonList: React.FC = () => {
    const { pokemons, loadPokemons, loading, totalOfPokemons, lastLoadedDate } = usePokemonContext();
    const pokemonsPerPage = 3;
    const numberOfPages = Math.ceil(totalOfPokemons / pokemonsPerPage);

    useEffect(() => {
        if (lastLoadedDate === undefined) {
            loadPokemons(1, pokemonsPerPage);
        }
    }, []);

    const handlePageChanged = (event: React.ChangeEvent<unknown>, page: number) => {
        loadPokemons(page, pokemonsPerPage);
    };

    if (pokemons.length === 0 && !loading) {
        return <RetryOperation buttonText="Retry Loading Pokemons" onRetry={() => loadPokemons(1, pokemonsPerPage)} />;
    }

    return (
        <Box>
            <Stack direction="row">
                {pokemons.map((pokemon) => (
                    <Box
                        key={pokemon.name}
                        sx={{
                            flexGrow: 1,
                            display: 'grid',
                            margin: '0',
                            padding: '0',
                            placeItems: 'center',
                        }}
                    >
                        <PokemonCard data={pokemon} />
                    </Box>
                ))}
            </Stack>
            <Box
                sx={{
                    paddingTop: 5,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Pagination
                    count={numberOfPages}
                    variant="outlined"
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                    onChange={handlePageChanged}
                />
            </Box>
        </Box>
    );
};

export default PokemonList;
