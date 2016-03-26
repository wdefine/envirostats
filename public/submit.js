var socket = io.connect('http://localhost:8080');
var visits = [];
var column = [];
var specname;
window.addEventListener('load', function() {
	get_cookie();
	specname = specname();
	socket.emit('submitStarter');
	socket.emit('getVisits');
	document.getElementById("newRiverChoice").selectedIndex = "0";
	document.getElementById("riverChoice").selectedIndex = "0";
	document.getElementById("dateChoice").selectedIndex = "0";
	document.getElementById('newYear').value = "";
	document.getElementById('newRiver').value = "";
	document.getElementById("newMonth").selectedIndex = "0";
	document.getElementById("newRiverChoice").selectedIndex = "0";
	document.getElementById('columnName').value = "";
	document.getElementById('newEntriesButton').addEventListener('click', new_event , false ); 
	document.getElementById('newColumnButton').addEventListener('click', new_column , false );
	document.getElementById('updateButton').addEventListener('click', get_data , false );
	document.getElementById('riverChoice').addEventListener('change', add_dates , false );
	document.getElementById('newRiverChoice').addEventListener('change', selectingNewRiver , false );
	document.getElementById('newMonth').addEventListener('change', add_days , false );
	document.getElementById('newRiver').addEventListener('keypress', typingNewRiver, false);
	socket.on('returnVisits', function(data){
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
	socket.on('updatedata', function(row, col, val, exempt){
		if(exempt != specname){
			for(var i=0;i<column.length;i++){
				if(col == column[i]){
					var beta= i+3;
					break;
				}
			}
			row = row.toString();
			var myTable = document.getElementById('right_table');
			var rows =  myTable.rows;
			for(var i=0;i<rows.length;i++){
				if(rows[i].id == row){
					//rows[i].cells[beta].innerHTML = val;
				}
			}
		}
	});
	socket.on('returnData', function(data){
		$("right_table").river=data[0].river;
		$("right_table").date=data[0].date;
		var myTable = document.getElementById('right_table');
		var rows =  myTable.rows;
		for(var i=rows.length;i>1;i--){//dont delete row 0
			myTable.deleteRow(i-1);
		}
		for(var i =0;i<10;i++){
			var row = myTable.insertRow(-1);
			row.id = data[i].ident;
			var cell3 = row.insertCell(0);
			var cell1 = row.insertCell(-1);
			var cell2 = row.insertCell(-1);
			cell1.innerHTML = data[i].river;
			cell2.innerHTML = data[i].date;
			cell1.className = "river";
			cell2.className = "date";
			cell3.innerHTML = data[i].grid_number;
			cell3.className = "grid_number";
					for(var j=0;j<column.length;j++){
						var idk = column[j];
						cell = row.insertCell(-1);
						if(data[i][idk] == undefined){
							cell.innerHTML = "";
						}
						else{
							cell.innerHTML = data[i][idk];
						}
						cell.className = column[j];
						cell.name = data[i].ident;
						cell.onkeyup = function(){
							setTimeout(update_data(this.className,this.name),0);
						};
						cell.contentEditable = true;
					}
		}
	});
	socket.on('updateRiverDate', function(riv, date){
		var z=0;
		var x = document.getElementById("riverChoice");
		var y = document.getElementById("newRiverChoice");
		for(var i=0;i<visits.length;i++){
			if(riv == visits[i].river){
				z=1;
				visits[i].dates.push(date);
				break;
			}
		}
		if(z==0){
			visits.push({river:riv, dates:[date]})
			var option = document.createElement("option");
			option.text = riv;
			option.value = riv;
			x.add(option);
			y.add(option);
		}
		x.selectedIndex = "0";
		y.selectedIndex = "0";
		add_dates();
	});
	socket.on('newColumn', function(name, niceName){
		column.push(name);
		var myTable = document.getElementById('right_table');
		var rows =  myTable.rows;
		var firstRow = rows[0];
		var cell = firstRow.insertCell(-1);
		cell.innerHTML = niceName;
		for(var i=1;i<11;i++){
			var row = rows[i];
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
	var x = document.getElementById('newYear').value;
	var year = parseInt(x);
	if(year>2000){
		var safe = true;
		var mon = document.getElementById('newMonth');
		var month = parseInt(mon.options[mon.selectedIndex].value);
		var da = document.getElementById('newDay');
		var day = parseInt(da.options[da.selectedIndex].value);
		var yr = document.getElementById('newRiverChoice');
		var y = yr.options[yr.selectedIndex].value;
		var river = document.getElementById('newRiver').value;
		var d = new Date(year, month, day, 0,0,0);
		var n = d.getTime();
		if(month == 2 && day == 29){ //leap years accounted for
			safe = false;
			if(year % 4 === 0){
				safe = true;
				if(year % 100 === 0){
					safe = false;
					if(year % 400 === 0){
						safe = true;
					}
				}
			}
		}
		if(y=="" && safe == true){
			if(river != ""){
				socket.emit('newentries', n, river);
			}
		}
		else if(river == "" && safe == true){
			if(y != ""){
				socket.emit('newentries', n, y);
			}
		}
	}
	document.getElementById("newRiverChoice").selectedIndex = "0";
	document.getElementById('newYear').value = "";
	document.getElementById('newRiver').value = "";
	document.getElementById("newMonth").selectedIndex = "0";
	document.getElementById("newDay").innerHTML = "";
}
function update_data(column, row){
	setTimeout(up_data(column, row), 250);
}
function up_data(column,row){
		var cells=document.getElementById(row).getElementsByTagName("td");
    	for (var i=0; i<cells.length; i++)  {
    		if(cells[i].className == column){
				var value = cells[i].innerHTML;
				socket.emit('newdata', row, column, value, specname);
				break;
			}
    	}
	}
function get_data(){
	var river = document.getElementById('riverChoice');
	var choicer = river.options[river.selectedIndex].value;
	var date = document.getElementById('dateChoice');
	var choiced = date.options[date.selectedIndex].value;
	if(choicer != "" && choiced != ""){
		socket.emit('getdata', choiced, choicer, 0);//since will always be 0 in submit.js
	}
	river.selectedIndex = "0";
	add_dates();
}
function new_column(){ ///////////////make niceName and shortname
	var niceName = document.getElementById('columnName').value;
	var str = niceName;
	var name = str = str.replace(/\s+/g, '_').replace(/[0-9]/g, '');
	if(name != ""){ //used to be an && in this find out what was suppsed to be there/why it was there
		socket.emit('addColumn', name, niceName);
	}
	document.getElementById('columnName').value = "";
}
function add_dates(){
	var river = document.getElementById('riverChoice');
	var choice = river.options[river.selectedIndex].value;
	var x = document.getElementById("dateChoice");
	x.innerHTML="";
	var option = document.createElement("option");
	option.text = "---Select---";
	option.value = "";
	x.add(option);
	for(var i=0;i<visits.length;i++){
		if(visits[i].river == choice){
			for(var j=0; j<visits[i].dates.length;j++){
				var idk = getRealDate(visits[i].dates[j]);
				var option2 = document.createElement("option");
				option2.innerHTML = idk;
				option2.value = visits[i].dates[j];
				x.add(option2);
			}
			break;
		}
	}
}
function getRealDate(number){
	var d = new Date(number);
	var date = d.toJSON().substring(0,10);
	return date; 
}
function selectingNewRiver(){
	document.getElementById("newRiver").value = "";
}
function typingNewRiver(){
	document.getElementById("newRiverChoice").selectedIndex = "0";
}
function year_edit(datstr){
	if(datstr.length >4){
		datstr = datstr.substring(0,4);
		document.getElementById('newYear').innerHTML =datstr;
		document.getElementById('newYear').value =datstr;
	}
}
function add_days(){
	var river = document.getElementById('newMonth');
	var month = river.options[river.selectedIndex].value;
	if(month == 9 ||month ==  4 ||month ==  6 ||month ==  11){
		var x = document.getElementById("newDay");
		x.innerHTML="";
		for(var i =1; i<= 30;i++){
			var option = document.createElement("option");
			option.innerHTML = i;
			option.value = i;
			x.add(option);
		}
	}
	else if(month == 1 ||month ==  3 ||month ==  5 ||month ==  7 ||month ==  8 ||month ==  10 ||month ==  12){
		var x = document.getElementById("newDay");
		x.innerHTML="";
		for(var i =1; i<= 31;i++){
			var option = document.createElement("option");
			option.innerHTML = i;
			option.value = i;
			x.add(option);
		}
	}
	else if(month == (2)){
		var x = document.getElementById("newDay");
		x.innerHTML="";
		for(var i =1; i<= 29;i++){
			var option = document.createElement("option");
			option.innerHTML = i;
			option.value = i;
			x.add(option);
		}
	}
}
function get_cookie(){
	var x = document.cookie
	if(x == "" || x != "signin=good"){
    	window.location='http://localhost:8080/'
	}
}
function specname() {
	var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	var result = 'BroChat-';
	for (var i = 0; i < 8; i++)
		result += chars.charAt(Math.floor(Math.random()*chars.length));
	return result;
}