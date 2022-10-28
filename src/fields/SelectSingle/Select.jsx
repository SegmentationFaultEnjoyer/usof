import { Select, InputLabel, MenuItem, FormControl } from '@mui/material'

export default function SelectSingle({ value, setValue, label, choices, size, variant }) {
    if(!size) size = 'small'
    if(!variant) variant = 'outlined'

    const handleChange = (e) => {
        setValue(e.target.value)
    }

    return (
        <FormControl sx={{ m: 1, minWidth: 120 }} size={ size }>
            <InputLabel 
                id="select-small" 
                color="primary_light">{ label }</InputLabel>
            <Select
                color="primary_light"
                labelId="select-small"
                id="select-small"
                value={ value }
                label="Age"
                variant={ variant }
                onChange={ handleChange }
            >
                { choices.map(choice => 
                    <MenuItem 
                        value={ choice }
                        key={ choice }> { choice }</MenuItem>)}
            </Select>
        </FormControl>
    )
}