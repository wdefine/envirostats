var entries = 0;
var dataArray = {};
var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function(){
	document.getElementById('???????').addEventListener('click', ????????? , false ); //click on #savebutton
	socket.on('updatedata', function(identifier, column, value){
	});
	socket.on('returnData', function(data){
		entries += data.length()/10;
		dataArray += data; 
	});
	socket.on('updateRiver', function(river){
		//list of potential rivers
	});
	socket.on('updateDate', function(date){
		//update list of recent dates
	});
	socket.on('newColumn', function(){
		for(var i = 0; i< entries; i++){
			socket.emit('getdata', dataArray[i*10].date, dataArray[i*10].river, 0);/
		}
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
