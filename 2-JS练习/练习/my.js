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
	
	clearInterval( obj.doMove );
	
	obj.doMove = setInterval(function () {
		
		var speed = parseInt(getStyle( obj, attr )) + dir;			// 步长
		
		if ( speed > target && dir > 0 ||  speed < target && dir < 0  ) {
			speed = target;
		}
		
		obj.style[attr] = speed + 'px';
		
		if ( speed == target ) {
			clearInterval( obj.doMove );
			
			/*
			if ( endFn ) {
				endFn();
			}
			*/
			endFn && endFn();
			
		}
		
	}, 100);
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

function opacity(obj, dir, target, endFn){ //对象透明度变化
		dir = (getStyle( obj, 'opacity' )*100) < target ? dir : -dir;

		clearInterval( obj.opacity );
		obj.opacity = setInterval(function () {
			
			var speed = (getStyle( obj, 'opacity' )*100) + dir;			// 步长
			
			if ( speed > target && dir > 0 ||  speed < target && dir < 0  ) {
				speed = target;
			}
			
			obj.style.opacity = parseFloat(speed/100);
			
			if ( speed == target ) {
				clearInterval( obj.opacity );
				
				endFn && endFn();
				
			}
			
		}, 100);
	}

function backgroundColorRGBA(obj, dir, target, endFn){ //对象背景颜色的变化
		var str = getStyle(obj,'backgroundColor') + '';
		var patt1 = /([1-9]\d*\.\d*)|(0\.\d*)|([0-9]\d*)/g;
		arr = str.match(patt1);
		var r =parseInt(arr[0]);
		var g =parseInt(arr[1]);
		var b =parseInt(arr[2]);
		if (arr[3]) {
			var a =parseInt(arr[3]*100);
		}else{
			var a = 100;
		}
		dir = a < target ? dir : -dir;

		clearInterval( obj.bgrgba );
		obj.bgrgba = setInterval(function () {
			str = getStyle(obj,'backgroundColor') + '';
			patt1 = /([1-9]\d*\.\d*)|(0\.\d*)|([0-9]\d*)/g;
			arr = str.match(patt1);
			if (arr[3]) {
				var a =parseInt(arr[3]*100);
			}else{
				var a = 100;
			}
			
			var speed = a + dir;			// 步长
			if ( speed > target && dir > 0 ||  speed < target && dir < 0  ) {
				speed = target;
			}

			obj.style.backgroundColor = 'rgba('+r+','+g+','+b+','+speed/100+')';
			
			if ( speed == target ) {
				clearInterval( obj.bgrgba );
				
				endFn && endFn();
				
			}
			
		}, 100);
	}