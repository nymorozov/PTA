UIDs = {
   0x000000: 0,
   0x1f1f1f: 1
}
GroupData = {
   "names": [
       "Ерохин",
       "Петунина"
   ],
   "curBonus" : [
	   2,3
   ],
   "dates": {
       "13-12-18": {
	       "ATT":[0,0],
	       "BON":[5,5],
	       "MO":[0,5]
       }       
   }
}

curDate = "13-12-18";

function wait4NFC() {
	return 0x1f1f1f;
}

function retID() {
	return UIDs[wait4NFC()];
}

function addValue(COLTYPE,VALUE){
	GroupData.dates[curDate][COLTYPE][retID()] = VALUE;
	updateScreen();
}

function updateScreen(){
	document.getElementById('testScreen').innerHTML = JSON.stringify(GroupData);
}


function test(){
	addValue("ATT",1);
	updateScreen();
}

// Функции, обрабатывающие нажатие кнопок
function addLatecomer(){
	addValue("ATT","оп");
}
function addMarkMO(){
	var x = prompt("Введите оценку", 5);
	addValue("MO",Number(x));
	delete x;
}
function addBonus(BON){
	var x = GroupData.dates[curDate]["BON"][retID()];
	x += BON;
	addValue("BON",x);
	delete x;
}