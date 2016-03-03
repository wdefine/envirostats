var socket = io.connect('http://localhost:8080');
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
 function get_data(){
	socket.emit('getdata', date, river, since);
}
function get_date(number){
	var d = new Date(number);
	var date = d.setTime();
	return date; 
}