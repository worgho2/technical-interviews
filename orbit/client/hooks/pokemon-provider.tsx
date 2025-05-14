import React, { PropsWithChildren, createContext, useContext, useState } from 'react';
import { OrbitAPIError, OrbitAPIPokemon } from '../models/orbit-api';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import { Session } from 'next-auth';
import * as orbitApi from '../services/orbit-api';

interface PokemonContextData {
    pokemons: OrbitAPIPokemon[];
    loading: boolean;
    totalOfPokemons: number;
    lastLoadedDate?: Date;
    loadPokemons: (page: number, limit: number) => Promise<void>;
}

const PokemonContext = createContext<PokemonContextData>({
    pokemons: [],
    loading: false,
    totalOfPokemons: 0,
    loadPokemons: async () => {},
});

export function usePokemonContext(): PokemonContextData {
    return useContext<PokemonContextData>(PokemonContext);
}

const PokemonProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const { data: session, status: sessionStatus } = useSession();
    const { enqueueSnackbar } = useSnackbar();
    const [pokemons, setpokemons] = useState<OrbitAPIPokemon[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [totalOfPokemons, setTotalOfPokemons] = useState<number>(0);
    const [lastLoadedDate, setLastLoadedDate] = useState<Date | undefined>();

    const loadPokemons = async (page: number, limit: number) => {
        try {
            setLoading(true);
            const sessionData = session as (Session & { accessToken: string }) | null;
            const accessToken = sessionData?.accessToken;

            if (accessToken === undefined) {
                throw new Error('No access token found.');
            }

            const response = await orbitApi.listPokemons(accessToken, {
                limit: limit,
                offset: (page - 1) * limit,
            });

            setpokemons(response.data);
            setTotalOfPokemons(response.count);
            setLoading(false);
            setLastLoadedDate(new Date());
        } catch (error) {
            let message = 'An error occurred while loading the pokemons.';

            if (error instanceof OrbitAPIError) {
                message = error.message;
            }

            enqueueSnackbar(message, {
                variant: 'error',
            });
            setLoading(false);
        }
    };

    return (
        <PokemonContext.Provider
            value={{
                pokemons,
                loading,
                totalOfPokemons,
                lastLoadedDate,
                loadPokemons,
            }}
        >
            {children}
        </PokemonContext.Provider>
    );
};

export default PokemonProvider;
