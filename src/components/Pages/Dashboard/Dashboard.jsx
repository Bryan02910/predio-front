import React from 'react'
import { Box, Container, Typography, Grid } from '@mui/material'
import Page from '../../common/Page'

// ----------------------------------------------------------------------


const Dashboard = () => {

	return (
		<Page title="Predio| Dashboard">
			<Container maxWidth="xl">
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<Typography sx={{ mt: 3, fontWeight: 'bold' }} variant='h5'>Bienvenido a</Typography>
					<Typography sx={{ mt: 3, fontWeight: 'bold' }} variant='h2'>Predio Rodriguez</Typography>
				</Box>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={12}>
						<img src='https://images.vexels.com/media/users/3/224191/isolated/lists/a4932e65b882ecdd1f689ece00564b19-fast-speeding-car-logo.png' alt='...' style={{ position: 'absolute', width: '50%', height: 'auto', marginTop: 30 }} />
					</Grid>
				</Grid>
			</Container>
		</Page>
	)
}

export default Dashboard