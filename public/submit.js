var socket = io.connect('http://localhost:8080');
var visits = [];
var column = [];
window.addEventListener('load', function() {
	socket.emit('submitStarter');
	socket.emit('getVisits');
	document.getElementById('newEntriesButton').addEventListener('click', new_event , false ); 
	document.getElementById('newColumnButton').addEventListener('click', new_column , false );
	document.getElementById('updateButton').addEventListener('click', get_data , false );
	document.getElementById('riverChoice').addEventListener('change', add_dates , false );
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
	socket.on('updatedata', function(identifier, column, value){
		console.log("updated data"+ identifier + " "+ column+ " "+ value);
		for(var i=0;i<column.length;i++){
			if(column == column[i]){
				var beta= i+3;
				break;
			}
		}
		$(row).deleteCell(beta);
		var cell = row.insertCell(beta);
		cell.innerHTML=value;
		cell.name =row;
		cell.class=column;
		cell.onkeyup = function(){
			setTimeout(update_data(this.className,this.name),0);
		};
		cell.contentEditable = true;
	});
	socket.on('returnData', function(data){
		$("right_table").river=data[0].river;
		$("right_table").date=data[0].date;
		var myTable = document.getElementById('right_table');
		var rows =  myTable.rows;
		for(var i=rows.length;i>1;i--){//dont delete row 0
			myTable.deleteRow(i-1);
		}
		for(var i =0;i<data.length;i++){
			var row = myTable.insertRow(-1);
			row.id = data[i].ident;
			var igvup = data[i].ident;
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
						cell.name = igvup;
						cell.onkeyup = function(){
							setTimeout(update_data(this.className,this.name),0);
						};
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
			option.value = riv;
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
	var d = getWeirdDate(str);
	var river = document.getElementById('newRiver');
	if(river != "" && str != ""){
		console.log(d+" "+river);
		socket.emit('newentries', d, river);
	}
}
function update_data(column, row){
	setTimeout(up_data(column, row), 250);
}
function up_data(column,row){
		var cells=document.getElementById(row).getElementsByTagName("td");
    	for (var i=0; i<cells.length; i++)  {
    		if(cells[i].className == column){
				var value = cells[i].innerHTML;
			}
    	}
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
	var x = document.getElementById("dateChoice");
	x.innerHTML="";
	var option = document.createElement("option");
	option.text = "---Select---";
	option.name = option;
	option.value = "";
	x.add(option);
	for(var i=0;i<visits.length;i++){
		if(visits[i].river == choice){
			for(var j=0; j<visits[i].dates.length;j++){
				var idk = getRealDate(visits[i].dates[j]);
				var option2 = document.createElement("option");
				option2.innerHTML = idk;
				option2.name = option;
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
function getWeirdDate(str){
	var year = str.substring[0-4];
	var month = str.substring[5-7];
	var day = str.substring[8-10];
	var date = new Date(year,month,day,0,0,0);
	var d = date.getTime();
	return d;
}