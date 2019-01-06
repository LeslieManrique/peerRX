import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PeerRXApp from './../components/PeerRXApp';
import LogIn from './../components/LogIn';
import Registration from './../components/Registration';

const AppRouter = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={PeerRXApp} />
			<Route path="/login" component={LogIn} />
			<Route path="/register" component={Registration} />
		</Switch>
	</BrowserRouter>
);

export default AppRouter;