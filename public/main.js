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
	socket.on('updatedata', function(identifier, column, value){
	});
	socket.on('returnData', function(data){
	});
	socket.on('updateRiver', function(river){

	});
	socket.on('updateDate', function(date){

	});
 }, false );

function new_event(){
	date = new Date(year, month, day, 0, 0, 0);
	socket.emit('newentries', date, river, number);
}
function update_data(){
	name = document.getElementById('????????').value;
	// find a way to extract row(int) and column(string)
	socket.emit('newdata', row, column, value);
}
function get_data(){
	socket.emit('getdata', date, river, since);
}
