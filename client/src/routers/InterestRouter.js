import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import InterestForm from "../components/InterestForm";
import { WelcomePage, ThankYouPage } from "../components/InterestPages";
import "../styles/interest.css";

const InterestRouter = () => (
	<BrowserRouter>
		<Switch>
			<Route exact path="/" component={WelcomePage} />
			<Route path="/interest_form" component={InterestForm} />
			<Route path="/thank_you" component={ThankYouPage} />
		</Switch>
	</BrowserRouter>
);

export default InterestRouter;