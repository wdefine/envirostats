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
		document.getElementById('\''+identifier+'\'').getElementsByClassName('\''+column+'\'')[0].innerHTML = value;//
	});
	socket.on('returnData', function(datas){
		console.log(datas);
		//document.getElementById('data').river=data[0].river;
		//document.getElementById('data').date=data[0].date;
		//document.getElementById('data').innerHTML="";
		for(var i =0;i<datas.length;i++){
			document.getElementById('data').push("<tr id=\""+datas[i].ident+"\"><td class=\"river\">"+datas[i].river+"</td><td class=\"date\">"+datas[i].date+"</td>");
					for(var j=0;j<column.length;j++){
						document.getElementById('data').push("<td onkeypress=\"update_data("+datas[i].ident+","+column[j]+")\" contenteditable='true' class=\""+column[j]+"\">"+datas[i].column[j]+"</td>");
					}
					document.getElementById('data').push("</tr>");
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
			document.getElementById('riverChoice').push("<option name=\"option\" value=\""+riv+"\">"+riv+"</option>");
		}
	});
	socket.on('newColumn', function(namey, niceName){
		column.push(name);
		document.getElementById('headers').push("<th>"+niceName+"</th>");
		var riv = document.getElementById('data').river;
		var dat = document.getElementById('data').date;
		var divy = document.getElementById('data');
		for(var i=0;i<10;i++){
			var row = divy.children[i];
			row.push("<td onkeypress=\"update_data("+row.id+","+name+")\" contenteditable='true' class=\""+name+"\"></td>");
		}
		soccket.emit('getdata', dat, riv, 0);
	});
	socket.on('allColumns', function(list){
		for(var i =0;i<list.length;i++){
			column.push(list[i]);
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
	document.getElementById('dateChoice').innerHTML ="";
	document.getElementById('dateChoice').push("<option name=\"option\" value=\"\">---Select---</option>");
	for(var i=0;i<visits.length;i++){
		if(visits[i].river == choice){
			for(var j=0; j<visits[i].dates.length;j++){
				document.getElementById('dateChoice').push("<option name=\"option\" value=\""+visits[i].dates[j]+"\">"+visits[i].dates[j]+"</option>");
				break;
			}
		}
	}
}