import NextAuth, { AuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createHash } from 'crypto';
import * as orbitApi from '../../../services/orbit-api';

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            type: 'credentials',
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                },
                password: {
                    label: 'Password',
                    type: 'password',
                },
            },
            async authorize(credentials, req) {
                try {
                    if (credentials === undefined) {
                        throw new Error('credentials object is undefined');
                    }

                    if (credentials.email === '' || credentials.password === '') {
                        throw new Error('empty credentials not allowed');
                    }

                    const hashedPassword = createHash('sha256').update(credentials.password).digest('base64');
                    const signInData = await orbitApi.signIn({ email: credentials.email, hashedPassword });

                    return {
                        id: signInData.id,
                        accessToken: signInData.token,
                    };
                } catch (error) {
                    console.log(error instanceof Error ? error.message : 'Unknown error');
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt(params) {
            const token = params.token;
            const user = params.user as User & { accessToken: string };

            if (params.user === undefined) {
                return token;
            }

            const orbitUser = await orbitApi.getUser(user.accessToken);

            return {
                ...token,
                accessToken: user.accessToken,
                name: orbitUser.name,
                email: orbitUser.email,
                phone: orbitUser.phone,
            };
        },
        async session(params) {
            const { token, session } = params;

            return {
                ...session,
                accessToken: token.accessToken,
                user: {
                    ...session.user,
                    phone: token.phone,
                },
            };
        },
    },
    theme: {
        brandColor: '#196EC1',
        logo: '/brand.svg',
        buttonText: '#F4F4F4',
        colorScheme: 'dark',
    },
};

export default NextAuth(authOptions);
