// Set current date
var date = new Date();
var curDate = "";
if(date.getDate() < 10) curDate += '0'+date.getDate()+".";
	else curDate += (date.getMonth()+1)+".";
if(date.getMonth() < 9) curDate += '0'+(date.getMonth()+1)+".";
	else curDate += (date.getMonth()+1)+".";
curDate += (date.getFullYear()-2000);

date = curDate.slice(0,-3);

var notifTimer = 3000;
var grName = ''
var groupData;
marksList = {"MO":[],"BON":[]};
var state;
var BONUS;
var curLessonData;

function updateScreen(){
	var studSum = 0;
	var elemYes = document.getElementById('attendYes'); 
	var elemNo = document.getElementById('attendNo');
	elemYes.innerHTML = '';
	elemNo.innerHTML = '';
	curLessonData["ATT"].forEach( function(item, i, arr) {
		//alert(groupData.names[i]+' - '+item);
		if(item || item==-1) {
			var name = groupData.names[i]
			if(item==-1) name+="(оп)";
			elemYes.innerHTML += '<tr><td>'+name+'</td><td>+'+groupData.curBonus[i]+'</td><td>'+curLessonData["BON"][i]+'</td><td>'+curLessonData["MO"][i]+'</td></tr>';
			studSum++;
		}						
		else if(!item) {
			elemNo.innerHTML += ('<tr><td>'+groupData.names[i]+'</td><td></td><td></td><td></td></tr>');
		}
	})
	// Вставлено в конце, чтобы счетчик работал
	elemYes.innerHTML = '<tr><th width="50%">Ученик ('+studSum+')</th><th width="100px">прошлые бонусы</th><th width="100px">бонусы</br>'+date+'</th><th width="100px">МО</br>'+date+'</th>'+elemYes.innerHTML;
	if(state == 1) 	document.getElementById('header').innerHTML = grName+' - '+curDate+' - Отмечаем присутствие';
	else 	document.getElementById('header').innerHTML = grName+' - '+curDate;
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
	UIkit.notification("<span uk-icon='icon: check'></span>Закончили отмечать присутствующих", {timeout: notifTimer});	
}
function addAtt(){
	state = 1;
}
// Функции, обрабатывающие нажатие кнопок
function addLatecomer(){
	UIkit.notification("Добавим опоздавшего", {timeout: notifTimer});	
	state = 2;
}
function addMarkMO(){
	UIkit.notification("Оценим монологический ответ", {timeout: notifTimer});
	state = 3;	
}
function addBonus(BON){
	BONUS = BON;
	if(BON > 0) BON = '+'+BON;
	UIkit.notification("Добавим "+BON, {timeout: notifTimer});
	state = 4;	
}
function finishLesson(){
	if(confirm("Вы уверены, что хотите закончить урок?")){
	curLessonData["BON"].forEach( function(item, i, arr) {
		groupData.curBonus[i] += item; 
	});
	groupData.curBonus.forEach( function(item, i, arr) {
		if(item >= 5) {
			curLessonData["BON"][i] = 5;
			arr[i] = item%5;
			marksList["BON"].push(groupData.names[i]+" - "+5);
		} else{
			curLessonData["BON"][i] = "";
		}
	});
	document.getElementById('buttons').hidden = true;
	document.getElementById('groupTable').hidden = true;
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
function askForGrData() {	
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
				groupData.dates.push({"date":curDate,"ATT":[],"BON":[],"MO":[]});
				curLessonData = groupData.dates[groupData.dates.length - 1];
				for(var i = 0; i < groupData.names.length; i++) {
				    curLessonData.ATT.push(0);
				    curLessonData.BON.push(0);
				    curLessonData.MO.push("");
				}
				// Set attendance counting til button is pressed
				addAtt();
				updateScreen();
			}
				
		}
	}
	xhr.send();
}
//////////////////////////////////////////
function changeDataW(IDNUMBER) {
	switch(state){
	case 0:
		break;
	case 1:
		curLessonData["ATT"][IDNUMBER] = 1;
		break;
	case 2:
		curLessonData["ATT"][IDNUMBER] = -1;
		state = 0;
		break;
	case 3:
		var x = prompt("Введите оценку", 5);
		marksList["MO"].push(groupData.names[IDNUMBER]+" - "+x);
		curLessonData["MO"][IDNUMBER] = x;
		delete x;
		state = 0;
		showMarksList();
		UIkit.notification(groupData.names[IDNUMBER]+" получает "+x+" за монологический ответ.", {timeout: notifTimer});	
		break;
	case 4:
		curLessonData["BON"][IDNUMBER] = Number(curLessonData["BON"][IDNUMBER])+BONUS;
		state = 0;
		UIkit.notification(groupData.names[IDNUMBER]+" получает "+BONUS+" к бонусным баллам.", {timeout: notifTimer});
		break;		
	}
	updateScreen();	
}
////////////////////////////////////////////
function groupPick(GRNAME){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'grName'+GRNAME, true);
	xhr.onreadystatechange = function() {
		console.log(xhr.readyState, xhr.response);
		if (xhr.readyState === 4) {
			if (xhr.response === '') {
				console.log('Нет связи с сервером');
			}
			if(xhr.status != 200){
				alert(xhr.status+':'+xhr.statusText);
			} else {
				grName = document.getElementById(GRNAME).innerHTML;
				document.getElementById('grNamePick').hidden = true;
				document.getElementById('main').hidden = false;
				askForGrData();
			}
				
		}
	}
	xhr.send();
}
