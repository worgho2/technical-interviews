import axios, { AxiosError } from 'axios';
import {
    OrbitAPIError,
    OrbitAPIGetUserResponse,
    OrbitAPIListPokemonsRequestData,
    OrbitAPIListPokemonsResponse,
    OrbitAPISignInRequestData,
    OrbitAPISignInResponse,
    OrbitAPISignUpRequestData,
} from '../models/orbit-api';

function getError(error: unknown): Error {
    if (error instanceof AxiosError<{ message: string }, { message: string }>) {
        let code = error.response?.status || 500;
        let message = `Orbit API Error ${code}: ${error.response?.data.message || error.message}`;

        if (error.code === 'ERR_NETWORK') {
            message = 'Server is not responding. Please try again later';
        }

        if (code === 400) {
            message = `Invalid request: ${error.response?.data.message || error.message}`;
        }

        if (code === 403) {
            message = 'Token expired, please sign in again';
        }

        return new OrbitAPIError(message);
    } else if (error instanceof OrbitAPIError) {
        return error;
    }

    return new OrbitAPIError(
        `Unhandled error. Please contact admin ${error instanceof Error ? error.message : JSON.stringify(error)}}`,
    );
}

function buildEndpointURL(path: string): URL {
    const endpointUrl = process.env.NEXT_PUBLIC_ORBIT_API_ENDPOINT;

    if (endpointUrl === undefined) {
        throw new OrbitAPIError('NEXT_PUBLIC_ORBIT_API_ENDPOINT is undefined');
    }

    const baseUrl = new URL(endpointUrl).origin;
    return new URL(path, baseUrl);
}

export async function signIn(data: OrbitAPISignInRequestData): Promise<OrbitAPISignInResponse> {
    try {
        const url = buildEndpointURL('/api/auth/signin');
        const response = await axios.post<OrbitAPISignInResponse>(url.href, data);
        return response.data;
    } catch (error) {
        throw getError(error);
    }
}

export async function signUp(data: OrbitAPISignUpRequestData): Promise<OrbitAPISignInResponse> {
    try {
        const url = buildEndpointURL('/api/auth/signup');
        const response = await axios.post<OrbitAPISignInResponse>(url.href, data);
        return response.data;
    } catch (error) {
        throw getError(error);
    }
}

export async function getUser(accessToken: string): Promise<OrbitAPIGetUserResponse> {
    try {
        const url = buildEndpointURL('/api/users/me');

        const response = await axios.get<OrbitAPIGetUserResponse>(url.href, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        throw getError(error);
    }
}

export async function listPokemons(
    accessToken: string,
    data: OrbitAPIListPokemonsRequestData,
): Promise<OrbitAPIListPokemonsResponse> {
    try {
        const url = buildEndpointURL('/api/pokemons');

        url.searchParams.append('limit', `${data.limit}`);

        if (data.offset !== undefined) {
            url.searchParams.append('offset', `${data.offset}`);
        }

        const response = await axios.get(url.href, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return response.data;
    } catch (error) {
        throw getError(error);
    }
}
