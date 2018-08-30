var miaov = {};

miaov.timeScroll = null;  //挂载整屏切换动画的实例

miaov.init = function(){

	miaov.resize(); //设置每一屏的高度和top值

	miaov.events(); //配置事件

	miaov.configIntAnimate();//配置导航条的动画

	miaov.button3D(".start",".state1",".state2",0.3);

	$("body").height(8500);

	miaov.configTimeScroll(); //配置横屏切换的动画
}

$(document).ready( miaov.init );

//配置事件
miaov.events = function(){
	$(window).resize( miaov.resize );

	miaov.nav(); //执行导航条的鼠标移入移除的动画

	//干掉浏览器默认的滚动行为

	$(".wrapper").bind("mousewheel",function(ev){
		ev.preventDefault();
	});

	$(".wrapper").one("mousewheel",mousewheelFn);

	var timer = null;
	function mousewheelFn(ev,direction){
		if( direction<1 ){  //向下滚动
			console.log("next");
		}else{  //向上滚动
			console.log("prev");
		};
		clearTimeout(timer);
		timer = setTimeout(function(){
			$(".wrapper").one("mousewheel",mousewheelFn);
		},1200)
	}


};

//配置整屏切换的动画以及每一屏中的小动画

miaov.configTimeScroll = function(){
	miaov.timeScroll = new TimelineMax();

		miaov.timeScroll.add("step1");
	miaov.timeScroll.to(".scene2",0.8,{top:0,ease:Cubic.easeInOut});
		miaov.timeScroll.add("step2");
	miaov.timeScroll.to(".scene3",0.8,{top:0,ease:Cubic.easeInOut});
		miaov.timeScroll.add("step3");
	miaov.timeScroll.to(".scene4",0.8,{top:0,ease:Cubic.easeInOut});
		miaov.timeScroll.add("step4");
	miaov.timeScroll.to(".scene5",0.8,{top:0,ease:Cubic.easeInOut});
		miaov.timeScroll.add("step5");

	miaov.timeScroll.stop();
}

//配置导航条的动画
miaov.configIntAnimate = function(){
	var initAnimate = new TimelineMax();

	initAnimate.to( ".menu",0.5,{opacity:1} );
	initAnimate.to( ".menu",0.5,{left:22},"-=0.3" );
	initAnimate.to( ".nav",0.5,{opacity:1} );

	//设置首屏的动画

	initAnimate.to(".scene1_logo",0.5,{opacity:1});
	initAnimate.staggerTo( ".scene1_1 img",2,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.2 );
	initAnimate.to(".light_left",0.7,{rotationZ:0,ease:Cubic.easeOut},"-=2");
	initAnimate.to(".light_right",0.7,{rotationZ:0,ease:Cubic.easeOut},"-=2");
	initAnimate.to(".controls",0.5,{bottom:20,opacity:1},"-=0.7");

	initAnimate.to("body",0,{"overflow-y":"scroll"});
}

// 导航条中的动画

miaov.nav = function(){
	var navAnimate = new TimelineMax();
	$(".nav a").bind("mouseenter",function(){
		var w = $(this).width();
		var l = $(this).offset().left;
		navAnimate.clear();
		navAnimate.to(".line",0.4,{opacity:1,left:l,width:w});
	});

	$(".nav a").bind("mouseleave",function(){
		navAnimate.clear();
		navAnimate.to(".line",0.4,{opacity:0});
	});

	//鼠标移入 language 要显示 dropdown

	var languageAinimate = new TimelineMax();

	$(".language").bind("mouseenter",function(){
		languageAinimate.clear();
		languageAinimate.to(".dropdown",0.5,{opacity:1,"display":"block"});
	});

	$(".language").bind("mouseleave",function(){
		languageAinimate.clear();
		languageAinimate.to(".dropdown",0.5,{opacity:0,"display":"none"});
	});

	//调出左侧的导航条

	$(".btn_mobile").click(function(){
		var m_aimate = new TimelineMax();
		m_aimate.to(".left_nav",0.5,{left:0});
	});

	$(".l_close").click(function(){
		var l_aimate = new TimelineMax();
		l_aimate.to(".left_nav",0.5,{left:-300});
	})

};

// 3D翻转效果
miaov.button3D = function(obj,element1,element2,d){
	var button3DAnimate = new TimelineMax();

	button3DAnimate.to( $(obj).find(element1),0,{rotationX:0,transformPerspective:600,transformOrigin:"center bottom"} );
	button3DAnimate.to( $(obj).find(element2),0,{rotationX:-90,transformPerspective:600,transformOrigin:"top center"} );

	$(obj).bind("mouseenter",function(){
		var enterAnimate = new TimelineMax();

		var ele1 = $(this).find(element1);
		var ele2 = $(this).find(element2);

		enterAnimate.to(ele1,d,{rotationX:90,top:-ele1.height(),ease:Cubic.easeInOut},0);
		enterAnimate.to(ele2,d,{rotationX:0,top:0,ease:Cubic.easeInOut},0);
	});

	$(obj).bind("mouseleave",function(){
		var leaveAinimate = new TimelineMax();

		var ele1 = $(this).find(element1);
		var ele2 = $(this).find(element2);

		leaveAinimate.to(ele1,d,{rotationX:0,top:0,ease:Cubic.easeInOut},0);
		leaveAinimate.to(ele2,d,{rotationX:-90,top:ele2.height(),ease:Cubic.easeInOut},0);
	});
}

//设置每一屏的高度和top值
miaov.resize = function(){

	$(".scene").height( $(window).height() )// 设置每一屏的height
	$(".scene:not(':first')").css("top",$(window).height());

	if( $(window).width() <= 950 ){
		$("body").addClass("r950");
		$(".menu").css("top",0)
	}else{
		$("body").removeClass("r950");
		$(".menu").css("top",22)
	}

}