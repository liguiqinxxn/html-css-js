// 弹性运动
function animate(obj,oTarget,fnCallBack,fnDuring){
	if(obj.timer)clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		var bStop=true;
		var attr='';
		var speed=0;
		var cur=0;
		for(attr in oTarget){
			if(!obj.oSpeed)obj.oSpeed={};
			if(!obj.oSpeed[attr])obj.oSpeed[attr]=0;
			cur=css(obj, attr);
			if(Math.abs(oTarget[attr]-cur)>1 || Math.abs(obj.oSpeed[attr])>1){
				bStop=false;		
				obj.oSpeed[attr]+=(oTarget[attr]-cur)/5;
				obj.oSpeed[attr]*=0.7;
				var maxSpeed=65;
				if(Math.abs(obj.oSpeed[attr])>maxSpeed){
					obj.oSpeed[attr]=obj.oSpeed[attr]>0?maxSpeed:-maxSpeed;
				}
				css(obj, attr, cur+obj.oSpeed[attr]);
			}
		}
		if(fnDuring){
			fnDuring.call(obj);//运动过程中执行
		}
		if(bStop){
			clearInterval(obj.timer);
			obj.timer=null;
			if(fnCallBack){
				fnCallBack.call(obj);//运动结束后执行
			}
		}
	}, 15);
}
function css(obj, attr, value){
	if(arguments.length==2){
		return parseFloat(obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj, false)[attr]);
	}else if(arguments.length==3){
		switch(attr){
			case 'width':
			case 'height':
			case 'paddingLeft':
			case 'paddingTop':
			case 'paddingRight':
			case 'paddingBottom':
				 value=Math.max(value,0);
			case 'left':
			case 'top':
			case 'marginLeft':
			case 'marginTop':
			case 'marginRight':
			case 'marginBottom':
				obj.style[attr]=value+'px';
				break;
			case 'opacity':
				obj.style.filter="alpha(opacity:"+value*100+")";
				obj.style.opacity=value;
				break;
			default:
				obj.style[attr]=value;
		}
	}
	return function (attr_in, value_in){
		css(obj, attr_in, value_in);
	};
}