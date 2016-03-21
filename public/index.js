var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function() {
	document.getElementById('passwdbtn').addEventListener('click', code , false );
 }, false );
function code(e){
	var passwd = document.getElementById('code').
	socket.emit('signin', passwd);
}