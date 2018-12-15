// Set currnet date
var date = new Date();
var curDate = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
date = date.getDate()+"."+(date.getMonth()+1)

UIDs = {
   0x000000: 0,
   0x1f1f1f: 1
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

// Set attendance counting til button is pressed
var attendInterval = setInterval(function(){addAtt()}, 1000);

function wait4NFC() {
	var x = prompt("Enter UID", 0x000000);
	return Number(x);
}

function retID() {
	return UIDs[wait4NFC()];
}

function updateScreen(){
	var studSum = 0;
	var elemYes = document.getElementById('attendYes'); 
	var elemNo = document.getElementById('attendNo');
	elemYes.innerHTML = '';
	elemNo.innerHTML = '';
	groupData.dates[curDate]["ATT"].forEach( function(item, i, arr) {
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
function test(){
	addValue("ATT",1);
	updateScreen();
}
// Нажатие на Закончить отмечать присутствующих
function finishAttend(){
	clearInterval(attendInterval);
	var element = document.getElementById("finishAttend");
    element.parentNode.removeChild(element);
    document.getElementById('buttons').hidden = false;
}
// Функции, обрабатывающие нажатие кнопок
function addAtt(){
	groupData.dates[curDate]["ATT"][retID()] = 1;
	updateScreen();
}
function addLatecomer(){
	groupData.dates[curDate]["ATT"][retID()] = -1;
	updateScreen();
}
function addMarkMO(){
	var x = prompt("Введите оценку", 5);
	var idbuf = retID();
	groupData.dates[curDate]["MO"][idbuf] = Number(x);
	updateScreen();
	add2MarkList(idbuf,x);
	delete x,idbuf;
}
function addBonus(BON){
	idbuf = retID();
	groupData.dates[curDate]["BON"][idbuf] = Number(groupData.dates[curDate]["BON"][idbuf])+BON;
	updateScreen();
	delete idbuf;
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
