import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary_light: {
			main: 'var(--primary-light)',
			contrastText: 'var(--text-primary-invert-main)'
		}
	}
})

export default theme;