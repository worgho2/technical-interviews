import { CatchingPokemon } from '@mui/icons-material';
import { Box, Drawer, List, Toolbar } from '@mui/material';
import React, { useState } from 'react';
import PokemonList from '../pokemon-list';
import MainMenuItem from './item';

const drawerWidth = 240;

enum MenuItems {
    POKEMONS = 'POKEMONS',
}

const MainMenu: React.FC = () => {
    const [selected, setSelected] = useState<keyof typeof MenuItems>('POKEMONS');

    return (
        <React.Fragment>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                }}
            >
                <Toolbar />
                <Box component="div" sx={{ overflow: 'clip', background: '#0E1117', height: '100vh' }}>
                    <List>
                        <MainMenuItem
                            name="Pokemons"
                            selected={selected === 'POKEMONS'}
                            icon={<CatchingPokemon htmlColor="#FFFFFF" />}
                            onClick={() => setSelected('POKEMONS')}
                        />
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar />
                {selected === 'POKEMONS' ? <PokemonList /> : null}
            </Box>
        </React.Fragment>
    );
};

export default MainMenu;
