import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary_light: {
			main: 'var(--primary-light)',
			contrastText: 'var(--text-primary-invert-main)'
		},
		primary_main: {
			main: 'var(--primary-main)',
			contrastText: 'var(--text-primary-invert-main)'
		},
		tertiary_main: {
			main: 'var(--tertiary-main)',
			contrastText: 'var(--text-primary-main)'
		}
	}
})

export default theme;