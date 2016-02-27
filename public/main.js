function meta(name) {
	var tag = document.querySelector('meta[name=' + name + ']');
	if (tag != null )
		return tag.content ;
	return '';
}
var roomName = meta('roomName');


var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function() {
	document.getElementById('???????').addEventListener('click', ????????? , false ); //click on #savebutton
	socket.on('?????????', function(????,???){
	});
	socket.on('?????????', function(??????){
	});

 }, false );

function new_event(){
	date = new Date(year, month, day, 0, 0, 0);
	socket.emit('newentries', date, river, number)
}
function update_data(){
	name = document.getElementById('????????').value;
	// find a way to extract row(int) and column(string)
	socket.emit('newdata', row, column, value)
}
