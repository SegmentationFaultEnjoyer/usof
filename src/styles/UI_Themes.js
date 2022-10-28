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
		secondary_light: {
			light: 'var(--secondary-light)',
			main: 'var(--secondary-main)',
			neutral: 'var(--secondary-light)',
			darker: 'var(--secondary-dark)',
			contrastText: 'var(--text-primary-invert-main)'
		},
		secondary_main: {
			light: 'var(--secondary-main)',
			main: 'var(--secondary-dark)',
			contrastText: 'var(--text-primary-invert-main)'
		},
		tertiary_main: {
			main: 'var(--tertiary-main)',
			contrastText: 'var(--text-primary-main)'
		},
		error_main: {
			main: 'var(--error-main)',
			contrastText: 'var(--text-primary-main)'
		},
		error_light: {
			main: 'var(--error-light)',
			contrastText: 'var(--text-primary-main)'
		}
	}
})

export default theme;