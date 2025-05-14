import { Box } from '@mui/material';
import type { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React from 'react';
import Loader from '../components/loader';
import SignUp from '../components/sign-up';
import MainAppBar from '../components/main-app-bar';
import MainMenu from '../components/menu';
import PokemonProvider from '../hooks/pokemon-provider';

const Home: NextPage = () => {
    const { status } = useSession();

    if (status === 'loading') return <Loader />;
    if (status === 'unauthenticated') return <SignUp />;

    return (
        <PokemonProvider>
            <Box component="div" sx={{ display: 'flex' }}>
                <MainAppBar />
                <MainMenu />
            </Box>
        </PokemonProvider>
    );
};

export default Home;
