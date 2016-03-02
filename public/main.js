function meta(name) {
	var tag = document.querySelector('meta[name=' + name + ']');
	if (tag != null )
		return tag.content ;
	return '';
}
var roomName = meta('roomName');


var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function() {
	document.getElementById('???????').addEventListener('click', '?????????' , false ); //click on #savebutton
	socket.on('?????????', function(????,???){
	});
	socket.on('?????????', function(??????){
	});

 }, false );
