import './Select.scss'

import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';

import { useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
    disableScrollLock: true
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

//choices must be in JSON API format
export default function MultipleSelect({ label, choices, picked, setPicked }) {
    const theme = useTheme();

    const onChange = (e) => {
        const { target: { value } } = e
        setPicked(typeof value === 'string' ? value.split(',') : value)
    }

    return (
        <FormControl sx={{ m: 2, width: '60%', margin: 0 }}>
            <InputLabel 
                id={`${label}-label`} 
                color="primary_light" 
                sx={{ minWidth: 300}}
                required> { label }</InputLabel>
            <Select
                className='select__legend'
                required
                color="primary_light"
                labelId={`${label}-label`}
                multiple
                value={ picked }
                onChange={ onChange }
                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                            <Chip 
                                key={value} 
                                label={value} />
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {choices.map((choice) => (
                    <MenuItem
                        key={choice.id}
                        value={choice.attributes.title}
                        style={getStyles(choice.attributes.title, picked, theme)}
                    >
                        {choice.attributes.title}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}