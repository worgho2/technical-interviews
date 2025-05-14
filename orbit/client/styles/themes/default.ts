import { ThemeOptions } from '@mui/material/styles';

export const defaultThemeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        text: {
            primary: '#FFFFFF',
            secondary: '#797979',
        },
        primary: {
            main: '#196EC1',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#F8B20A',
        },
        success: {
            main: '#7FCD27',
        },
        info: {
            main: '#797979',
        },
        warning: {
            main: '#F8B20A',
        },
        error: {
            main: '#ED124D',
        },
        action: {
            disabled: '#F4F4F4',
        },
        background: {
            default: '#161B22',
            paper: '#0E1117',
        },
        divider: '#111111',
        common: {
            black: '#111111',
            white: '#FFFFFF',
        },
    },
};

export default defaultThemeOptions;
