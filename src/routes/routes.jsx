import React, { lazy } from 'react'
import { APP_VALUES } from '../constants/app'
import { HomeRedirect } from './RouteUtils'
const RouteController = lazy(() => import('./RouteController'))
const NotFound = lazy(() => import('../components/Pages/NotFound'))
const Login = lazy(() => import('../components/Pages/Login'))
const Home = lazy(() => import('../components/Pages/Home'))
const Dashboard = lazy(() => import('../components/Pages/Dashboard'))
const Usuarios = lazy(() => import('../components/Pages/Usuarios'))
const Vehiculo = lazy(() => import('../components/Pages/vehiculos'))
const Marca = lazy(() => import('../components/Pages/Marca'))
const Tipo = lazy(() => import('../components/Pages/Tipovehiculo'))
const Citas = lazy(() => import('../components/Pages/citas'))
const Registro = lazy(() => import('../components/Pages/registro'))
const Ventas = lazy(() => import('../components/Pages/ventas'))

const routes = [
	{
		path: "/",
		exact: true,
		component: HomeRedirect
	},
	{
		path: "/login",
		exact: true,
		render: props => <Login {...props} />
	},
	{
		path: `/${APP_VALUES.ROOT_ROUTE}`,
		render: props => <RouteController component={Home} {...props} />,
		routes: [
			{
				path: `/${APP_VALUES.ROOT_ROUTE}`,
				exact: true,
				render: props => <RouteController component={Dashboard} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/usuarios`,
				exact: true,
				render: props => <RouteController component={Usuarios} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/vehiculos`,
				exact: true,
				render: props => <RouteController component={Vehiculo} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/marca`,
				exact: true,
				render: props => <RouteController component={Marca} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/tipo`,
				exact: true,
				render: props => <RouteController component={Tipo} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/citas`,
				exact: true,
				render: props => <RouteController component={Citas} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/registro`,
				exact: true,
				render: props => <RouteController component={Registro} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/ventas`,
				exact: true,
				render: props => <RouteController component={Ventas} {...props} />
			},
			{
				path: `/${APP_VALUES.ROOT_ROUTE}/*`,
				exact: true,
				render: props => <NotFound {...props} />
			},
			
		]
	},
	{
		path: '*',
		render: props => <NotFound {...props} />
	}
]

export default routes