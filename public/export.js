var grid_counter = 0; //for counting the rows on the page
var entries = 0; //for knowing how much data is on page
var dataArray = {};//for data exportation
var deletions = []; //for keeping track of changes
var visits = []; //for keeping track of visits
var column = []; //for keeping track of columns
var columnArray =["grid_number","river","date"];
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
		for(var i=0;i<column.length;i++){
			if(column == column[i]){
				var beta= i+3;
				break;
			}
		}
		$(row).deleteCell(beta);
		var cell = row.insertCell(beta);
		cell.innerHTML=value;
		cell.className = column;
		cell.classList.add(row);
	});
	socket.on('returnData', function(data){
		$("right_table").river=data[0].river;
		$("right_table").date=data[0].date;
		for(var i =0;i<data.length;i++){
			var row = document.getElementById("right_table").insertRow(-1);
			row.id = data[i].ident;
			row.className = data[i].ident;
			var cell3 = row.insertCell(0);
			var cell1 = row.insertCell(-1);
			var cell2 = row.insertCell(-1);
			//console.log(data[i].river);
			cell1.innerHTML = data[i].river;
			cell2.innerHTML = data[i].date;
			cell3.innerHTML = data[i].grid_number;
			cell1.classList.add("river");
			cell2.classList.add("date");
			cell3.classList.add("grid_number");
			cell1.classList.add(data[i].ident);
			cell2.classList.add(data[i].ident);
			cell3.classList.add(data[i].ident);
			cell3.id= "deleteable_row";
			cell3.name = data[i].ident;
			cell3.onclick= function(){
				console.log("rowclicked");
				delete_column(this.name)};
				for(var j=0;j<column.length;j++){
					var idk = column[j];
					cell = row.insertCell(-1);
					if(data[i][idk] == undefined){
						cell.innerHTML = "";
					}
					else{
						cell.innerHTML = data[i][idk];
					}
					cell.classList.add(idk);
					cell.classList.add(data[i].ident);
				}
		}
	});
	socket.on('updateRiverDate', function(riv, date){
		var z=0;
		var y=0;
		for(var i=0;i<visits.length;i++){
			if(riv == visits[i].river){
				z=1;
				visits[i].dates.push(date);
				add_dates();
			}
			for(var j=0;j<visits[i].dates.length;j++){
				if(date == visits[i].dates[j]){
					var y=1;
				}
			}
			if(y==0){
				var x = document.getElementById("dateSince");
				var option = document.createElement("option");
				option.text = getRealDate(date);
				option.name = option;
				option.value = date;
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
		console.log(visits[0].dates);
		console.log(visits[1].dates);
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
	document.getElementById('riverChoice').getElementsByTagName('option')[0].selected = 'selected';
	add_dates();
}
function since_dates(){
	var date = document.getElementById('dateSince');
	var choiced = date.options[date.selectedIndex].value;
	if(date != ""){
		console.log(choiced);
		socket.emit('getdata', choiced, 0,1);
	}
	document.getElementById('dateSince').getElementsByTagName('option')[0].selected = 'selected';

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
function delete_column(theclass){
	console.log("deletehere")
	deletions.unshift(theclass);
	var table = document.getElementById("right_table");
	var rows =  table.rows;
	for(var i=0;i<rows.length;i++){
		if(rows[i].className == theclass){
			rows[i].display = 'none'
			console.log('huh');
		}
		for(var j=0;j<rows[i].cells.length;j++){
			if (rows[i].cells[j].classList.contains(theclass)){
				rows[i].cells[j].display = 'none'
			}
		}
	}
	//document.getElementsByClassName(theclass).display = 'none';
}
function undo_delete(){
	var theclass = deletions.pop();//this should remove item from deletions
	console.log("undeletehere")
	deletions.unshift(theclass);
	var table = document.getElementById("right_table");
	var rows =  table.rows;
	for(var i=0;i<rows.length;i++){
		if(rows[i].className == theclass){
			rows[i].display = 'block'
		}
		for(var j=0;j<rows[i].cells.length;j++){
			if (rows[i].cells[j].classList.contains(theclass)){
				rows[i].cells[j].display = 'block'
			}
		}
	}
	//document.getElementsByClassName(oldclass).display = 'block';
}
function export_data(){
	var newArray = dataArray;
	var newColumnArray = columnArray;
	for(var i=0; i<newArray.length; i++){
		for(var j=0; j<deletions.length; j++){
			if(newArray[i].ident ==deletions[j]){
				newArray.splice(i,1);
			}
			else{
				delete newArray[i][deletions[j]];
				for(var i in newColumnArray){
    				if(newColumnArray[i]==deletions[j]){
        				newColumnArray.splice(i,1);
        				break;
        			}
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
        		csvData+=newArray[i][newColumnArray[j]];
        		if(i != newColumnArray.length-1){
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