import React from 'react';
import {
    AppBar,
    Avatar,
    Box,
    Button,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
} from '@mui/material';
import Image from 'next/image';
import { Call, Email, ExitToApp } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';

const MainAppBar: React.FC = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
    const menuOpen = Boolean(menuAnchorEl);

    const customSession = session as (Session & { user?: { phone?: string } }) | null;

    const email = customSession?.user?.email || 'Unknown';
    const name = customSession?.user?.name || 'Unknown';
    const phone = customSession?.user?.phone || 'Unknown';

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, background: '#0E1117' }}>
            <Toolbar sx={{ pl: { sm: 1.5 }, pr: { sm: 1.5 } }}>
                <Box component="div" sx={{ flex: '1 1 50%', paddingLeft: 1 }}>
                    <Image src="/brand.svg" alt="FastProBr Logo" height={40} width={160} priority />
                </Box>
                <Button color="inherit" onClick={(event) => setMenuAnchorEl(event.currentTarget)}>
                    <Typography variant="button" sx={{ paddingRight: 1 }} noWrap>
                        {name}
                    </Typography>
                    <Avatar
                        src={'https://picsum.photos/100'}
                        style={{
                            border: '3px solid #196EC1',
                        }}
                    />
                </Button>
                <Menu anchorEl={menuAnchorEl} open={menuOpen} onClose={() => setMenuAnchorEl(null)}>
                    <MenuItem disabled>
                        <ListItemIcon>
                            <Email htmlColor="#FFFFFF" />
                        </ListItemIcon>
                        <ListItemText>{email}</ListItemText>
                    </MenuItem>
                    <MenuItem disabled>
                        <ListItemIcon>
                            <Call htmlColor="#FFFFFF" />
                        </ListItemIcon>
                        <ListItemText>{phone}</ListItemText>
                    </MenuItem>

                    <MenuItem onClick={() => router.push('/api/auth/signout')}>
                        <ListItemIcon>
                            <ExitToApp htmlColor="#FFFFFF" />
                        </ListItemIcon>
                        <ListItemText>Sign out</ListItemText>
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default MainAppBar;
