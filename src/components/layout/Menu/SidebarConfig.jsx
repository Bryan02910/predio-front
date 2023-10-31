import React from 'react'
import { PersonOutlined, HomeOutlined, DriveEtaOutlined, Copyright,MergeType, EventNote, Toll } from '@mui/icons-material'

const sidebarConfig = [
	{
		title: 'inicio',
		path: '/app',
		icon: <HomeOutlined />
	},
	{
		title: 'usuarios',
		path: '/app/usuarios',
		icon: <PersonOutlined />
	},
	{
		title: 'vehiculos',
		path: '/app/vehiculos',
		icon: <DriveEtaOutlined/>
	},
	{
		title: 'marca de vehículo',
		path: '/app/marca',
		icon: <Copyright/>
	},
	{
		title: 'tipo de vehículo',
		path: '/app/tipo',
		icon: <MergeType/>
	},
	{
		title: 'citas',
		path: '/app/citas',
		icon: <Copyright/>
	},
	{
		title: 'citas programadas',
		path: '/app/registro',
		icon: <EventNote/>
	},
	{
		title: 'Registro de ventas',
		path: '/app/ventas',
		icon: <Toll/>
	}
]

export default sidebarConfig