import * as React from 'react';
import type { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { createEmotionCache } from '../utils/create-emotion-cache';
import { defaultThemeOptions } from '../styles/themes/default';
import '../styles/globals.css';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { SnackbarProvider } from 'notistack';

const clientSideEmotionCache = createEmotionCache();
const lightTheme = createTheme(defaultThemeOptions);

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
    session: Session;
}

const MyApp: React.FC<MyAppProps> = (props) => {
    const { Component, emotionCache = clientSideEmotionCache, session, pageProps } = props;

    return (
        <CacheProvider value={emotionCache}>
            <ThemeProvider theme={lightTheme}>
                <SessionProvider session={session}>
                    <SnackbarProvider maxSnack={4}>
                        <Head>
                            <title>Client</title>
                            <meta name="description" content="Client" />
                            <link rel="icon" href="/favicon.ico" />
                        </Head>
                        <CssBaseline />
                        <Component {...pageProps} />
                    </SnackbarProvider>
                </SessionProvider>
            </ThemeProvider>
        </CacheProvider>
    );
};

export default MyApp;
