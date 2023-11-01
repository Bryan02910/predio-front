import React, { useState, useEffect } from 'react'
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider, MenuItem, Select, InputLabel  } from '@mui/material'
import ApiRequest from '../../../helpers/axiosInstances'
import { AddOutlined, EditOutlined, DeleteOutline } from '@mui/icons-material'
import Page from '../../common/Page'
import ToastAutoHide from '../../common/ToastAutoHide'
import CommonTable from '../../common/CommonTable'

const Usuarios = () => {
	const initialState = {
	avatar: 'https://imgur.com/gallery/QjkTAV2',
	username: "",
	user: "",
	password: "",
	correo: "",
	carnet: "",
	rol: "",
	dpi: "",
	telefono: "",
	direccion: "",
};

	const [usuariosList, setUsuariosList] = useState([])
	const [body, setBody] = useState(initialState)
	const [openDialog, setOpenDialog] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null })
	const [idDelete, setIdDelete] = useState(null)
	const [openDialogDelete, setOpenDialogDelete] = useState(false)
	const init = async () => {
		const { data } = await ApiRequest().get('/usuarios')
		setUsuariosList(data)
	}

	const columns = [
	{ field: 'id', headerName: 'ID', width: 120 },
	{
		field: 'avatar',
		headerName: 'Avatar',
		width: 200,
		renderCell: (params) => (
			<Avatar src={params.value} />
		)
	},
	{ field: 'username', headerName: 'Nombre de usuario', width: 220 },
	{ field: 'user', headerName: 'Nombre', width: 220 },
	{ field: 'password', headerName: 'Password', width: 220 },
	{ field: 'correo', headerName: 'Correo', width: 220 },
	{ field: 'carnet', headerName: 'Carnet', width: 220 },
	{ field: 'rol', headerName: 'Rol', width: 220 },
	{ field: 'dpi', headerName: 'DPI', width: 220 },
	{ field: 'telefono', headerName: 'Teléfono', width: 220 },
	{ field: 'direccion', headerName: 'Dirección', width: 220 },
	{
		field: '',
		headerName: 'Acciones',
		width: 200,
		renderCell: (params) => (
			<Stack direction='row' divider={<Divider orientation="vertical" flexItem />} justifyContent="center" alignItems="center" spacing={2}>
				<IconButton size='small' onClick={() => {
					setIsEdit(true);
					setBody(params.row);
					handleDialog();
				}}>
					<EditOutlined />
				</IconButton>
				<IconButton size='small' onClick={() => {
					handleDialogDelete()
					setIdDelete(params.id)
				}}>
					<DeleteOutline />
				</IconButton>
			</Stack>
		)
	}
];

	const onDelete = async () => {
		try {
			const { data } = await ApiRequest().post('/eliminar', { id: idDelete })
			setMensaje({
				ident: new Date().getTime(),
				message: data.message,
				type: 'success'
			})
			handleDialogDelete()
			init()
		} catch ({ response }) {
			setMensaje({
				ident: new Date().getTime(),
				message: response.data.sqlMessage,
				type: 'error'
			})
		}
	}

	const handleDialog = () => {
		setOpenDialog(prev => !prev)
		//setIsEdit(false); 
	}

	const handleDialogDelete = () => {
		setOpenDialogDelete(prev => !prev)
	}

	const onChange = ({ target }) => {
		const { name, value } = target
		setBody({
			...body,
			[name]: value
		})
	}

	const onSubmit = async () => {
		try {
			const { data } = await ApiRequest().post('/guardar', body)
			handleDialog()
			setBody(initialState)
			setMensaje({
				ident: new Date().getTime(),
				message: data.message,
				type: 'success'
			})
			init()
			setIsEdit(false)
		} catch ({ response }) {
			setMensaje({
				ident: new Date().getTime(),
				message: response.data.sqlMessage,
				type: 'error'
			})
		}
	}

	const onEdit = async () => {
		try {
			const { data } = await ApiRequest().post('/editar', body)
			handleDialog()
			setBody(initialState)
			setMensaje({
				ident: new Date().getTime(),
				message: data.message,
				type: 'success'
			})
			init()
		} catch ({ response }) {
			setMensaje({
				ident: new Date().getTime(),
				message: response.data.sqlMessage,
				type: 'error'
			})
		}
	}

	useEffect(init, [])

	return (
		<>

				<Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
				<DialogTitle>
					¿Desea eliminar este usuario?
				</DialogTitle>
				<DialogContent>
					<Typography variant='h5'>Esta acción es irreversible</Typography>
				</DialogContent>
				<DialogActions>
					<Button variant='text' color='primary' onClick={handleDialogDelete}>Cancelar</Button>
					<Button variant='contained' color='primary' onClick={onDelete}>Aceptar</Button>
				</DialogActions>
			</Dialog>
			
			<Dialog maxWidth='xs' open={openDialog} onClose={handleDialog}>
				<DialogTitle>
					{isEdit ? 'Editar Usuario' : 'Crear Usuario'}
				</DialogTitle>
				<DialogContent>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<Avatar src={body.avatar} />
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='username'
								value={body.username}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Nombre de usuario'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='user'
								value={body.user}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Nombre'
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='password'
								value={body.password}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Contraseña'
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='correo'
								value={body.correo}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Correo'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='carnet'
								value={body.carnet}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Carnet'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
						<InputLabel htmlFor="rol">Rol del usuario</InputLabel>
  						<Select
    						name='rol'
							value={body.rol}
							onChange={onChange}
							variant='outlined'
							size='small'
							color='primary'
							fullWidth
							placeholderlabel='ROL'
							>
								<MenuItem value="ADMIN">ADMIN</MenuItem>
								<MenuItem value="Vendedor">Vendedor</MenuItem>
							</Select>
							</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='dpi'
								value={body.dpi}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='DPI'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='telefono'
								value={body.telefono}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Teléfono'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='direccion'
								value={body.direccion}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Dirección'
							/>
							
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant='text' color='primary' onClick={handleDialog}>cancelar</Button>
					<Button variant='contained' color='primary' onClick={isEdit ? () => onEdit() : () => onSubmit()}>guardar</Button>
				</DialogActions>
			</Dialog>
			<Page title="Predio| Usuarios">
				<ToastAutoHide message={mensaje} />
				<Container maxWidth='lg'>
					<Box sx={{ pb: 5 }}>
						<Typography variant="h5">Lista de usuarios</Typography>
					</Box>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={4}>
						<Button onClick={() => {setIsEdit(false); handleDialog(); setBody(initialState);}} startIcon={<AddOutlined />} variant='contained' color='primary'> Nuevo</Button>
						</Grid>
						<Grid item xs={12} sm={8} />
						<Grid item xs={12} sm={12}>
							<CommonTable data={usuariosList} columns={columns} />
						</Grid>
					</Grid>
				</Container>
			</Page>
		</>
	)
}

export default Usuarios

