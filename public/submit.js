/*
TODO:
1. permanently edit html files from server.js (on new column event, add columns to mustache files) -minster -MOST IMPORTANT
2. create delay on keypress by limiting the number of times update_data is called from html -??? -may not be neccesary
3. Make sure the date coming from html is in YYYY-MM-DD format. -research/testing
4. Make newColumn only available to teachers  -tokens -may not be neccesary
5. GetElementsByClassName???? -it should light up as blue -syntax
6. Are html calls in right format -minster
*/
var socket = io.connect('http://localhost:8080');
var visits = [];
var column = [];
window.addEventListener('load', function() {
	socket.emit('getVisits');
	document.getElementById('newEntriesButton').addEventListener('click', new_event , false ); 
	document.getElementById('newColumnButton').addEventListener('click', new_column , false );
	document.getElementById('updateButton').addEventListener('click', get_data , false );
	document.getElementById('riverChoice').addEventListener('change', add_dates , false );
	socket.on('returnVisits', function(data){
		for(var i=0;i<data.length();i++){
			var x =0;
			for(var j=0;j<visits.length();j++){
				if(visits[j].river == data[i].river){
					x=1;
					visits[j].dates.append(data[i].date)
				}
			}
			if(x==0){
				visits.append({river:data[i].river, dates:[data[i].date]})
			}		
		}
	});
	socket.on('updatedata', function(identifier, column, value){
		document.getElementById('\''+identifier+'\'').getElementsByClassName('\''+column+'\'')[0].innerHTML = value;//
	});
	socket.on('returnData', function(data){
		document.getElementById('data').river=data[0].river;
		document.getElementById('data').date=data[0].date;
		document.getElementById('data').innerHTML="";
		for(var i =0;i<data.length();i++){
			document.getElementById('data').append("
				<tr id=\""+data[i].ident+"\">
					<td class=\"river\">"+data[i].river+"</td>
					<td class=\"date\">"+data[i].date+"</td>
					");
					for(var j=0;j<column.length();j++)
						document.getElementById('data').append("
							<td onkeypress=\"update_data("+data[i].ident+","+column[j]+")\" contenteditable='true' class=\""+column[j]+"\">"+data[i].column[j]+"</td>
					");}
					document.getElementById('data').append("</tr>");
		}
	});
	socket.on('updateRiverDate', function(riv, date){
		var z=0;
		for(var i=0;i<visits.length();i++){
			if(riv == visits[i].river){
				z=1;
				visits[i].dates.append(date);
				add_dates();
			}
		}
		if(z==0){
			visits.append({river:riv, dates:[date]})
			document.getElementById('riverChoice').append("
				<option name=\"option\" value=\""+riv+"\">"+riv+"</option>
			");
		}
	});
	socket.on('newColumn', function(name){
		column.append(name);
		document.getElementById('headers').append("
			<th>"+name+"</th>
		");
		var riv = document.getElementById('data').river;
		var dat = document.getElementById('data').date;
		for(var i=0;i<10;i++){
			//for row[i] in table
			row.append("
				<td onkeypress=\"update_data("+row.id+","+name+")\" contenteditable='true' class=\""+name+"\"></td>
			");
		}
		soccket.emit('getdata', dat, riv, 0);
	});
	socket.on('allColumns', function(list){
		for(var i =0;i<list.length();i++){
			column.append(list[i]);
		}
	});
 }, false );

function new_event(){
	var str = document.getElementById('newDate').value;
	var year = str.substring(0,4);
	var month = str.substring(5,7);
	var day = str.substring(8);
	var date = new Date(year, month, day, 0, 0, 0);
	var d = date.UTC();//returns seconds since 1970
	var river = document.getElementById('newRiver');
	if(river != "" && str != ""){
		socket.emit('newentries', d, river);
	}
}
function update_data(row, column){
	//
	//I would like to find a way to not update the server on every new keypress.
	//
	var value = document.getElementById('\''+row+'\'').getElementsByClassName('\''+column+'\'')[0].value;
	socket.emit('newdata', row, column, value);
}
function get_data(){
	var river = document.getElementById('riverChoice')
	var choicer = river.options[river.selectedIndex].value
	var date = document.getElementById('dateChoice')
	var choiced = date.options[date.selectedIndex].value
	if(choicer != "" && choiced != ""){
		socket.emit('getdata', choiced, choicer, 0);//since will always be 0 in submit.js
	}
	document.getElementById('riverChoice').getElementsByTagName('option')[0].selected = 'selected';
	add_dates();
}
function new_column(){
	var name = document.getElementById('columnName').value;
	if(name != "" && name != /* an Integer*/){
		socket.emit('addColumn', name);
	}
}
function add_dates(){
	var river = document.getElementById('riverChoice')
	var choice = river.options[river.selectedIndex].value
	document.getElementById('dateChoice').innerHTML ="";
	document.getElementById('dateChoice').append("
		<option name=\"option\" value=\"\">---Select---</option>
	");
	for(var i=0;i<visits.length();i++){
		if(visits[i].river == choice){
			for(var j=0; j<visits[i].dates.length();j++){
				document.getElementById('dateChoice').append("
					<option name=\"option\" value=\""+visits[i].dates[j]+"\">"+visits[i].dates[j]+"</option>
				");
			}
		}
	}
}