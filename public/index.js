var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function() {
	document.getElementById('pButton').addEventListener('click', code , false );
 }, false );
function code(e){
	var passwd = document.getElementById('passwd').
	socket.emit('signin', passwd);
}