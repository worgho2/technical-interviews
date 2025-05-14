import axios, { AxiosError } from 'axios';
import {
    FPBRAPIError,
    FPBRAPIGetUserResponse,
    FPBRAPIListPokemonsRequestData,
    FPBRAPIListPokemonsResponse,
    FPBRAPISignInRequestData,
    FPBRAPISignInResponse,
    FPBRAPISignUpRequestData,
} from '../models/fpbr-api';

function getError(error: unknown): Error {
    if (error instanceof AxiosError<{ message: string }, { message: string }>) {
        let code = error.response?.status || 500;
        let message = `FPBR API Error ${code}: ${error.response?.data.message || error.message}`;

        if (error.code === 'ERR_NETWORK') {
            message = 'Server is not responding. Please try again later';
        }

        if (code === 400) {
            message = `Invalid request: ${error.response?.data.message || error.message}`;
        }

        if (code === 403) {
            message = 'Token expired, please sign in again';
        }

        return new FPBRAPIError(message);
    } else if (error instanceof FPBRAPIError) {
        return error;
    }

    return new FPBRAPIError(
        `Unhandled error. Please contact admin ${error instanceof Error ? error.message : JSON.stringify(error)}}`,
    );
}

function buildEndpointURL(path: string): URL {
    const endpointUrl = process.env.NEXT_PUBLIC_FPBR_API_ENDPOINT;

    if (endpointUrl === undefined) {
        throw new FPBRAPIError('NEXT_PUBLIC_FPBR_API_ENDPOINT is undefined');
    }

    const baseUrl = new URL(endpointUrl).origin;
    return new URL(path, baseUrl);
}

export async function signIn(data: FPBRAPISignInRequestData): Promise<FPBRAPISignInResponse> {
    try {
        const url = buildEndpointURL('/api/auth/signin');
        const response = await axios.post<FPBRAPISignInResponse>(url.href, data);
        return response.data;
    } catch (error) {
        throw getError(error);
    }
}

export async function signUp(data: FPBRAPISignUpRequestData): Promise<FPBRAPISignInResponse> {
    try {
        const url = buildEndpointURL('/api/auth/signup');
        const response = await axios.post<FPBRAPISignInResponse>(url.href, data);
        return response.data;
    } catch (error) {
        throw getError(error);
    }
}

export async function getUser(accessToken: string): Promise<FPBRAPIGetUserResponse> {
    try {
        const url = buildEndpointURL('/api/users/me');

        const response = await axios.get<FPBRAPIGetUserResponse>(url.href, {
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
    data: FPBRAPIListPokemonsRequestData,
): Promise<FPBRAPIListPokemonsResponse> {
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
