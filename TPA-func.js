// Set current date
var date = new Date();
var curDate = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
date = date.getDate()+"."+(date.getMonth()+1)

var header = '7 Б - '+curDate;
var groupData;
marksList = {"MO":[],"BON":[]};
var state;
var BONUS;

function updateScreen(){
	var studSum = 0;
	var elemYes = document.getElementById('attendYes'); 
	var elemNo = document.getElementById('attendNo');
	elemYes.innerHTML = '';
	elemNo.innerHTML = '';
	groupData.dates[curDate]["ATT"].forEach( function(item, i, arr) {
		//alert(groupData.names[i]+' - '+item);
		if(item || item==-1) {
			var name = groupData.names[i]
			if(item==-1) name+="(оп)";
			elemYes.innerHTML += '<tr><td>'+name+'</td><td>'+groupData.curBonus[i]+'</td><td>'+groupData.dates[curDate]["BON"][i]+'</td><td>'+groupData.dates[curDate]["MO"][i]+'</td></tr>';
			studSum++;
		}						
		else if(!item) {
			elemNo.innerHTML += ('<tr><td>'+groupData.names[i]+'</td><td></td><td></td><td></td></tr>');
		}
	})
	// Вставлено в конце, чтобы счетчик работал
	elemYes.innerHTML = '<tr><th width="50%">Ученик('+studSum+')</th><th width="100px">прошлые + </th><th width="100px">'+date+'\n+</th><th width="100px">'+date+'\nМО</th>'+elemYes.innerHTML;
	if(state == 1) 	document.getElementById('header').innerHTML = header+' - Отмечаем присутствие';
	else 	document.getElementById('header').innerHTML = header;
}
function showMarksList(){	
	/*var alertMsg = '';
	if(marksList['MO'].length){
		alertMsg += 'Монологический ответ:\n';
		for(i in marksList['MO']) alertMsg += (marksList['MO'][i]+'\n');
	}
	if(marksList['BON'].length){
		alertMsg += '\nРабота на уроке:\n';
		for(i in marksList['BON']) alertMsg += (marksList['BON'][i]+'\n');
	}
	alert(alertMsg);*/
	document.getElementById('buttons').hidden = true;
	document.getElementById('groupTable').hidden = true;
	var markStr = '';
	if(marksList['MO'].length){
		markStr += '<h3>Монологический ответ:</h3>';
		for(i in marksList['MO']) markStr += (marksList['MO'][i]+'</br>');
	}
	if(marksList['BON'].length){
		markStr += '<h3>Работа на уроке:</h3>';
		for(i in marksList['BON']) markStr += (marksList['BON'][i]+'</br>');
	}
	if(markStr == '') markStr='Оценок за монологический ответ и работу на уроке пока нет';
	document.getElementById('marksList').innerHTML = markStr;
}

// Нажатие на Закончить отмечать присутствующих
function finishAttend(){
	var element = document.getElementById("finishAttend");
	element.parentNode.removeChild(element);
	document.getElementById('buttons').hidden = false;
	delete element;
	state = 0;
	updateScreen();	
	UIkit.notification('My message');	
}
function addAtt(){
	state = 1;
}
// Функции, обрабатывающие нажатие кнопок
function addLatecomer(){
	state = 2;
}
function addMarkMO(){
	state = 3;	
}
function addBonus(BON){
	state = 4;
	BONUS = BON;
}
function finishLesson(){
	if(confirm("Вы уверены, что хотите закончить урок?")){
	groupData.dates[curDate]["BON"].forEach( function(item, i, arr) {
		groupData.curBonus[i] += item; 
	});
	groupData.curBonus.forEach( function(item, i, arr) {
		if(item >= 5) {
			groupData.dates[curDate]["BON"][i] = 5;
			arr[i] = item%5;
			marksList["BON"].push(groupData.names[i]+" - "+5);
		} else{
			groupData.dates[curDate]["BON"][i] = "";
		}
	});
	showMarksList();
	updateScreen();
////////////////////////////////// Sending data to server ///////////////////////////////
	var xhr = new XMLHttpRequest();
	xhr.open('POST', 'todayData', true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.onreadystatechange = function() {
		console.log(xhr.readyState, xhr.response);
		if (xhr.readyState === 4) {
			if (xhr.response === '') {
				console.log('Нет связи с сервером');
			}
			if(xhr.status != 200){
				alert(xhr.status+':'+xhr.statusText);
			} else {
				
			}
		}
	}
	xhr.send(JSON.stringify(groupData));
}}

////////////// Ask 4 Group Data //////////////
var xhr = new XMLHttpRequest();
	xhr.open('GET', 'getData', true);
	xhr.onreadystatechange = function() {
		console.log(xhr.readyState, xhr.response);
		if (xhr.readyState === 4) {
			if (xhr.response === '') {
				console.log('Нет связи с сервером');
			}
			if(xhr.status != 200){
				alert(xhr.status+':'+xhr.statusText);
			} else {
				groupData = JSON.parse(xhr.responseText);
				groupData.dates[curDate] = {"ATT":[],"BON":[],"MO":[]};
				for(var i = 0; i < groupData.names.length; i++) {
				    groupData.dates[curDate].ATT.push(0);
				    groupData.dates[curDate].BON.push(0);
				    groupData.dates[curDate].MO.push("");
				}
				// Set attendance counting til button is pressed
				addAtt();
				updateScreen();
			}
				
		}
	}
	xhr.send();
//////////////////////////////////////////
function changeDataW(IDNUMBER) {
	switch(state){
	case 0:
		break;
	case 1:
		groupData.dates[curDate]["ATT"][IDNUMBER] = 1;
		break;
	case 2:
		groupData.dates[curDate]["ATT"][IDNUMBER] = -1;
		state = 0;
		break;
	case 3:
		var x = prompt("Введите оценку", 5);
		marksList["MO"].push(groupData.names[IDNUMBER]+" - "+x);
		groupData.dates[curDate]["MO"][IDNUMBER] = x;
		delete x;
		state = 0;
		break;
	case 4:
		groupData.dates[curDate]["BON"][IDNUMBER] = Number(groupData.dates[curDate]["BON"][IDNUMBER])+BONUS;
		state = 0;
		break;		
	}
	updateScreen();	
}
