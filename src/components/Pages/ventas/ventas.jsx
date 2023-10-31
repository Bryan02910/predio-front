import React, { useState, useEffect, useRef, Fragment} from 'react'
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider } from '@mui/material'
import ApiRequest from '../../../helpers/axiosInstances'
import { AddOutlined, EditOutlined, DeleteOutline } from '@mui/icons-material'
import Page from '../../common/Page'
import ToastAutoHide from '../../common/ToastAutoHide'
import CommonTable from '../../common/CommonTable'
import emailjs from '@emailjs/browser';
import pdf from './formulario.pdf';



import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


const Ventas = () => {
	const initialState = {
	nombre: "",
	correo: "",
	telefono: "",
	mensaje: "", 
	auto: "",
	id_marca:"",
	modelo:"",
	marca: "",
	fecha: "",
	hora: "",
	color:  "",
};

	const [usuariosList, setUsuariosList] = useState([])
	const [body, setBody] = useState(initialState)
	const [openDialog, setOpenDialog] = useState(false)
	const [isEdit, setIsEdit] = useState(false)
	const [mensaje, setMensaje] = useState({ ident: null, message: null, type: null })
	const [idDelete, setIdDelete] = useState(null)
	const [openDialogDelete, setOpenDialogDelete] = useState(false)
	const [selectedDate, setSelectedDate] = useState(null);
	const [pdfUrl, setPdfUrl] = useState('');
	const [pdfData, setPdfData] = useState(null);
	const handleDateChange = (date) => {
	  setSelectedDate(date);
	};
	const init = async () => {
		const { data } = await ApiRequest().get('/citas2')
		setUsuariosList(data)
	}

	const columns = [
		{ field: 'id', headerName: 'ID', width: 120 },
		{ field: 'nombre', headerName: 'Nombre de cliente', width: 220 },
		{ field: 'auto', headerName: 'Auto', width: 220 },
		{
			field: 'fecha',
			headerName: 'Fecha',
			width: 220,
			valueFormatter: (params) => {
			  const fechaCompleta = params.value; // Suponemos que params.value contiene la fecha y la hora
			  const fecha = new Date(fechaCompleta);
			  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
			  return fecha.toLocaleDateString('es-ES', options); // Ajusta 'es-ES' al idioma deseado
			},
		  },
		{ field: 'vehiculo_id', headerName: 'Vehículo ID', width: 120 },
		{ field: 'marca', headerName: 'Marca del Auto', width: 220 },
		{ field: 'modelo', headerName: 'Modelo del Auto', width: 220 },
		
		{
		  field: '',
		  headerName: 'Acciones',
		  width: 200,
		  renderCell: (params) => (
			<Stack direction='row' divider={<Divider orientation='vertical' flexItem />} justifyContent='center' alignItems='center' spacing={2}>
			  <IconButton size='small' onClick={() => {
				setIsEdit(true);
				setBody(params.row);
				//setOpenDialog(true);
			  }}>
				<EditOutlined />
			  </IconButton>
			  <IconButton size='small' onClick={() => {
				handleDialogDelete();
				setIdDelete(params.id);
			  }}>
				<DeleteOutline />
			  </IconButton>
			</Stack>
		  ),
		},
	  ];

const form = useRef();

  const sendEmail = async (e) => {

		try {

			e.preventDefault();
    		emailjs.sendForm('service_cvz0wu8', 'template_maipbes', form.current, 'mZIJiHooh3_oOUL7N')
      		.then((result) => {
          console.log(result.text);
      			}, (error) => {
          console.log(error.text);
      			});
	  const emptyBody = { nombre: '', correo: '', fecha: '', mensaje: '', color: '' }; // Reemplaza con los campos que necesites
  	  setBody(emptyBody); // Asume que setBody es una función para actualizar el estado de 'body'

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
  };
	
	  

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

	const fillPDF = async () => {
		try {
		  // Leer el archivo PDF
		  const pdfBytes = await fetch(pdf ).then((response) => response.arrayBuffer());
	
		  // Cargar el PDF
		  const pdfDoc = await PDFDocument.load(pdfBytes);
		  const form = pdfDoc.getForm();
	
		  const page = pdfDoc.getPages()[0];
		  // Obtener los campos de formulario por nombre
		  const nombreField = form.getField('Texto2');
		  const colorField = form.getField('Texto1');
	
		  // Llenar los campos del formulario
		  nombreField.setText(body.nombre);
		  colorField.setText(body.color);
	  

	
		  // Guardar el PDF llenado
		  const pdfBytesLleno = await pdfDoc.save();
	
		  // Convertir los bytes del PDF en un blob
		  const pdfBlob = new Blob([pdfBytesLleno], { type: 'application/pdf' });
	
		  // Crear una URL del blob
		  const pdfUrl = URL.createObjectURL(pdfBlob);
	
		  // Mostrar o descargar el PDF llenado
		  window.open(pdfUrl);
	
		  setPdfData(pdfBytesLleno);
		} catch (error) {
		  console.error('Error al llenar el formulario PDF', error);
		}
	  };
	

	
	

	useEffect(init, [])


	return (
		<>


  

				<Dialog maxWidth='xs' open={openDialogDelete} onClose={handleDialogDelete}>
				<DialogTitle>
					¿Desea eliminar este mensaje?
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
					{isEdit ? 'Crear cita' : 'Crear nueva cita (Oficina)'}
				</DialogTitle>
				<DialogContent>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12}>
							<TextField
								margin='normal'
								name='user_name'
								value={body.nombre}
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
								name='user_email'
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
								name='message'
								value={body.mensaje}
								onChange={onChange}
								variant='outlined'
								size='small'
								color='primary'
								fullWidth
								label='Mensaje'
							/>
							
						</Grid>
						
						
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button variant='text' color='primary' onClick={handleDialog}>cancelar</Button>
					<Button variant='contained' color='primary' onClick={isEdit ? () => sendEmail() : () => onSubmit()}>guardar</Button>
				</DialogActions>
			</Dialog>
			<Page title="Predio| Registro de ventas">
				<ToastAutoHide message={mensaje} />
				<Container maxWidth='lg'>
					<Box sx={{ pb: 5 }}>
						<Typography variant="h5">Registro de ventas</Typography>
					</Box>
					<Grid container spacing={2}>
						
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

export default Ventas

