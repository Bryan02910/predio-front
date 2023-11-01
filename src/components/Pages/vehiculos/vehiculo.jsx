import React, { useState, useEffect, useRef } from 'react'
import { TextField, Dialog, DialogTitle, DialogContent, DialogActions, Container, Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider, MenuItem, Select, InputLabel  } from '@mui/material'
import ApiRequest from '../../../helpers/axiosInstances'
import { AddOutlined, EditOutlined, DeleteOutline} from '@mui/icons-material'
import Page from '../../common/Page'
import ToastAutoHide from '../../common/ToastAutoHide'
import CommonTable from '../../common/CommonTable'
import {  saveFile, deleteFile } from "./firebase/firebase";

const Vehiculos = () => {
	const initialState = {
		linea: "",
		marca: "",
		modelo: "",
		ano: 0,
		kilometraje: 0,
		combustible: "",
		color_exterior: "",
		color_interior: "",
		numero_matricula: "",
		estado: "",
		transmision: "",
		numero_motor: "",
		chasis: "",
		precio_venta: 0.0,
		url: "",
	};
	

	const [usuariosList, setUsuariosList] = useState([])
	const [body, setBody] = useState(initialState)
	const [openDialog, setOpenDialog] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null })
	const [idDelete, setIdDelete] = useState(null)
	const [openDialogDelete, setOpenDialogDelete] = useState(false)
	const currentYear = new Date().getFullYear();
	const years = Array.from({ length: 30 }, (_, index) => currentYear - index);
	const [selectedImage, setSelectedImage] = useState("");
	//
	const [marcas, setMarcas] = useState([]);
	const [linea, setLinea] = useState([]);
	//const [imageUpload , setImageUpload] = useState("");
	


	const init = async () => {
		const { data } = await ApiRequest().get('/vehiculos')
		setUsuariosList(data)
	}

	const columns = [
	{ field: 'id', headerName: 'ID', width: 120 },
	{
		field: 'url',
		headerName: 'Foto',
		width: 200,
		renderCell: (params) => (
			<Avatar src={params.value} />
		)
	},
	{ field: 'linea', headerName: 'Línea', width: 220 },
    { field: 'marca', headerName: 'Marca', width: 220 },
    { field: 'modelo', headerName: 'Modelo', width: 220 },
    { field: 'ano', headerName: 'Año', width: 220 },
    { field: 'kilometraje', headerName: 'Kilometraje', width: 220 },
    { field: 'combustible', headerName: 'Combustible', width: 220 },
    { field: 'color_exterior', headerName: 'Color Exterior', width: 220 },
    { field: 'color_interior', headerName: 'Color Interior', width: 220 },
    { field: 'numero_matricula', headerName: 'Número de Matrícula', width: 220 },
    { field: 'estado', headerName: 'Estado', width: 220 },
    { field: 'transmision', headerName: 'Transmisión', width: 220 },
    { field: 'numero_motor', headerName: 'Número de Motor', width: 220 },
    { field: 'chasis', headerName: 'Chasis', width: 220 },
    { field: 'precio_venta', headerName: 'Precio de Venta', width: 220 },

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


		const fetchMarcas = async () => {
			try {
			const response = await ApiRequest().get('/marca/select'); // Replace with your actual API endpoint.
			setMarcas(response.data);
			} catch (error) {
			console.error('Error fetching marca data:', error);
			}
		};

		useEffect(() => {
			fetchMarcas(); // Fetch marca options when the component mounts.
			init();
		}, []);

		const fetchLinea = async () => {
			try {
			const response = await ApiRequest().get('/tiposS'); // Replace with your actual API endpoint.
			setLinea(response.data);
			} catch (error) {
			console.error('Error fetching marca data:', error);
			}
		};

		useEffect(() => {
			fetchLinea(); // Fetch marca options when the component mounts.
			init();
		}, []);

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setSelectedImage(file);
  			};
			
			//const imagePath = body.url;
			const onDelete = async (id,imagePath) => {
				try {
				  const imagePath  = body.url; // Asegúrate de obtener la ruta correcta de la imagen
				  const { data } = await ApiRequest().post('eliminar/vehiculo', { id: idDelete });
				  if (imagePath ) {
					await deleteFile(imagePath ); // Elimina la imagen utilizando la ruta correcta
				  }
				  setMensaje({
					ident: new Date().getTime(),
					message: data.message,
					type: 'success'
				  });
				  handleDialogDelete();
				  init();
				} catch ({ response }) {
				  setMensaje({
					ident: new Date().getTime(),
					message: response.data.sqlMessage,
					type: 'error'
				  });
				}
			  };
			  
	const handleDialog = () => {
		setOpenDialog(prev => !prev)
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
		if (!body.linea || !body.marca || !body.modelo || !body.ano || !body.kilometraje) {
			setMensaje({
			  ident: new Date().getTime(),
			  message: 'Todos los campos marcados son obligatorios.',
			  type: 'error',
			});
			return;
		  }
	  
		  try {
			if (selectedImage) {
				const imageUrl = await saveFile(selectedImage);
				body.url = imageUrl;
				
			  }
		  
			  const response = await ApiRequest().post('/guardar/vehiculo', body);
		  
			  if (response && response.data) {
				// The response and data properties are defined
				handleDialog();
				setBody(initialState);
				setSelectedImage(null);
				setMensaje({
				  ident: new Date().getTime(),
				  message: response.data.message,
				  type: 'success',
				});
				init();
				setIsEdit(false);
			  } else {
				// Handle the case where response or response.data is undefined
				console.error('Invalid response:', response);
				setMensaje({
				  ident: new Date().getTime(),
				  message: 'Invalid response from the server.',
				  type: 'error',
				});
			  }
		  } catch (error) {
			console.error('Error:', error);
			setMensaje({
			  ident: new Date().getTime(),
			  message: 'An error occurred while processing your request.',
			  type: 'error',
			});
		  }

	  };
	  
	  

	const onEdit = async () => {
		try {
			const { data } = await ApiRequest().post('editar/vehiculo', body)
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
					¿Desea eliminar este vehículo?
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
					{isEdit ? 'Editar vehículo' : 'Nuevo vehículo'}
				</DialogTitle>
				<DialogContent>
				<Grid>
				<Grid item xs={12} sm={12}>
							<InputLabel htmlFor="linea">Línea</InputLabel>
							<Select
							name="linea"
							value={body.linea}
							onChange={onChange}
							variant="outlined"
							size="small"
							color="primary"
							fullWidth
							>
							{linea.map((linea) => (
								<MenuItem key={linea} value={linea.linea}>
								{linea.linea} {/* Adjust this according to your API response */}
								</MenuItem>
							))}
							</Select>
						</Grid>
						<Grid item xs={12} sm={12}>
							<InputLabel htmlFor="marca">Marca</InputLabel>
							<Select
							name="marca"
							value={body.marca}
							onChange={onChange}
							variant="outlined"
							size="small"
							color="primary"
							fullWidth
							>
							{marcas.map((marca) => (
								<MenuItem key={marca.marca} value={marca.marca}>
								{marca.marca} {/* Adjust this according to your API response */}
								</MenuItem>
							))}
							</Select>
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='modelo'
								value={body.modelo}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Modelo'
							/>
						</Grid>
						<Grid item xs={12} sm={12}>
						<InputLabel htmlFor="ano">Año</InputLabel>
  						<Select
    						name='ano'
    						value={body.ano}
    						onChange={onChange}
    						variant='outlined'
    						size='small'
    						color='primary'
    						fullWidth
    						label='Año'
  							>
    						{years.map((year) => (
      						<MenuItem key={year} value={year}>
        					{year}
      						</MenuItem>
    						))}
 							</Select>
							</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='kilometraje'
								value={body.kilometraje}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Kilometraje'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
						<InputLabel htmlFor="combustible">Combustible</InputLabel>
  						<Select
    						name='combustible'
							value={body.combustible}
							onChange={onChange}
							variant='outlined'
							size='small'
							color='primary'
							fullWidth
							placeholderlabel='Combustible'
							>
								<MenuItem value="Diésel">Diésel</MenuItem>
								<MenuItem value="Gasolina">Gasolina</MenuItem>
								<MenuItem value="Híbridos">Híbridos</MenuItem>
								<MenuItem value="Eléctrico">Eléctrico</MenuItem>
							</Select>
							</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='color_exterior'
								value={body.color_exterior}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Color exterior'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='color_interior'
								value={body.color_interior}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Color interior'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='numero_matricula'
								value={body.numero_matricula}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Número de matricula'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
						<InputLabel htmlFor="estado">Estado</InputLabel>
  						<Select
    						name='estado'
							value={body.estado}
							onChange={onChange}
							variant='outlined'
							size='small'
							color='primary'
							fullWidth
							placeholderlabel='Combustible'
							>
								<MenuItem value="Disponible">Disponible</MenuItem>
								<MenuItem value="Taller">Taller</MenuItem>
					
							</Select>
							</Grid>
							<Grid item xs={12} sm={12}>
						<InputLabel htmlFor="trasmision">Trasmisión</InputLabel>
  						<Select
    						name='transmision'
							value={body.transmision}
							onChange={onChange}
							variant='outlined'
							size='small'
							color='primary'
							fullWidth
							placeholderlabel='Combustible'
							>
								<MenuItem value="Manual">Manual</MenuItem>
								<MenuItem value="Hidraulica">Hidraulica</MenuItem>
								<MenuItem value="Hibrida">Hibrida</MenuItem>
								<MenuItem value="Electrica">Electrica</MenuItem>
							</Select>
							</Grid>
							<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='numero_motor'
								value={body.numero_motor}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Número de motor'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='chasis'
								value={body.chasis}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Número de chasis'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='precio_venta'
								value={body.precio_venta}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Precio de venta'
							/>
							
						</Grid>
						<Grid item xs={12} sm={12}>
  						<input type="file" accept="image/*" onChange={handleImageChange} />
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant='text' color='primary' onClick={handleDialog}>cancelar</Button>
					<Button variant='contained' color='primary' onClick={isEdit ? () => onEdit() : () => onSubmit()}>guardar</Button>
				</DialogActions>
			</Dialog>
			<Page title="Predio| Vehículos">
				<ToastAutoHide message={mensaje} />
				<Container maxWidth='lg'>
					<Box sx={{ pb: 5 }}>
						<Typography variant="h5">Lista de vehículos</Typography>
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

export default Vehiculos

