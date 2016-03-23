var socket = io.connect('http://localhost:8080');
var visits = [];
var column = [];
window.addEventListener('load', function() {
	console.log("hi!");
	socket.emit('submitStarter');
	socket.emit('getVisits');
	document.getElementById('newEntriesButton').addEventListener('click', new_event , false ); 
	document.getElementById('newColumnButton').addEventListener('click', new_column , false );
	document.getElementById('updateButton').addEventListener('click', get_data , false );
	document.getElementById('riverChoice').addEventListener('change', add_dates , false );
	socket.on('returnVisits', function(data){
		console.log("here!");
		for(var i=0;i<data.length;i++){
			var x =0;
			for(var j=0;j<visits.length;j++){
				if(visits[j].river == data[i].river){
					x=1;
					visits[j].dates.push(data[i].date)
				}
			}
			if(x==0){
				visits.push({river:data[i].river, dates:[data[i].date]})
			}		
		}
	});
	socket.on('updatedata', function(identifier, column, value){
		document.getElementById(identifier).getElementsByClassName(column).innerHTML = value;//
	});
	socket.on('returnData', function(data){
		console.log(data[0]);
		console.log(data[0].river + " "+ data[0].date);
		$("right_table").river=data[0].river;
		$("right_table").date=data[0].date;
		var myTable = document.getElementById('right_table');
		var rows =  myTable.rows;
		for(var i=1;rows.length;i++){//dont delete row 0
			document.getElementById("right_Table").deleteRow(i);
		}
		for(var i =0;i<data.length;i++){
			var row = document.getElementById("right_table").insertRow(-1);
			row.id = data[i].ident;
			var cell1 = row.insertCell(0);
			var cell2 = row.insertCell(-1);
			var cell3 = row.insertCell(-1);
			//console.log(data[i].river);
			cell1.innerHTML = data[i].river;
			cell2.innerHTML = data[i].date;
			cell1.className = "river";
			cell2.className = "date";
			cell3.innerHTML = data[i].grid_number;
			cell3.className = "grid_number";
					for(var j=0;j<column.length;j++){
						var idk = column[j];
						cell = row.insertCell(-1);
						if(data[i].idk == undefined){
							cell.innerHTML = "";
						}
						else{
							cell.innerHTML = data[i].idk;
						}
						cell.className = column[j];
						cell.onkeypress = function(){update_data(data[i].ident,column[j])}
						cell.contentEditable = true;
					}
		}
	});
	socket.on('updateRiverDate', function(riv, date){
		var z=0;
		for(var i=0;i<visits.length;i++){
			if(riv == visits[i].river){
				z=1;
				visits[i].dates.push(date);
				add_dates();
			}
		}
		if(z==0){
			visits.push({river:riv, dates:[date]})
			var x = document.getElementById("riverChoice");
			var option = document.createElement("option");
			option.text = riv;
			option.name = option;
			x.add(option);
		}
	});
	socket.on('newColumn', function(namey, niceName){
		column.push(name);
		var myTable = document.getElementById('right_table');
		var rows =  myTable.rows;
		var firstRow = rows[0];
		var cell = firstrow.insertCell(-1);
		cell.innerHTML = niceName;
		for(var i=0;i<10;i++){
			var row = rows[0+1];
			var cell = row.insertCell(-1);
			cell.className = name;
			cell.onkeypress = function(){update_data(row.id,column[j])}
			cell.contentEditable = true;
		}
		var riv = $("right_table").river;
		var dat = $("right_table").date;
		socket.emit('getdata', dat, riv, 0);
	});
	socket.on('allColumns', function(list){
		for(var i =0;i<list.length;i++){
			column.push(list[i]);
		}
	});
 }, false );

function new_event(){
	var str = $("newDate").value;
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
	var value = document.getElementById(row).getElementsByClassName(column).innerHTML;
	socket.emit('newdata', row, column, value);
}
function get_data(){
	var river = document.getElementById('riverChoice');
	var choicer = river.options[river.selectedIndex].value
	var date = document.getElementById('dateChoice');
	var choiced = date.options[date.selectedIndex].value
	if(choicer != "" && choiced != ""){
		socket.emit('getdata', choiced, choicer, 0);//since will always be 0 in submit.js
	}
	document.getElementById('riverChoice').getElementsByTagName('option')[0].selected = 'selected';
	add_dates();
}
function new_column(){ ///////////////make niceName and shortname
	var niceName = document.getElementById('columnName').value;
	var name = str = str.replace(/\s+/g, '').replace(/[0-9]/g, '');
	if(name != ""){ //used to be an && in this find out what was suppsed to be there/why it was there
		socket.emit('addColumn', name, niceName);
	}
	document.getElementById('columnName').value = "";
}
function add_dates(){
	var river = document.getElementById('riverChoice')
	var choice = river.options[river.selectedIndex].value
	var x = document.getElementById("mySelect");
	for(var i=0;i<x.length;i++){
		x.remove(i);
	}
	var x = document.getElementById("dateChoice");
	var option = document.createElement("option");
	option.text = "---Select---";
	option.name = option;
	x.add(option);
	for(var i=0;i<visits.length;i++){
		if(visits[i].river == choice){
			for(var j=0; j<visits[i].dates.length;j++){
				var idk = dates[j];
				var x = document.getElementById("dateChoice");
				var option = document.createElement("option");
				option.text = visits[i].idk;
				option.name = option;
				option.value = visits[i].idk;
				x.add(option);
				break;
			}
		}
	}
}