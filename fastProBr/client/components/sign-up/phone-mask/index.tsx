import React from 'react';
import { IMaskInput } from 'react-imask';

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const PhoneMask = React.forwardRef<HTMLElement, CustomProps>(function PhoneMask(props, ref) {
    const { onChange, ...other } = props;
    return (
        <IMaskInput
            {...other}
            mask="+55 (##) # ####-####"
            definitions={{ '#': /[1-9]/ }}
            inputRef={ref as any}
            onAccept={(value: any) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    );
});

export default PhoneMask;
