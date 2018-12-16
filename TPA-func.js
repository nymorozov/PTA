// Set currnet date
var date = new Date();
var curDate = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
date = date.getDate()+"."+(date.getMonth()+1)

UIDs = {
   0x000001: 0,
   0x000002: 1,
   0x000003: 2,
}

groupData.dates[curDate] = {"ATT":[],"BON":[],"MO":[]};
for(var i = 0; i < groupData.names.length; i++) {
    groupData.dates[curDate].ATT.push(0);
    groupData.dates[curDate].BON.push(0);
    groupData.dates[curDate].MO.push("");
}
marksList = [];
function add2MarkList(ID,MARK){
	marksList.push(groupData.names[ID]+" - "+MARK);
}

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
}
function showMarksList(){
	if(marksList.length){
		alert(marksList);
	}
	
}

// Нажатие на Закончить отмечать присутствующих
function finishAttend(){
	var element = document.getElementById("finishAttend");
	element.parentNode.removeChild(element);
	document.getElementById('buttons').hidden = false;
	delete element;
}
function addAtt(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'wait4NFC', true);
	xhr.onreadystatechange = function() {
		console.log(xhr.readyState, xhr.response);
		if (xhr.readyState === 4) {
			if (xhr.response === '') {
				output.innerHTML = 'Нет связи с сервером';
			}
			if(xhr.status != 200){
				alert(xhr.status+':'+xhr.statusText);
			} else {
				groupData.dates[curDate]["ATT"][xhr.responseText] = 1;
				updateScreen();
				if(document.getElementById("finishAttend") != null) addAtt();
			}
		}
	}
	xhr.send();
}
// Функции, обрабатывающие нажатие кнопок
function addLatecomer(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'wait4NFC', true);
	xhr.onreadystatechange = function() {
		console.log(xhr.readyState, xhr.response);
		if (xhr.readyState === 4) {
			if (xhr.response === '') {
				output.innerHTML = 'Нет связи с сервером';
			}
			if(xhr.status != 200){
				alert(xhr.status+':'+xhr.statusText);
			} else {
				groupData.dates[curDate]["ATT"][xhr.responseText] = -1;
				updateScreen();
			}
		}
	}
	xhr.send();
}
function addMarkMO(){
	var x = prompt("Введите оценку", 5);
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'wait4NFC', true);
	xhr.onreadystatechange = function() {
		console.log(xhr.readyState, xhr.response);
		if (xhr.readyState === 4) {
			if (xhr.response === '') {
				output.innerHTML = 'Нет связи с сервером';
			}
			if(xhr.status != 200){
				alert(xhr.status+':'+xhr.statusText);
			} else {
				groupData.dates[curDate]["MO"][xhr.responseText] = x;
				updateScreen();
			}
		}
	}
	xhr.send();
	add2MarkList(idbuf,x);
	delete x;
}
function addBonus(BON){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'wait4NFC', true);
	xhr.onreadystatechange = function() {
		console.log(xhr.readyState, xhr.response);
		if (xhr.readyState === 4) {
			if (xhr.response === '') {
				output.innerHTML = 'Нет связи с сервером';
			}
			if(xhr.status != 200){
				alert(xhr.status+':'+xhr.statusText);
			} else {
				groupData.dates[curDate]["BON"][xhr.responseText] = Number(groupData.dates[curDate]["BON"][xhr.responseText])+BON;
				updateScreen();
			}
		}
	}
	xhr.send();
}
function finishLesson(){
	groupData.dates[curDate]["BON"].forEach( function(item, i, arr) {
		groupData.curBonus[i] += item; 
	});
	groupData.curBonus.forEach( function(item, i, arr) {
		if(item >= 5) {
			groupData.dates[curDate]["BON"][i] = 5;
			arr[i] = item%5;
			add2MarkList(i,5);
		} else{
			groupData.dates[curDate]["BON"][i] = "";
		}
	});
	showMarksList();
	updateScreen();
}
