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
		document.getElementById('\''+identifier+'\'').getElementsByClassName('\''+column+'\'').innerHTML = value;//
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
					<td onkeypress=\"update_data("+data[i].ident+",lat)\" contenteditable='true' class=\"lat\">"+data[i].lat+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",lon)\" contenteditable='true' class=\"lon\">"+data[i].lon+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",flow_rate)\" contenteditable='true' class=\"flow_rate\">"+data[i].flow_rate+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",phosphates)\" contenteditable='true' class=\"phosphates\">"+data[i].phosphates+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",temperature)\" contenteditable='true' class=\"temperature\">"+data[i].temperature+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",ph)\" contenteditable='true' class=\"ph\">"+data[i].ph+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",conductivity)\" contenteditable='true' class=\"conductivity\">"+data[i].conductivity+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",ammonium)\" contenteditable='true' class=\"ammonium\">"+data[i].ammonium+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",nitrates)\" contenteditable='true' class=\"nitrates\">"+data[i].nitrates+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",turbidity)\" contenteditable='true' class=\"turbidity\">"+data[i].turbidity+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",do_percent)\" contenteditable='true' class=\"do_percent\">"+data[i].do_percent+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",bod_percent)\" contenteditable='true' class=\"bod_percent\">"+data[i].bod_percent+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",bod_column)\" contenteditable='true' class=\"bod_column\">"+data[i].bod_column+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",v_constricta)\" contenteditable='true' class=\"v_constricta\">"+data[i].v_constricta+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",s_undulatus)\" contenteditable='true' class=\"s_undulatus\">"+data[i].s_undulatus+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",p_collina)\" contenteditable='true' class=\"p_collina\">"+data[i].p_collina+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",bod_hr)\" contenteditable='true' class=\"bod_hr\">"+data[i].bod_hr+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",ecoli)\" contenteditable='true' class=\"ecoli\">"+data[i].ecoli+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",benthic_score)\" contenteditable='true' class=\"benthic_score\">"+data[i].benthic_score+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",soil)\" contenteditable='true' class=\"soil\">"+data[i].soil+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",plankton)\" contenteditable='true' class=\"plankton\">"+data[i].plankton+"</td>
					<td onkeypress=\"update_data("+data[i].ident+",fish)\" contenteditable='true' class=\"fish\">"+data[i].fish+"</td>
				</tr>"
			);
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
				<option value=\""+riv+"\">"+riv+"</option>
			");
		}
	});
	socket.on('newColumn', function(name){
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
	var value = document.getElementById('\''+row+'\'').getElementsByClassName('\''+column+'\'').value;
	socket.emit('newdata', row, column, value);
}
function get_data(){
	var river = document.getElementById('riverChoice')
	var choicer = river.options[river.selectedIndex].value
	var date = document.getElementById('dateChoice')
	var choiced = date.options[date.selectedIndex].value
	if(choicer != "---Select---" && choiced != "---Select---"){
		socket.emit('getdata', choiced, choicer, 0);//since will always be 0 in submit.js
	}
}
function new_column(){
	var name = document.getElementById('columnName').value;
	if(name != "" && name != /* an Integer*/){
		socket.emit('addColumn', name);
	}
}
function get_date(number){
	var d = new Date(number);
	var date = d.setTime(); //sets date = milliseconds after 1970
	return date; 
}
function add_dates(){
	var river = document.getElementById('riverChoice')
	var choice = river.options[river.selectedIndex].value
	document.getElementById('dateChoice').innerHTML ="";
	document.getElementById('dateChoice').append("
		<option value=\"\">---Select---</option>
	");
	for(var i=0;i<visits.length();i++){
		if(visits[i].river == choice){
			for(var j=0; j<visits[i].dates.length();j++){
				document.getElementById('dateChoice').append("
					<option value=\""+visits[i].dates[j]+"\">"+visits[i].dates[j]+"</option>
				");
			}
		}
	}
}