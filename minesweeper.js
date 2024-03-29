var minesweeper = (function(){
	var field;
	var axis_x;
	var axis_y;
	var initialMinesCnt;
	var minesCnt;
	var cCell = 'cell';
	var row = '<tr class="row"></tr>';
	var minenFeld;
	var hinweisFeld;
	var objFeld;
	var mine = "M";
	var flag = "X";
	var theEnd;
	var timeCount = -1;
	var intervalCount = 0;
	var minew;
	minesDebug = false; // must beglobal

	function setHints(x,y) {
		if(x > 0){
			if(minenFeld[x-1][y] !=mine) minenFeld[x-1][y]++;
		}
		if(y > 0){
			if(minenFeld[x][y-1] !=mine) minenFeld[x][y-1]++;
		}
		if(x < axis_x-1){
			if(minenFeld[x+1][y] !=mine) minenFeld[x+1][y]++;
		}
		if(y < axis_y-1){
			if(minenFeld[x][y+1] !=mine) minenFeld[x][y+1]++;
		}
		if((x > 0) && (y > 0)){
			if(minenFeld[x-1][y-1] !=mine) minenFeld[x-1][y-1]++;
		}
		if((x > 0) && (y < axis_y-1)){
			if(minenFeld[x-1][y+1] !=mine) minenFeld[x-1][y+1]++;
		}
		if((x < axis_x-1) && (y > 0)){
			if(minenFeld[x+1][y-1] !=mine) minenFeld[x+1][y-1]++;
		}
		if((x < axis_x-1) && (y < axis_y-1)){
			if(minenFeld[x+1][y+1] !=mine) minenFeld[x+1][y+1]++;
		}
	}

	function makeClicks(x,y) {
		x = parseInt(x);
		y = parseInt(y);

		var temp;
		if ((x > 0) && objFeld[x - 1][y].hasClass('closed')) {
				handleLeftMouseClick(x - 1, y);
		}
		if ((y > 0) && objFeld[x][y - 1].hasClass('closed')) {
				handleLeftMouseClick(x, y - 1);
		}
		if ((x < axis_x-1) && objFeld[x + 1][y].hasClass('closed')) {
				handleLeftMouseClick(x + 1, y);
		}
		if ((y < axis_y-1) && objFeld[x][y + 1].hasClass('closed')) {
				handleLeftMouseClick(x, y + 1);
		}
		if ((x > 0) && (y > 0) && objFeld[x - 1][y - 1].hasClass('closed')) {
				handleLeftMouseClick(x - 1, y - 1);
		}
		if ((x > 0) && (y < axis_y-1) && objFeld[x - 1][y + 1].hasClass('closed')) {
				handleLeftMouseClick(x - 1, y + 1);
		}
		if ((x < axis_x-1) && (y > 0) && objFeld[x+1][y-1].hasClass('closed')) {
				handleLeftMouseClick(x + 1, y - 1);
		}
		if ((x < axis_x-1) && (y < axis_y-1) && objFeld[x+1][y+1].hasClass('closed')) {
				handleLeftMouseClick(x + 1, y + 1);
		}
	}

	function buildMinenFeld() {
		var minen = minesCnt;
		minenFeld = new Array(axis_x);
		for(var i=0;i<axis_x;i++){
			minenFeld[i] = new Array(axis_y);
			for(j=0;j<axis_y;j++){
				minenFeld[i][j]=0;
			}
		}

		while(minen > 0){
			var tempX = parseInt( Math.random() *axis_x );
			var tempY = parseInt( Math.random() *axis_y );
			if (minenFeld[tempX][tempY]!=mine){
				minenFeld[tempX][tempY]=mine;
				minen--;
				setHints(tempX,tempY);
			}
		}
	}

	function build() {
		field.html('');
		var rowObj = $(row);
		objFeld = new Array(axis_x);
		for(var i =0;i<axis_x;i++) {
			objFeld[i] = new Array(axis_y);
			for(var j=0;j<axis_y;j++) {
				objFeld[i][j] = $('<td class="' + cCell + ' closed" onmousedown="minesweeper.clickField(arguments[0], ' + i + ', ' + j + ');"></td>');
				rowObj.append(objFeld[i][j]);//.addClass(cCell+'_'+i+'_'+j));//.text(minenFeld[i][j]));
			}
			field.append(rowObj);
			rowObj = $(row);
		}
	}

	function endGame(victory) {
		if (!theEnd) {
			theEnd = true;
			field.removeClass('running');
			window.clearInterval(intervalCount);
			for(var i = 0; i < axis_x; i++) {
				for(var j = 0; j < axis_y; j++) {
					if (objFeld[i][j].hasClass('closed')) {
						objFeld[i][j].toggleClass('mine', minenFeld[i][j] == mine);
						objFeld[i][j].toggleClass('noMine', minenFeld[i][j] != mine);
					}
				}
			}
			field.addClass(victory ? 'win' : 'loose');
		}
	}

	function initGame(x, y) {// x, y coordinates of the first click
		timeCount = 0;
		$('#mwTimeCounter').text('0');
		intervalCount = window.setInterval(function(){
			$('#mwTimeCounter').text(++timeCount);
		}, 1000);

		do { // minimum one time
		buildMinenFeld();
		} while (minenFeld[x][y] == mine ) 
	}

	function handleLeftMouseClick(x, y) {
		if (timeCount < 0) {
			initGame(x, y);
		}
		var obj = objFeld[x][y];
		if(obj.hasClass('closed') && !(obj.data('right') == flag) ) {
			if(minenFeld[x][y] != mine ){
				obj.removeClass('closed');
				obj.addClass('open');
				obj.addClass('c_' + minenFeld[x][y])
				if(minenFeld[x][y] == 0 ){
					obj.text('');
				  makeClicks(x,y);
				} else {
				  obj.text(minenFeld[x][y]);
				}

				if(!theEnd && initialMinesCnt >= $('.closed').length) {
					endGame(true);
				 }
			} else {
				 obj.css('background-color','red') ;
				 endGame(false);
			}
		}
	}


	function handleRightMouseClick(obj) {
		if((timeCount >= 0) && obj.hasClass('closed')) {
			if(!obj.data('right')){
				obj.addClass('mineSuspect');
				obj.data('right', flag);
				$('.minesCount').text(--minesCnt);
			} else if(obj.data('right') == flag){
				$('.minesCount').text(++minesCnt);
				obj.addClass('noIdea');
				obj.removeClass('mineSuspect');
				obj.data('right', "?");
				obj.text('?');
			} else if(obj.data('right') == "?"){
				obj.data('right', '');
				obj.removeClass('noIdea');
				obj.text('') ;
			}
		}
	}

	function handleMousedown(e, x, y){
		if (!theEnd) {
			switch (e.which) {
			case 1:
				if (minesDebug) console.profile();
				handleLeftMouseClick(x, y);
				if (minesDebug) console.profileEnd();
				break;
			case 3:
				handleRightMouseClick(objFeld[x][y]);
			break;
			default:
				alert('komische maus');
			}
		}
	}

	function init(conf) {
		if (minesDebug) console.profile();
		axis_x = parseInt(conf.x);
		axis_y = parseInt(conf.y);
		initialMinesCnt = parseInt(conf.mines);
		minesCnt = initialMinesCnt;
		window.clearInterval(intervalCount);
		if (minesCnt >= (axis_x * axis_y)) {
			alert ('Zu viele Minen!');
		} else {
			theEnd = false;
			$('.minesCount').text(initialMinesCnt);
			field = conf.area;
			field.addClass('running');
			field.removeClass('win');
			field.removeClass('loose');
			build();
			$('.content').css('width', (axis_y + 1) * 24 +13);
			$('#minesweeper').css('width', field.outerWidth());
			timeCount = -1;
			$('#mwTimeCounter').text('');
		}
		if (minesDebug) console.profileEnd();
	}

  return{
		init:init,
		clickField: handleMousedown
	}
})();
document.oncontextmenu = function(e){
  if (!e)
	e = window.event;
  if ((e.type && e.type == "contextmenu") || (e.button && e.button == 2) || (e.which && e.which == 3)) {
	return false;
  }
}

$(document).ready(function(){
	/**
	 * Aktive Buttons hervorheben
	 */
	$('.button').click(function(){
		$('.button').removeClass('act');
		$(this).addClass('act');
	});


	$('input[name="newGame"]').click(function(){
		minesweeper.init({
			area:$('.area'),
			x:$('.cfgCustom[name="axis_x"]').val(),
			y:$('.cfgCustom[name="axis_y"]').val(),
			mines:$('.cfgCustom[name="mines_num"]').val()
		})
	});
	$('.button.easy').click(function(){
		minesweeper.init({
			area:$('.area'),
			x:9,
			y:9,
			mines:10
		})
	});
	$('.button.easy').click();
	$('.button.middle').click(function(){
		minesweeper.init({
			area:$('.area'),
			x:16,
			y:16,
			mines:40
		})
	});
	$('.button.hard').click(function(){
		minesweeper.init({
			area:$('.area'),
			x:16,
			y:30,
			mines:99
		})
	});


});