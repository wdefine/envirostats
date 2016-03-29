var grid_counter = 0; //for counting the rows on the page
var entries = 0; //for knowing how much data is on page
var dataArray = [];//for data exportation
var deletions = []; //for keeping track of changes
var visits = []; //for keeping track of visits
var column = []; //for keeping track of columns
var columnArray =["grid_number","river","date"];
var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function(){
	socket.emit('exportStarter');
	socket.emit('getVisits');
	document.getElementById("dateSince").selectedIndex = "0";
	document.getElementById("riverChoice").selectedIndex = "0";
	document.getElementById("dateChoice").selectedIndex = "0";
	document.getElementById('undo').addEventListener('click', undo_delete , false ); //for undoing deletion of row/column
	document.getElementById('riverChoice').addEventListener('change', add_dates , false ); //for updating date options for river
	document.getElementById('riverButton').addEventListener('click', get_data, false); //for getting data by river or river/date
	document.getElementById('sinceButton').addEventListener('click', since_dates, false); //for searching since a date
	document.getElementById('export').addEventListener('click', export_data , false ); //for exporting data
	socket.on('updatedata', function(row, col, val, exempt){
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
				rows[i].cells[beta].innerHTML = val;
			}
		}
	});
	socket.on('returnData', function(data){
		for(var i =0;i<data.length;i++){
			if(overlap(data[i].ident)==false){
				dataArray.push(data[i]);
				var row = document.getElementById("right_table").insertRow(-1);
				row.className = data[i].ident;
				var cell3 = row.insertCell(0);
				var cell1 = row.insertCell(-1);
				var cell2 = row.insertCell(-1);
				cell1.innerHTML = data[i].river;
				cell2.innerHTML = data[i].date;
				cell3.innerHTML = data[i].grid_number;
				cell1.className = "river";
				cell2.className = "date";
				cell3.className = "grid_number";
				cell1.name = data[i].ident;
				cell2.name = data[i].ident;
				cell3.name = data[i].ident;
				cell3.onclick = function(){
					var it = {
						theclass: this.name,
						boo: true
					};
					deletions.unshift(it);
					delete_column(this.name, true);
				}
					for(var j=0;j<column.length;j++){
						var idk = column[j];
						cell = row.insertCell(-1);
						if(data[i][idk] == undefined){
							cell.innerHTML = "";
						}
						else{
							cell.innerHTML = data[i][idk];
						}
						cell.className =idk;
						cell.name = data[i].ident;
					}
			}
		}
		for(var i=0;i<deletions.length;i++){
			console.log("load delete");
			delete_column(deletions[i].theclass, deletions[i].boo);
		}
	});
	socket.on('updateRiverDate', function(riv, date){
		var z=0;
		var w = document.getElementById("riverChoice");
		var x = document.getElementById("dateSince");
		for(var i=0;i<visits.length;i++){
			if(riv == visits[i].river){
				z=1;
				visits[i].dates.push(date);
				add_dates();
			}
			var option = document.createElement("option");
			option.text = getRealDate(date);
			option.name = option;
			option.value = date;
			x.add(option);
		}
		if(z==0){
			visits.push({river:riv, dates:[date]})
			var option = document.createElement("option");
			option.text = riv;
			option.name = option;
			option.value = riv;
			w.add(option);
		}
		x.selectedIndex = "0";
		w.selectedIndex = "0";
		add_dates();
	});
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
				visits.push({river:data[i].river, dates:[data[i].date]});
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
		cell.classList.add(firstrow.id);
		cell.classList.add(name);
		for(var i=1;i<rows.length;i++){//dont edit first row
			var row = rows[i];
			var cell = row.insertCell(-1);
			cell.className = name;
			cell.innerHTML = ""
			cell.classList.add(firstrow.id);
			cell.classList.add(name);
		}
		for(var i=0;i<entries/10;i++){
			var dat = dataArray[i*10].date;
			var riv = dataArray[i*10].river;
			socket.emit('getdata', dat, riv, 0);
		}
	});
	socket.on('allColumns', function(list){
		for(var i =0;i<list.length;i++){
			column.push(list[i].classnames);
			columnArray.push(list[i].classnames);
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
	river.selectedIndex = "0";
	date.selectedIndex = "0";
	add_dates();
}
function since_dates(){
	var date = document.getElementById('dateSince');
	var choiced = date.options[date.selectedIndex].value;
	if(date != ""){
		socket.emit('getdata', choiced, 0,1);
	}
	date.selectedIndex = "0";

}
function add_dates(){
	var river = document.getElementById('riverChoice')
	var choice = river.options[river.selectedIndex].value
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
function delete_column(theclass, boo){
	console.log("delete");
	var table = document.getElementById("right_table");
	var rows =  table.rows;
	var jqtable = $("#right_table");
	if(boo == true){//row
		for(var i=1;i<rows.length;i++){
			var row = rows[i];
			if(row.className == theclass){
				row.style.display = 'none';
				break;
			}
		}
	}
	else if(boo == false){//column
		for(var i=0;i<rows.length;i++){
			for(var j=0;j<rows[i].cells.length;j++){
				if(rows[i].cells[j].className == theclass){
					rows[i].cells[j].style.display = 'none';
					break;
				}
			}
		}
	}
}
function undo_delete(){
	console.log("undelete");
	if(deletions[0] != undefined){
		var theclass = deletions[0].theclass;
		var boo = deletions[0].boo;
		deletions.shift();
		var table = document.getElementById("right_table");
		var rows =  table.rows;
		var jqtable = $("#right_table");
		var jqrows = jqtable.children();
		if(boo == true){ //row
			for(var i=1;i<rows.length;i++){
				var row = rows[i];
				if(row.className == theclass){
					row.style.display = 'block';
					break;
				}
			}
		}
		else if(boo == false){//column
			for(var i=0;i<rows.length;i++){
				for(var j=0;j<rows[i].cells.length;j++){
					if(rows[i].cells[j].className == theclass){
						rows[i].cells[j].style.display = 'block';
						break;
					}
				}
			}
		}
	}
}	
function export_data(){
	var newArray = dataArray;
	var newColumnArray = columnArray;
	for(var a=0;a<deletions.length;a++){
		if(deletions[a].boo == true){//row
			for(var i=0; i<newArray.length; i++){
				if(newArray[i].ident ==deletions[a].theclass){
        			newArray.splice(i,1);
        		}
			}
		}
		else if(deletions[a].boo == false){//column
			for(var k=0;k<newColumnArray.length;k++){
				if(newColumnArray[k]==deletions[a].theclass){
        			newColumnArray.splice(k,1);
        		}
			}
		}
	}
	//find way to export newArray(array of objects) into csv file
	var csvData = "data:text/csv;charset=utf-8,";
        //headers
        for(var i=0;i<newColumnArray.length;i++){
        	csvData+= newColumnArray[i];
        	if(i != newColumnArray.length-1){
        		csvData+=',';
        	}
        }
        csvData+='\n';
        //headers
        //body
        for(var i=0;i<newArray.length;i++){
        	for(var j=0;j<newColumnArray.length;j++){
        		if(newArray[i][newColumnArray[j]] == null){
        			csvData+="";
        		}
        		else{
        			csvData+=newArray[i][newColumnArray[j]];
        		}
        		if(j != newColumnArray.length-1){
        			csvData+=',';
        		}
        		else{
        			csvData+='\n';
        		}
        	}
        }
        //body
        var encodedUri = encodeURI(csvData);
        var downloadLink = document.createElement("a");
		downloadLink.href = encodedUri;
		downloadLink.download = "data.csv";

		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
        //window.open(encodedUri, "envirostatsdata.csv");
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
			dataArray[column] = value;
			break;
		}
	}
}
function getRealDate(number){
	var d = new Date(number);
	var date = d.toJSON().substring(0,10);
	return date; 
}
