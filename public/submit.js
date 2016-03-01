var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function() {
	document.getElementById('???????').addEventListener('click', ????????? , false ); //click on #savebutton
	socket.on('updatedata', function(identifier, column, value){
	});
	socket.on('returnData', function(data){
	});
	socket.on('updateRiver', function(river){
		//list of potential rivers
	});
	socket.on('updateDate', function(date){

	});
 }, false );

function new_event(){
	date = new Date(year, month, day, 0, 0, 0);
	socket.emit('newentries', date, river);
}
function update_data(){
	name = document.getElementById('????????').value;
	// find a way to extract row(int) and column(string)
	socket.emit('newdata', row, column, value);
}
function get_data(){
	
	socket.emit('getdata', date, river, since);
}