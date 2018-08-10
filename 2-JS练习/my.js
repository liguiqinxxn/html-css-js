// JavaScript Document

function $( v ){ 
	if( typeof v === 'function' ){
		window.onload = v;
	} else if ( typeof v === 'string' ) {
		return document.getElementById(v);
	} else if ( typeof v === 'object' ) {
		return v;
	}
}

function getStyle( obj, attr ){  //获取对象的属性
	return (obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle( obj )[attr]);
}

//让对象动起来
function doMove ( obj, attr, dir, target, endFn ) { 
	
	dir = parseInt(getStyle( obj, attr )) < target ? dir : -dir;
	
	clearInterval( obj.timer );
	
	obj.timer = setInterval(function () {
		
		var speed = parseInt(getStyle( obj, attr )) + dir;			// 步长
		
		if ( speed > target && dir > 0 ||  speed < target && dir < 0  ) {
			speed = target;
		}
		
		obj.style[attr] = speed + 'px';
		
		if ( speed == target ) {
			clearInterval( obj.timer );
			
			/*
			if ( endFn ) {
				endFn();
			}
			*/
			endFn && endFn();
			
		}
		
	}, 30);
}

function shake ( obj, attr, endFn ) { //对象抖动
	if(!obj.onoff){
		var pos = parseInt( getStyle(obj, attr) );
		var arr = [];// 20, -20, 18, -18 ..... 0
		var timer = null;
		var num = 0;
			
		for ( var i=20; i>0; i-=2 ) {
			arr.push( i, -i );
		}
		arr.push(0);
			
		clearInterval( obj.shake );
		obj.shake = setInterval(function (){
			obj.style[attr] = pos + arr[num] + 'px';
			num++;
			if ( num === arr.length ) {
				clearInterval( obj.shake );
				endFn && endFn();
				obj.onoff = false;
			}
		}, 50);
		obj.onoff = true;
	}
}
