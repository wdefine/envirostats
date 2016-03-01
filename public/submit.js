var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function() {
	document.getElementById('???????').addEventListener('click', ????????? , false ); //click on #savebutton
	socket.on('updatedata', function(identifier, column, value){
	});
	socket.on('returnData', function(data){
		//make data currently on page = 0
		//place new data on page
	});
	socket.on('updateRiver', function(river){
		//list of potential rivers
	});
	socket.on('updateDate', function(date){

	});
	socket.on('newColumn', function(){
		socket.emit('getdata', date, river, 0);//since will always be 0 in submit.js
	});
 }, false );

function new_event(){
	var date = new Date(year, month, day, 0, 0, 0);
	var d = date.UTC();
	socket.emit('newentries', d, river);
}
function update_data(){
	var value = document.getElementById('????????').value;
	// find a way to extract row(int) and column(string)
	socket.emit('newdata', row, column, value);
}
function get_data(){
	
	socket.emit('getdata', date, river, 0);//since will always be 0 in submit.js
}
function new_column(){
	var name = document.getElementById('????????').value;
	socket.emit('addColumn', name);
}
function get_date(number){
	var d = new Date(number);
	var date = d.setTime();
	return date; 
}