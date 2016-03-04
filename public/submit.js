/*TODO LIST in data.html/submit.js
I have written functions for dealing with socket events coming from server. 
I have started writing a few functions that cover all of the events that need to be emitted to the server.
What needs to be done is this:
1. Find way to realize change in table and emit that change to server via update_data(var). NOTE: There is no reliable way to catalog every
 box in the table as their respective identifiers will always be different. I suggest triggering this event in html if possible.
2. When update_button is pressed, Find way to figure out which options for date/river were selected and finish get_data to emit to server.
3. When newEntriesButton is pressed, trigger new_event function. NOTE: new_event will require the year, month, and day so reconfigure html
 to access this more easily. Right now, date is just any random string.
4. Create a button for adding a new column, and make this button trigger new_column.
*/
var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function() {
	document.getElementById('???????').addEventListener('click', ????????? , false ); //click on #savebutton
	socket.on('updatedata', function(identifier, column, value){
		document.getElementById('identifier').getElementById('column').innerHTML = value;
	});
	socket.on('returnData', function(data){
		document.getElementById('data').innerHTML="";
		for(var i =0;i<data.length();i++){
			document.getElementById('data').append(
				<tr id="data.ident">
					<td id="lat">data.lat</td>
					<td id="lon">data.lon</td>
					<td id="flow_rate">data.flow_rate</td>
					<td id="phosphates">data.phosphates</td>
					<td id="temperature">data.temperature</td>
					<td id="ph">data.ph</td>
					<td id="conductivity">data.conductivity</td>
					<td id="ammonium">data.ammonium</td>
					<td id="nitrates">data.nitrates</td>
					<td id="turbidity">data.turbidity</td>
					<td id="do_percent">data.do_percent</td>
					<td id="bod_percent">data.bod_percent</td>
					<td id="bod_column">data.bod_column</td>
					<td id="v_constricta">data.v_constricta</td>
					<td id="s_undulatus">data.s_undulatus</td>
					<td id="p_collina">data.p_collina</td>
					<td id="bod_hr">data.bod_hr</td>
					<td id="ecoli">data.ecoli</td>
					<td id="benthic_score">data.benthic_score</td>
					<td id="soil">data.soil</td>
					<td id="plankton">data.plankton</td>
					<td id="fish">data.fish</td>
				</tr>
			);
		}
		//place new data on page
	});
	socket.on('updateRiver', function(river){
		document.getElementById('river_choice').append(
			<option value="river">river</option>
		);
	});
	socket.on('updateDate', function(date){
		document.getElementById('date_choice').append(
			<option value="date">date</option>
		);
	});
	socket.on('newColumn', function(){
		socket.emit('getdata', date, river, 0);//since will always be 0 in submit.js
	});
 }, false );

function new_event(){
	var date = new Date(year, month, day, 0, 0, 0);
	var d = date.UTC();//returns seconds since 1970
	socket.emit('newentries', d, river);
}
function update_data({{take in neccesary information}}){
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
	var date = d.setTime(); //sets date = milliseconds after 1970
	return date; 
}