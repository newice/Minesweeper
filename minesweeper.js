var minesweeper = (function(){
	var field;
	var axis_x;
	var axis_y;
	var initialMinesCnt;
	var minesCnt;
	var cCell ="cell";
	var cell="<td class='"+cCell+" closed'></td>";
	var row="<tr class='row'></tr>";
	var minenFeld;
	var hinweisFeld;
	var objFeld;
	var mine = "M";
	var flag = "X";
	var theEnd;
	var timeCount = -1;
	var intervalCount = 0;
	var minew

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
				handleLeftMouseClick(objFeld[x - 1][y]);
		}
		if ((y > 0) && objFeld[x][y - 1].hasClass('closed')) {
				handleLeftMouseClick(objFeld[x][y - 1]);
		}
		if ((x < axis_x-1) && objFeld[x + 1][y].hasClass('closed')) {
				handleLeftMouseClick(objFeld[x + 1][y]);
		}
		if ((y < axis_y-1) && objFeld[x][y + 1].hasClass('closed')) {
				handleLeftMouseClick(objFeld[x][y + 1]);
		}
		if ((x > 0) && (y > 0) && objFeld[x - 1][y - 1].hasClass('closed')) {
				handleLeftMouseClick(objFeld[x - 1][y - 1]);
		}
		if ((x > 0) && (y < axis_y-1) && objFeld[x - 1][y + 1].hasClass('closed')) {
				handleLeftMouseClick(objFeld[x - 1][y + 1]);
		}
		if ((x < axis_x-1) && (y > 0) && objFeld[x+1][y-1].hasClass('closed')) {
				handleLeftMouseClick(objFeld[x+1][y-1]);
		}
		if ((x < axis_x-1) && (y < axis_y-1) && objFeld[x+1][y+1].hasClass('closed')) {
				handleLeftMouseClick(objFeld[x+1][y+1]);
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
		for(var i =0;i<axis_x;i++) {
			for(var j=0;j<axis_y;j++) {
				rowObj.append($(cell).addClass(cCell+'_'+i+'_'+j));//.text(minenFeld[i][j]));
			}
			field.append(rowObj);
			rowObj = $(row);
		}
		objFeld = new Array(axis_x);
		for(var i = 0; i < axis_x; i++) {
			objFeld[i] = new Array(axis_y);
			for(var j = 0; j < axis_y; j++) {
				objFeld[i][j] = $('.' + cCell + '_' + i + '_' + j, field);
			}
		}
	}

	function endGame(victory) {
		if (!theEnd) {
			theEnd = true;
			field.removeClass('running');
			window.clearInterval(intervalCount);
			for(var i = 0; i < axis_x; i++) {
				for(var j = 0; j < axis_y; j++) {
					if(objFeld[i][j].hasClass('closed') && !(objFeld[i][j].data('right') == flag) && (minenFeld[i][j] == mine)) {
						 objFeld[i][j].css('background','red') ;
						 objFeld[i][j].text(mine) ;
					}
				}
			}
			
			if (victory) {
				var color = 'green';
			} else {
				var color = 'red';
			}
			$('.cell', field).css('border-color', color);
		}
	}

	function initGame(x, y) {
		timeCount = 0;
		$('#mwTimeCounter').text('0');
		intervalCount = window.setInterval(function(){
			$('#mwTimeCounter').text(++timeCount);
		}, 1000);

		buildMinenFeld();
		while (minenFeld[x][y] == mine ) {
			buildMinenFeld();
		}
	}
	function handleLeftMouseClick(obj) {
		var x = (obj.attr('class').split(cCell+'_')[1].split('_')[0]);
		var y = (obj.attr('class').split(cCell+'_')[1].split('_')[1]);
		if (timeCount < 0) {
			initGame(x, y);
		}
		if(obj.hasClass('closed') && !(obj.data('right') == flag) ) {
			obj.removeClass('closed');
			obj.addClass('open');
			if(minenFeld[x][y] != mine ){
				obj.css('background', '#ccc');
				obj.addClass('c_' + minenFeld[x][y])
				if(minenFeld[x][y] == 0 ){
				  obj.text('') ;
				  makeClicks(x,y);
				} else {
				  obj.text(minenFeld[x][y]);
				}

				if(!theEnd && initialMinesCnt >= $('.closed').length) {
					endGame(true);
				 }
			} else {
				 obj.css('background','red') ;
				 obj.text(mine) ;
				 endGame(false);
			}
		}
		if (theEnd) {
			if (obj.data('right') == flag && minenFeld[x][y] == mine) {
				obj.css('background', 'green');
			}
			if (obj.data('right') == flag && minenFeld[x][y] != mine) {
				obj.css('background', 'yellow');
			}
		}
	}
	function handleRightMouseClick(obj) {
		if((timeCount >= 0) && obj.hasClass('closed')) {
			if(!obj.data('right')){
				obj.data('right', flag);
				obj.text(flag) ;
				$('.minesCount').text(--minesCnt);
			} else if(obj.data('right') == flag){
				$('.minesCount').text(++minesCnt);
				obj.data('right', "?");
				obj.text('?');
			} else if(obj.data('right') == "?"){
				obj.data('right', "");
				obj.text('') ;
			}
		}
	}

	function handleMousedown(event, aa){
		if (!theEnd) {
			var obj = $(this);
			switch (event.which) {
			case 1:
				console.profile();
				handleLeftMouseClick(obj);
				console.profileEnd();
				break;
			case 3:
				handleRightMouseClick(obj);
			break;
			default:
				alert('komische maus');
			}
		}
	}

	function init(conf) {
		axis_x = parseInt(conf.x);
		axis_y = parseInt(conf.y);
		initialMinesCnt = parseInt(conf.mines);
		minesCnt = initialMinesCnt;
		window.clearInterval(intervalCount);
		if (minesCnt >= (axis_x * axis_y)) {
			alert ('Zu viele Minen!');
		} else {
			field = conf.area;
			theEnd = false;
			field.addClass('running');
			$('.minesCount').text(initialMinesCnt);
			build();
			$('.closed.' + cCell ,field).mousedown(handleMousedown);
			timeCount = -1;
			$('#mwTimeCounter').text('');
		}
	}

  return{
		init:init
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