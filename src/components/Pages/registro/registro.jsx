import React, { useState, useEffect, useRef, Fragment} from 'react'
import { TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, Typography, Grid, Box, Button, Stack, Avatar, IconButton, Divider } from '@mui/material'
import ApiRequest from '../../../helpers/axiosInstances'
import { AddOutlined, EditOutlined, DeleteOutline, Toll } from '@mui/icons-material'
import Page from '../../common/Page'
import ToastAutoHide from '../../common/ToastAutoHide'
import CommonTable from '../../common/CommonTable'
import emailjs from '@emailjs/browser';
import pdf from './formulario.pdf'


import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';


const Registro = () => {
	const initialState = {
	nombre: "",
	correo: "",
	telefono: "",
	mensaje: "", 
	auto: "",
	modelo:"",
	color_exterior: "",
	numero_matricula: "",
	numero_motor: "",
	chasis: "",
	marca: "",
	fecha: "",
	hora: "",
	vehiculo_id: "",
	dpi: "",
	domicilio: "",
	linea: "",
	extend: "",
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
	const handleDateChange = (date) => {
		const formatDate = (date) => {
			const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
			return new Date(date).toLocaleDateString('es-ES', options);
		  };
	  setSelectedDate(date);
	};
	const init = async () => {
		const { data } = await ApiRequest().get('/reg')
		setUsuariosList(data)
	}

	const columns = [
		{ field: 'id', headerName: 'ID', width: 120 },
		{ field: 'nombre', headerName: 'Nombre de cliente', width: 220 },
		{ field: 'correo', headerName: 'Mail', width: 220 },
		{ field: 'telefono', headerName: 'Télefono', width: 220 },
		{ field: 'mensaje', headerName: 'Mensaje', width: 220 },
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
		{ field: 'hora', headerName: 'Hora', width: 220 },
		{ field: 'vehiculo_id', headerName: 'Vehículo ID', width: 120 },
		{ field: 'marca', headerName: 'Marca del Auto', width: 220 },
		{ field: 'linea', headerName: 'Línea del Auto', width: 220 },
		{ field: 'modelo', headerName: 'Modelo del Auto', width: 220 },
		{ field: 'color_exterior', headerName: 'color', width: 220 },
		{ field: 'numero_matricula', headerName: 'Matricula', width: 220 },
		{ field: 'numero_motor', headerName: 'Número de motor', width: 220 },
		{ field: 'chasis', headerName: 'Número de chasis', width: 220 },
		{
		  field: '',
		  headerName: 'Acciones',
		  width: 200,
		  renderCell: (params) => (
			<Stack direction='row' divider={<Divider orientation='vertical' flexItem />} justifyContent='center' alignItems='center' spacing={2}>
			  <IconButton size='small' onClick={() => {
				//setIsEdit(true);
				setBody(params.row);
				//setOpenDialog(true);
			  }}>
				<EditOutlined />
			  </IconButton>
			  <IconButton size='small' onClick={() => {
				handleDialogDelete();
				setIdDelete(params.id);
			  }}>
				<Toll/>
			  </IconButton>
			</Stack>
		  ),
		},
	  ];

const form = useRef();

const sendEmail = async (e) => {

	try {

		e.preventDefault();
		emailjs.sendForm('service', 'template', form.current, 'mZIJiHooh')
		  .then((result) => {
	  console.log(result.text);
			  }, (error) => {
	  console.log(error.text);
			  });
  const emptyBody = { nombre: '', correo: '', fecha: '', mensaje: '', color: '' }; // Reemplaza con los campos que necesites
	setBody(emptyBody); // Asume que setBody es una función para actualizar el estado de 'body'

		const { data } = await ApiRequest().post('citas/crearV', body)
		//handleDialog()
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
			const { data } = await ApiRequest().post('citas/crearV', body)
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
		  const fechaField = form.getField('Texto3');
		  const marcaField = form.getField('Texto4');
		  const lineaField = form.getField('Texto5');
		  const modeloField = form.getField('Texto6');
		  const matriField = form.getField('Texto7');
		  const motorField = form.getField('Texto8');
		  const chasisField = form.getField('Texto9');
		  const dpiField = form.getField('Texto10');
		  const exField = form.getField('Texto11');
		  const telField = form.getField('Texto12');
		  const domField = form.getField('Texto13');
		  const txt14Field = form.getField('Texto14');
		  const txt15Field = form.getField('Texto15');
		  const txt16Field = form.getField('Texto16');
		  const txt17Field = form.getField('Texto17');
		  const txt18Field = form.getField('Texto18');
		  const txt19Field = form.getField('Texto19');
		  const txt20Field = form.getField('Texto20');
		  const txt21Field = form.getField('Texto21');
		  // Llenar los campos del formulario
		  nombreField.setText(body.nombre);
		  colorField.setText(body.color_exterior);
		  fechaField.setText(body.fecha);
		  marcaField.setText(body.marca);
		  lineaField.setText(body.linea);
		  modeloField.setText(body.modelo);
		  matriField.setText(body.numero_matricula);
		  motorField.setText(body.numero_motor);
		  chasisField.setText(body.chasis);
		  dpiField.setText(body.dpi);
		  exField.setText(body.extend);
		  telField.setText(body.telefono);
		  domField.setText(body.domicilio);
		  txt14Field.setText(body.marca);
		  txt15Field.setText(body.linea);
		  txt16Field.setText(body.modelo);
		  txt17Field.setText(body.color_exterior);
		  txt18Field.setText(body.numero_matricula);
		  txt19Field.setText(body.numero_motor);
		  txt20Field.setText(body.chasis);
		  txt21Field.setText(body.nombre);
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



  <Fragment>
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <a href="#!" className="navbar-brand">
          Crear cita
        </a>
      </div>
    </nav>

    <div className="container mt-5">
      <div className="card p-3">
        <div className="row">
          <div className="col-10">
            <form ref={form} onSubmit={sendEmail}>
			<h2>
          Datos cliente
        </h2>
		<input
				className="form-control mt-2"
				placeholder="ID"
				value={body.id}
				readOnly // Esto hace que el campo sea de solo lectura
				name="id"
				/>
              <textarea
                className="form-control mt-2"
                placeholder="Nombre"
                value={body.nombre}
                onChange={onChange}
                variant='outlined'
                name='nombre'
              />
              <textarea
                className="form-control mt-2"
                placeholder="DPI"
                value={body.dpi}
                onChange={onChange}
                name='dpi'
              />
			  <textarea
                className="form-control mt-2"
                placeholder="DPI extendido por"
                value={body.extend}
                onChange={onChange}
                name='extend'
              />
			  <textarea
                className="form-control mt-2"
                placeholder="Teléfono"
                value={body.telefono}
                onChange={onChange}
                name='telefono'
              />
			  <textarea
                className="form-control mt-2"
                placeholder="Domicilio"
                value={body.domicilio}
                onChange={onChange}
                name='domicilio'
              />
              <input
				className="form-control mt-2"
				type="date"
				placeholder="Fecha"
				value={body.fecha}
				onChange={onChange}
				name='fecha'
				/>
			<h2>
          Datos vehículo
        		</h2>
				<input
				type="text"
				className="form-control mt-2"
				placeholder="ID"
				value={body.auto}
				readOnly // Esto hace que el campo sea de solo lectura
				name="auto"
				/>
              <textarea
                className="form-control mt-2"
                placeholder="Marca"
                name="marca"
				value= {body.marca}
                onChange={onChange}
              />
			  <textarea
                className="form-control mt-2"
                placeholder="Línea"
                name="linea"
				value= {body.linea}
                onChange={onChange}
              />
			  <textarea
                className="form-control mt-2"
                placeholder="Modelo"
                name="modelo"
				value= {body.modelo}
                onChange={onChange}
              />
			   <textarea
                className="form-control mt-2"
                placeholder="Color"
                name="color"
				value= {body.color_exterior}
                onChange={onChange}
              />
			   <textarea
                className="form-control mt-2"
                placeholder="Matricula"
                name="numero_matricula"
				value= {body.numero_matricula}
                onChange={onChange}
              />
			   <textarea
                className="form-control mt-2"
                placeholder="Número de motor"
                name="numero_motor"
				value= {body.numero_motor}
                onChange={onChange}
              />
			   <textarea
                className="form-control mt-2"
                placeholder="Número de chasis"
                name="chasis"
				value= {body.chasis}
                onChange={onChange}
              />
              <input type="submit" value="Send" onClick={fillPDF} />
            </form>
          </div>
        </div>
      </div>
    </div>
  </Fragment>


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
			<Page title="Predio| Citas programadas">
				<ToastAutoHide message={mensaje} />
				<Container maxWidth='lg'>
					<Box sx={{ pb: 5 }}>
						<Typography variant="h5">Generar venta</Typography>
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

export default Registro

