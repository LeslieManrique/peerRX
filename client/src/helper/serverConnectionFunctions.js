// TODO: Mock API testing

// send form data to server and call given function upon success
function sendFormInputs(url, init, success){
	fetch(url, init)
	.then(response => response.json())
	.then(form_data => {
		console.log('Success:', JSON.stringify(form_data));
		success();
	})
	.catch(error => console.error('Error:', error));
}

export {
	sendFormInputs
};