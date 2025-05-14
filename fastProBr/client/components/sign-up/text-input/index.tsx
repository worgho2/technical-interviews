import { TextField, Typography } from '@mui/material';
import { ForwardRefExoticComponent } from 'react';

interface TextInputProps {
    name: string;
    value: string;
    type: React.HTMLInputTypeAttribute;
    mask?: ForwardRefExoticComponent<any>;
    onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = (props) => {
    const { name, value, onChange, mask, type } = props;
    return (
        <>
            <Typography variant="body1" align="left">
                {name}
            </Typography>
            <TextField
                hiddenLabel
                fullWidth
                type={type}
                size="small"
                variant="outlined"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                sx={{
                    marginBottom: '0.5rem',
                    border: '1px solid #555',
                    borderRadius: '5px',
                }}
                InputProps={{
                    inputComponent: mask !== undefined ? mask : undefined,
                }}
            />
        </>
    );
};

export default TextInput;
