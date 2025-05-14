import React from 'react';
import { Box, Button, Link, Paper, Typography } from '@mui/material';
import Image from 'next/image';
import PhoneMask from './phone-mask';
import { isValidEmail } from '../../utils/is-valid-email';
import { useSnackbar } from 'notistack';
import * as fpbrApi from '../../services/fpbr-api';
import { createSHA256Hash } from '../../utils/create-sha256-hash';
import { useRouter } from 'next/router';
import TextInput from './text-input';

const SignUp: React.FC = () => {
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const [name, setName] = React.useState<string>('');
    const [email, setEmail] = React.useState<string>('');
    const [phone, setPhone] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleCreateAccount = async () => {
        setLoading(true);
        const errors: string[] = [];

        if (name.length === 0) {
            errors.push('Name is required');
        }

        if (!isValidEmail(email)) {
            errors.push('Invalid email');
        }

        if (phone.length !== 20) {
            errors.push('Incomplete phone number');
        }

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }

        if (errors.length > 0) {
            errors.forEach((error) => {
                enqueueSnackbar(error, {
                    preventDuplicate: true,
                    persist: false,
                    variant: 'error',
                });
            });
            setLoading(false);
        } else {
            try {
                await fpbrApi.signUp({
                    name,
                    email,
                    phone,
                    hashedPassword: createSHA256Hash(password),
                });

                enqueueSnackbar('Account created!', {
                    preventDuplicate: true,
                    persist: false,
                    autoHideDuration: 1000,
                    variant: 'success',
                    onClose: () => {
                        setLoading(false);
                        router.push('/api/auth/signin');
                    },
                });
            } catch (error) {
                const message = error instanceof Error ? error.message : 'An error occurred';

                enqueueSnackbar(message, {
                    preventDuplicate: true,
                    persist: false,
                    variant: 'error',
                });

                setLoading(false);
            }
        }
    };

    return (
        <Box
            component="div"
            sx={{
                display: 'grid',
                height: '100%',
                width: '100%',
                margin: '0',
                padding: '0',
                placeItems: 'center',
                position: 'absolute',
            }}
        >
            <Paper
                sx={{
                    padding: '20px 50px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '30px',
                }}
            >
                <Box
                    component="div"
                    sx={{
                        maxWidth: '300px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Image src={'/brand.svg'} height={40} width={160} alt="Logo" />
                    <Typography
                        variant="h4"
                        sx={{
                            marginTop: '1rem',
                            marginBottom: '1rem',
                        }}
                    >
                        Create Account
                    </Typography>
                    <Box
                        component="div"
                        sx={{
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <TextInput type="text" name="Name" value={name} onChange={setName} />
                        <TextInput type="email" name="Email" value={email} onChange={setEmail} />
                        <TextInput type="tel" name="Phone" value={phone} onChange={setPhone} mask={PhoneMask} />
                        <TextInput type="password" name="Password" value={password} onChange={setPassword} />

                        <Button
                            disabled={loading}
                            variant="contained"
                            size="large"
                            onClick={handleCreateAccount}
                            sx={{
                                marginTop: '1rem',
                                marginBottom: '2rem',
                                width: '300px',
                                height: '60px',
                            }}
                        >
                            Create Account
                        </Button>
                    </Box>
                    <Typography variant="body2" color="text.secondary" align="center">
                        Already have an account? <Link href="/api/auth/signin">Sign In</Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default SignUp;
