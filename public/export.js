/*
TODO:
1. On hover over column header, show x for deletion for data exportation. -and over grid number for row -css edit
2. do css for buttons/ add export/undodelete buttons -css and html
3. find to export dataArray to fathom -export.js
6. Write index.js and index.html -brozey
TOMAYBEDO:
7. Make newColumns only available to teachers -server.js, clientside js
8. Track changes in database -server.js
	8a track the user 
	8b make database
*/
var grid_counter = 0; //for counting the rows on the page
var entries = 0; //for knowing how much data is on page
var dataArray = {};//for data exportation
var deletions = []; //for keeping track of changes
var visits = []; //for keeping track of visits
var column = []; //for keeping track of columns
var columnArray =["river","date"];
var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function(){
	socket.emit('exportStarter');
	socket.emit('getVisits');
	document.getElementById('undo').addEventListener('click', undo_delete , false ); //for undoing deletion of row/column
	document.getElementById('riverChoice').addEventListener('change', add_dates , false ); //for updating date options for river
	document.getElementById('riverButton').addEventListener('click', get_data, false); //for getting data by river or river/date
	document.getElementById('sinceButton').addEventListener('click', since_dates, false); //for searching since a date
	document.getElementById('export').addEventListener('click', export_data , false ); //for exporting data

	socket.on('updatedata', function(identifier, column, value){
		update_data_array(identifier, column, value);
		document.getElementById(identifier).getElementById(column).innerHTML = value;
	});
	socket.on('returnData', function(data){
		console.log(data[0]);
		console.log(data[0].river + " "+ data[0].date);
		$("right_table").river=data[0].river;
		$("right_table").date=data[0].date;
		//$("right_table").innerHTML="";
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
	socket.on('updateRiverDate', function(river){
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
			document.getElementById('riverChoice').push("<option name=\"option\" value=\""+riv+"\">"+riv+"</option>");
		}
	});
	socket.on('returnVisits', function(data){
		for(var i=0; i<data.length ;i++){
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
	socket.on('newColumn', function(name, niceName){
		column.push(name);
		var myTable = document.getElementById('right_table');
		var rows =  myTable.rows;
		var firstRow = rows[0];
		var cell = firstrow.insertCell(-1);
		cell.innerHTML = niceName;
		for(var i=1;i<rows.length;i++){//dont edit first row
			var row = rows[i];
			var cell = row.insertCell(-1);
			cell.className = name;
			cell.onkeypress = function(){update_data(row.id,column[j])}
			cell.contentEditable = true;
		}
		for(var i=0;i<entries/10;i++){
			var dat = dataArray[i*10].date;
			var riv = dataArray[i*10].river;
			socket.emit('getdata', dat, riv, 0);
		}
	});
	socket.on('allColumns', function(list){
		for(var i =0;i<list.length;i++){
			column.push(list[i]);
			columnArray.push(list[i]);
		}
	});
 }, false );
 function get_data(){
 	var river = document.getElementById('riverChoice')
	var choicer = river.options[river.selectedIndex].value
	var date = document.getElementById('dateChoice')
	var choiced = date.options[date.selectedIndex].value
	if(choicer != "" && choiced != ""){
		socket.emit('getdata', choiced, choicer, 0);
	}
	else if(choicer != "" && choiced == ""){
		socket.emit('getdata', 0, choicer, 0);
	}
	document.getElementById('riverChoice').getElementsByTagName('option')[0].selected = 'selected';
	add_dates();
}
function since_dates(){
	var date = document.getElementById('dateSince').value;
	if(date != ""){
		socket.emit('getdata', date, 0,1);
	}
	document.getElementById('dateSince').getElementsByTagName('option')[0].selected = 'selected';

}
function add_dates(){
	var river = document.getElementById('riverChoice')
	var choice = river.options[river.selectedIndex].value
	document.getElementById('dateChoice').innerHTML ="";
	document.getElementById('dateChoice').push("<option name=\"option\" value=\"\">---Select---</option>");
	for(var i=0;i<visits.length;i++){
		if(visits[i].river == choice){
			for(var j=0; j<visits[i].dates.length;j++){
				document.getElementById('dateChoice').push("<option name=\"option\" value=\""+visits[i].dates[j]+"\">"+visits[i].dates[j]+"</option>");
			}
			break;
		}
	}
}
function delete_column(theclass){
	deletions.prepend(theclass);
	document.getElementsByClassName(theclass).display = 'none';
}
function undo_delete(){
	var oldclass = deletions.push();//this should remove item from deletions
	document.getElementsByClassName(oldclass).display = 'block';
}
function export_data(){
	var newArray = dataArray;
	for(var i=0; i<newArray.length; i++){
		for(var j=0; j<deletions.length; j++){
			if(newArray[i].ident ==deletions[j]){
				newArray.splice(i,1);
			}
			else{
				delete newArray[i].deletions[j];
   				removeValue(columnArray, deletions[j]);
			}
		}
	}
	//find way to export newArray(array of objects) into csv file
	var csvData = "data:text/csv;charset=utf-8,";
        //headers
        for(var i=0;i<columnArray.length;i++){
        	csvData+= columnArray[j];
        	if(i != columnArray.length-1){
        		csvData+=',';
        	}
        }
        csvData+='\n';
        //headers
        //body
        for(var i=0;i<newArray.length;i++){
        	for(var j=0;j<columnArray.length;j++){
        		csvData+=newArray[i].columnArray[j];
        		if(i != columnArray.length-1){
        			csvData+=',';
        		}
        		else{
        			csvData+='\n';
        		}
        	}
        }
        //body
        var encodedUri = encodeURI(csvData);
        window.open(encodedUri);
}
function overlap(ident){
	for(var i=0;i<dataArray.length;i++){
		if(dataArray[i].ident == ident){
			return true;
		}
	}
	return false;
}
function update_data_array(row, column, value){
	for(var i=0;i<dataArray.length;i++){
		if(dataArray[i].ident == row){
			dataArray.column = value;
			break;
		}
	}
}