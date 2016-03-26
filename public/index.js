var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function() {
	document.getElementById('pButton').addEventListener('click', code , false );
	socket.on('signingood', function(){
		window.alert("Sign In Successful");
		document.getElementById('passwd').value = "";
		var date = new Date();
		var d = date.getTime() + 21600000;
		var date = new Date(d);
		var n = date.toString();
		console.log(n);
		var str = "signin=good"
		document.cookie=str;
		console.log(document.cookie);
	});
	socket.on('signinbad', function(){
		window.alert("Wrong Password. Try Again.");
		document.getElementById('passwd').value = "";
	});
 }, false );
function code(e){
	var passwd = document.getElementById('passwd').value;
	socket.emit('signin', passwd);
}