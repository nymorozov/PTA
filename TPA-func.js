// Set currnet date
var curDate = new Date();
curDate = curDate.getDate()+"-"+(curDate.getMonth()+1)+"-"+curDate.getFullYear();

UIDs = {
   0x000000: 0,
   0x1f1f1f: 1
}
groupData = {
   "names": [
       "Ерохин",
       "Петунина"
   ],
   "curBonus" : [
	   2,3
   ],
   "dates": {
       "14-12-2018": {
	       "ATT":[0,0],
	       "BON":[5,5],
	       "MO":[0,5]
       }       
   }
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

function addValue(COLTYPE,VALUE){
	groupData.dates[curDate][COLTYPE][retID()] = VALUE;
	updateScreen();
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
	elemYes.innerHTML = '<tr><th width="50%">Ученик('+studSum+')</th><th width="100px">сумма + </th><th width="100px">13.12 +</th><th width="100px">13.12 МО</th>'+elemYes.innerHTML;
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
	addValue("ATT",1);
}
function addLatecomer(){
	addValue("ATT",-1);
}
function addMarkMO(){
	var x = prompt("Введите оценку", 5);
	addValue("MO",Number(x));
	delete x;
}
function addBonus(BON){
	groupData.dates[curDate]["BON"][retID()] += BON;
	updateScreen();
}