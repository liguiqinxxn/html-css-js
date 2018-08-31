var miaov = {};

miaov.timeScroll = null;  //挂载整屏切换动画的实例

miaov.currentStep = "step1";

miaov.init = function(){

	miaov.resize(); //设置每一屏的高度和top值

	miaov.events(); //配置事件

	miaov.configIntAnimate(); //配置导航条的动画

	miaov.button3D(".start",".state1", ".state2",0.3);

	$("body").height(8500);

	miaov.configTimeScroll(); //配置整屏切换的动画

	twoAnimate.init(); //执行第二屏里面的动画
}

$(document).ready( miaov.init );

// 配置事件
miaov.events = function(){
	
	miaov.nav(); //执行导航条的鼠标移入移除的动画

	// 每次刷新将滚动条置0的位置
	$(window).bind("scroll",scrollFn);
	function scrollFn(){
		$(window).scrollTop(0);
	}

	//在滚动条滚动的过程中，计算页面中应该到哪一个时间点上去
	$(window).bind("scroll",miaov.scrollStatus);

	//当mousedown的时候，解除scroll事件对应的scrollFn
	$(window).bind("mousedown",function(){
		$(window).unbind("scroll",scrollFn);
	})

	// 当mouseup的时候，让当前这一屏到达某个状态
	$(window).bind("mouseup",miaov.mouseupFn);

	// 干掉浏览器默认的滚动行为
	$(".wrapper").bind("mousewheel",function(ev){
		ev.preventDefault();
	});
	$(".wrapper").one("mousewheel",mousewheelFn);

	var timer = null;
	function mousewheelFn(ev,direction){
		$(window).unbind("scroll",scrollFn); //解除scroll事件对应的scrollFn
		if ( direction<1 ) {  //向下滚动
			// console.log("next");
			miaov.changeStep("next");
		}else{
			// console.log("prev");
			miaov.changeStep("prev");
		};
		clearTimeout(timer);
		timer = setTimeout(function(){
			$(".wrapper").one("mousewheel",mousewheelFn);
		},1200);
	}

	$(window).resize( miaov.resize );

}
//当mouseup的时候，让当前这一屏到达某个状态
miaov.mouseupFn = function(){
	//在滚动过程中计算出一个比例
	var scale = miaov.scale();
	//得到当前页面到达的某个时间点
	var times = scale * miaov.timeScroll.totalDuration();

	//获取到上一个状态和下一个状态
	var prevStep = miaov.timeScroll.getLabelBefore(times);
	var nextStep = miaov.timeScroll.getLabelAfter(times);

	//获取到上一个状态的时间和下一个状态的时间
	var prevTime = miaov.timeScroll.getLabelTime(prevStep);
	var nextTime = miaov.timeScroll.getLabelTime(nextStep);

	// 计算差值
	var prevDvalue = Math.abs( prevTime - times );
	var nextDvalue = Math.abs( nextTime - times );

	var step = "";
	if ( scale === 0) {
		step = "step1";
	}else if( scale === 1){
		step = "step5";
	}else if (prevDvalue < nextDvalue) {
		step = prevStep;
	}else{
		step = nextStep;
	};

	miaov.timeScroll.tweenTo(step);
	//-----------------当松开鼠标时候，控制滚动条到达某个状态计算出的距离-----------------------
	//获取动画的总时长
	var totalTime = miaov.timeScroll.totalDuration();
	//获取到要到达的状态的时间
	var afterTime = miaov.timeScroll.getLabelTime(step);
	//获取到滚动条能够滚动的最大的高度
	var maxH = $("body").height() - $(window).height();
	//计算出滚动条滚动的距离
	var positionY = afterTime/totalTime * maxH;
	//滚动条滚动的距离的持续时间
	var d = Math.abs(miaov.timeScroll.time() - afterTime );

	var scrollAnimate = new TimelineMax;

	scrollAnimate.to("html,body",d,{scrollTop:positionY});

	miaov.currentStep = step;
}

//计算滚动条在滚动过程中的一个比例
miaov.scale = function(){
	var scrollT = $(window).scrollTop();
	var MaxH = $("body").height() - $(window).height();
	var s = scrollT/MaxH;
	return s; 
}

//在滚动条滚动的过程中，计算页面中应该到哪一个时间点上去
miaov.scrollStatus = function(){
	var times = miaov.scale() * miaov.timeScroll.totalDuration();
	//当滚动条在滚动的过程中，让页面中的动画到打某个时间点
	miaov.timeScroll.seek(times,false);
}

// 切换整屏并且计算滚动条的距离

miaov.changeStep = function(value){
	//获取当前的时间
	var currentTime = miaov.timeScroll.getLabelTime(miaov.currentStep);
	// 获取动画的总时长
	var totalTime = miaov.timeScroll.totalDuration();
	//获取到滚动条能够滚动的最大的高度
	var maxH = $("body").height() - $(window).height();

	var scrollAnimate = new TimelineMax();

	if ( value === "next") { //向下切换
		//获取到下一个状态的字符串
		var afterStep = miaov.timeScroll.getLabelAfter(currentTime);

		if (!afterStep) return;

		//获取到下一个状态的时间
		var afterTime = miaov.timeScroll.getLabelTime(afterStep);
		//计算出滚动条滚动的距离
		var positionY = afterTime/totalTime * maxH;
		//滚动条滚动的距离的持续时间
		var d = Math.abs( miaov.timeScroll.time() - afterTime);
		
		//运动到下一个状态
		miaov.timeScroll.tweenTo(afterStep);

		//记录当前的状态为下一个状态，方便继续切换到下一个状态上
		miaov.currentStep = afterStep;
	}else{  //向上切换

		//获取到上一个状态的字符串
		var beforeStep = miaov.timeScroll.getLabelBefore(currentTime);

		if (!beforeStep) return;

		//获取到上一个状态的时间
		var beforeTime = miaov.timeScroll.getLabelTime(beforeStep);
		//计算出滚动条滚动的距离
		var positionY = beforeTime/totalTime * maxH;
		//滚动条滚动的距离的持续时间
		var d = Math.abs( miaov.timeScroll.time() - beforeTime);

		//运动到上一个状态
		miaov.timeScroll.tweenTo(beforeStep);

		//记录当前的状态为上一个状态，方便继续切换到上一个状态上
		miaov.currentStep = beforeStep;
	}

	scrollAnimate.to("html,body",d,{scrollTop:positionY});
}

//配置整屏切换的动画以及每一屏中的小动画
miaov.configTimeScroll = function(){
	var time = miaov.timeScroll ? miaov.timeScroll.time() : 0;

	if( miaov.timeScroll ) miaov.timeScroll.clear();
	
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

// 配置导航条的动画
miaov.configIntAnimate = function(){
	var initAnimate = new TimelineMax();

	initAnimate.to( ".menu",0.5,{opacity:1} );
	initAnimate.to( ".menu",0.5,{left:22},"-=0.3" );
	initAnimate.to( ".nav",0.5,{opacity:1} );

	// 设置首屏的动画
	initAnimate.to(".scene1_logo",0.5,{opacity:1});
	initAnimate.staggerTo(".scene1_1 img",2,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.2);
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

	// 鼠标移入language 要显示 dropdown
	var languageAinimate = new TimelineMax();

	$(".language").bind("mouseenter",function(){
		languageAinimate.clear();
		languageAinimate.to(".dropdown",0.5,{opacity:1,"display":"block"});
	});

	$(".language").bind("mouseleave",function(){
		languageAinimate.clear();
		languageAinimate.to(".dropdown",0.5,{opacity:0,"display":"none"});
	})

	// 调出左侧的导航条
	$(".btn_mobile").click(function(){
		var m_aimate = new TimelineMax;
		m_aimate.to(".left_nav",0.5,{left:0});
	});

	$(".l_close").click(function(){
		var l_aimate = new TimelineMax();
		l_aimate.to(".left_nav",0.5,{left:-300});
	})
}

// 3D翻转效果
miaov.button3D = function(obj,element1,element2,d){
	var button3DAnimate = new TimelineMax();
	var ele1 = $(obj).find(element1);
	var ele2 = $(obj).find(element2);

	button3DAnimate.to( ele1,0,{rotationX:0,transformPerspective:600,transformOrigin:"center bottom"} );
	button3DAnimate.to( ele2,0,{rotationX:-90,transformPerspective:600,transformOrigin:"top center"} );

	$(obj).bind("mouseenter",function(){
		var enterAnimate = new TimelineMax();

		enterAnimate.to(ele1,d,{rotationX:90,top:-ele1.height(),ease:Cubic.easeInOut},0);
		enterAnimate.to(ele2,d,{rotationX:0,top:0,ease:Cubic.easeInOut},0);
	});

	$(obj).bind("mouseleave",function(){
		var leaveAnimate = new TimelineMax();

		leaveAnimate.to(ele1,d,{rotationX:0,top:0,ease:Cubic.easeInOut},0);
		leaveAnimate.to(ele2,d,{rotationX:-90,top:ele2.height(),ease:Cubic.easeInOut},0);
	});
}

// 设置每一屏的高度和top值
miaov.resize = function(){

	$(".scene").height( $(window).height() ); //设置每一屏的height
	$(".scene:not(':first')").css("top",$(window).height());

	if ( $(window).width() <= 950 ){
		$("body").addClass("r950");
		$(".menu").css("top",0)
	}else{
		$("body").removeClass("r950");
		$("menu").css("top",22)
	}
}

// 配置第二屏的动画
var twoAnimate = {};

twoAnimate.timeline = new TimelineMax();

//具体的第二屏里面动画要实现的细节
twoAnimate.init = function(){
	twoAnimate.timeline.staggerTo(".scene2_1 img",1.5,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.1);
	twoAnimate.timeline.to(".points",0.2,{bottom:20},"-=1");

	// 初始化第一个按钮
	twoAnimate.timeline.to(".scene2 .point0 .text",0.1,{opacity:1});
	twoAnimate.timeline.to(".scene2 .point0 .point_icon",0,{"background-position":"right top"});

		twoAnimate.timeline.add("state1");

	twoAnimate.timeline.staggerTo(".scene2_1 img",0.2,{opacity:0,rotationX:90},0);

	twoAnimate.timeline.to(".scene2_2 .left",0.4,{opacity:1});
	twoAnimate.timeline.staggerTo(".scene2_2 .right img", 0.3,{opacity:1,rotationX:0,ease:Cubic.easeOut},0,"-=0.4");
}