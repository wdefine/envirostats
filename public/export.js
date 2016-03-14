/*
TODO:
1. On hover over column header, show x for deletion for data exportation. -and over grid number for row -css edit -MOST IMPORTANT
2. configure all of the handlers for the different search options -make user interface clean or simplify -html,css
3. find to export dataArray to csv file -??? -MOST IMPORTANT
4. sync what export.js needs to look like with what it looks like in this file -html
5. After search, make selected index = ---Select--- so they cant press submit twice
6. Check to see if data is already on page before adding it to page
*/
var grid_counter = 0; //for counting the rows on the page
var entries = 0; //for knowing how much data is on page
var dataArray = {};//for data exportation
var deletions = []; //for keeping track of changes
var visits = [];
var socket = io.connect('http://localhost:8080');
window.addEventListener('load', function(){
	socket.emit('getVisits');
	document.getElementById('undoDelete').addEventListener('click', undo_delete , false );
	document.getElementById('riverChoice').addEventListener('change', add_dates , false );
	document.getElementById('riverButton').addEventListener('click', get_data, false);
	document.getElementById('sinceButton').addEventListener('click', since_dates, false);
	document.getElementById('exportButton').addEventListener('click', export_data , false );
	//
	//listeners for get requests here:
	//Either write multiple get_data functions for each type of request or input date, river, since into get_data -remember null=0.
	//
	socket.on('updatedata', function(identifier, column, value){
		document.getElementById('\''+identifier+'\'').getElementById('\''+column+'\'').innerHTML = value;
	});
	socket.on('returnData', function(data){
		entries += data.length()/10;
		dataArray += data;
		for(var i =0;i<data.length();i++){
			grid_counter+=1;
			document.getElementById('data').append("
				<tr id=\""+data[i].ident+"\" class=\""+data[i].ident+"\">
					<td class=\"river\">"+data[i].river+"</td>
					<td class=\"date\">"+data[i].date+"</td>
					<td class=\"lat\">"+data[i].lat+"</td>
					<td class=\"lon\">"+data[i].lon+"</td>
					<td class=\"flow_rate\">"+data[i].flow_rate+"</td>
					<td class=\"phosphates\">"+data[i].phosphates+"</td>
					<td class=\"temperature\">"+data[i].temperature+"</td>
					<td class=\"ph\">"+data[i].ph+"</td>
					<td class=\"conductivity\">"+data[i].conductivity+"</td>
					<td class=\"ammonium\">"+data[i].ammonium+"</td>
					<td class=\"nitrates\">"+data[i].nitrates+"</td>
					<td class=\"turbidity\">"+data[i].turbidity+"</td>
					<td class=\"do_percent\">"+data[i].do_percent+"</td>
					<td class=\"bod_percent\">"+data[i].bod_percent+"</td>
					<td class=\"bod_column\">"+data[i].bod_column+"</td>
					<td class=\"v_constricta\">"+data[i].v_constricta+"</td>
					<td class=\"s_undulatus\">"+data[i].s_undulatus+"</td>
					<td class=\"p_collina\">"+data[i].p_collina+"</td>
					<td class=\"bod_hr\">"+data[i].bod_hr+"</td>
					<td class=\"ecoli\">"+data[i].ecoli+"</td>
					<td class=\"benthic_score\">"+data[i].benthic_score+"</td>
					<td class=\"soil\">"+data[i].soil+"</td>
					<td class=\"plankton\">"+data[i].plankton+"</td>
					<td class=\"fish\">"+data[i].fish+"</td>
				</tr>
			");
			document.getElementById('rows').append("
				<tr class=\""+data[i].ident+"\" onkeypress=\"delete("+data[i].ident+")\"><td>Grid #"+grid_counter+"</td></tr>
			");
		} 
	});
	socket.on('updateRiverDate', function(river){
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
	socket.on('newColumn', function(){
		document.getElementById('headers').append("
			<th class=\""+name+"\" onkeypress=\"delete("+name+")\">"+name+"</th>
		");
		for(var i=0;i<entries*10;i++){//for all rows
			row.append("
				<td class=\""+name+"\"></td>
			");
		}
		

	});
 }, false );
 function get_data(){
 	var river = document.getElementById('riverChoice')
	var choicer = river.options[river.selectedIndex].value
	var date = document.getElementById('dateChoice')
	var choiced = date.options[date.selectedIndex].value
	if(choicer != "---Select---" && choiced != "---Select---"){
		socket.emit('getdata', choiced, choicer, 0);
	}
	else if(choicer != "---Select---" && choiced == "---Select---"){
		socket.emit('getdata', 0, choicer, 0);
	}
	//change selected index to ---Select--
}
function since_dates(){
	var date = document.getElementById('dateSince').value;
	if(date != "---Select---"){
		socket.emit('getdata', date, 0,1);
	}
	// change selected index to ---Select---
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
function delete_column(theclass){
	deletions.prepend(theclass);
	document.getElementsByClassName('column').display = 'none';
}
function undo_delete(){
	oldclass = deletions.push();//this should remove item from deletions
	document.getElementsByClassName(oldclass).display = 'block';
}
function export_data(){
	var newArray = dataArray;
	for(var i=0; i<newArray.length(); i++){
		for(var j=0; j<deletions.length(); j++){
			if(newArray[i].ident ==deletions[j]){
				newArray.splice(i,1);
			}
			else{
				delete newArray[i].deletions[j];
			}
		}
	}
	//find way to export newArray into csv file
}