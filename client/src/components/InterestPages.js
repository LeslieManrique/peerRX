import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouPage = (props) => (
	<div className="thank-you">
		<p>Thank you for your interest!</p>
		<p id="subtext">We will email you when Connect2APeer/PeerRx is live. Feel free to contact <a href="mailto:info@connect2Apeer.com">info@connect2Apeer.com</a> for more information.</p>
	</div>
);

const linkStlye = {
	textDecoration: "none"
};


const WelcomePage = (props) => (
	<div id="welcome-page">
		<h1>Learn More About PeerRX</h1>
		<div id="welcome-video">
			<iframe title="peerrx-video" width="420" height="315" src="https://www.youtube.com/embed/NeB3EuX_v0Y">
				Learn about PeerRX! If video does not play, click <a href="https://youtu.be/NeB3EuX_v0Y">here</a> to watch!
			</iframe>
		</div>
		<div id="interest-link"><Link style={linkStlye} to="/interest_form">Interested?</Link></div>
	</div>
);

export {
	WelcomePage,
	ThankYouPage
};