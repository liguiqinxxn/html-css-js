var g_aImgInfo=
[
	{info: "都市魅力", href: 'http://www.miaov.com/'},
	{info: "古香古色", href: 'http://www.miaov.com/'},
	{info: "沉浸舞步的舞者", href: 'http://www.miaov.com/'},
	{info: "名贵跑车", href: 'http://www.miaov.com/'},
	{info: "聆听天籁的精灵", href: 'http://www.miaov.com/'},
	{info: "绚彩光芒", href: 'http://www.miaov.com/'}
];

var oDiv=null;
var oUlContent=null;
var oUlBtn=null;

var aLiImg=null;
var aLiBtn=null;

var oBtnPrev=null;
var oBtnNext=null;

var oTxtInfo=null;
var oTxtLength=null;

var oMarkPrev=null;
var oMarkNext=null;

var g_aTimerImg=[];
var g_aTimerBtn=[];

var g_oTimerUl=null;

var g_oTimerAutoPlay=null;

var g_aLiBtnAlpha=[];

var g_iNowImg=0;

var g_iZIndexBase=2;

window.onload=function ()
{
	var i=0;
	
	//获取各类元素
	oDiv=document.getElementById('playimages');
	oUlContent=oDiv.getElementsByTagName('ul')[0];
	oUlBtn=oDiv.getElementsByTagName('ul')[1];
	
	oBtnPrev=oDiv.getElementsByTagName('div')[0];
	oBtnNext=oDiv.getElementsByTagName('div')[1];
	
	oTxtInfo=oDiv.getElementsByTagName('div')[2];
	oTxtLength=oDiv.getElementsByTagName('div')[3];
	
	oMarkPrev=oDiv.getElementsByTagName('a')[0];
	oMarkNext=oDiv.getElementsByTagName('a')[1];
	
	aLiImg=oUlContent.getElementsByTagName('li');
	aLiBtn=oUlBtn.getElementsByTagName('li');
	
	//为元素添加属性
	oTxtInfo.innerHTML=g_aImgInfo[0].info;
	oTxtLength.innerHTML='1/'+aLiImg.length;
	
	oMarkPrev.href=g_aImgInfo[0].href;
	oMarkNext.href=g_aImgInfo[0].href;
	
	oBtnPrev.miaovOpacity=0;
	oBtnNext.miaovOpacity=0;
	
	oBtnPrev.miaovTime=0;
	oBtnNext.miaovTime=0;
	
	oUlBtn.style.width=aLiBtn[0].offsetWidth*aLiBtn.length+'px';
	
	//为元素添加事件
	function showPrev()
	{
		showBtn(oBtnPrev);
		hideBtn(oBtnNext);
		
		stopAutoPlay();
	}
	
	function showNext()
	{
		hideBtn(oBtnPrev);
		showBtn(oBtnNext);
		
		stopAutoPlay();
	}
	
	function hideAll()
	{
		hideBtn(oBtnPrev);
		hideBtn(oBtnNext);
		
		startAutoPlay();
	}
	
	oMarkPrev.onmouseover	=showPrev;
	oBtnPrev.onmouseover	=showPrev;
	oMarkNext.onmouseover	=showNext;
	oBtnNext.onmouseover	=showNext;
	
	oBtnPrev.onmouseout		=hideAll;
	oBtnNext.onmouseout		=hideAll;
	oMarkPrev.onmouseout	=hideAll;
	oMarkNext.onmouseout	=hideAll;
	
	oBtnPrev.onmousedown	=gotoPrev;
	oBtnNext.onmousedown	=gotoNext;
	
	oUlBtn.onmouseover		=stopAutoPlay;
	oUlBtn.onmouseout		=startAutoPlay;
	
	for(i=0;i<aLiBtn.length;i++)
	{
		aLiBtn[i].miaovIndex=i;
		aLiBtn[i].onmouseover=function ()
		{
			if(g_iNowImg!=this.miaovIndex)
			{
				showLiBtn(this.miaovIndex);
			}
		};
		aLiBtn[i].onmouseout=function ()
		{
			if(g_iNowImg!=this.miaovIndex)
			{
				hideLiBtn(this.miaovIndex);
			}
		};
		aLiBtn[i].onmousedown=function ()
		{
			gotoImg(this.miaovIndex);
		};
		g_aTimerBtn[i]=null;
		g_aLiBtnAlpha[i]=60;
	}
	
	g_aLiBtnAlpha[0]=100;
	
	startAutoPlay();
};

function showBtn(oBtn)
{
	if(oBtn.miaovTimer)
	{
		clearInterval(oBtn.miaovTimer);
	}
	
	oBtn.miaovTimer=setInterval
	(
		function ()
		{
			if(oBtn.miaovOpacity<100)
			{
				oBtn.miaovOpacity+=10;
				
				oBtn.style.display='block';
				oBtn.style.filter="alpha(opacity:"+oBtn.miaovOpacity+")";
				oBtn.style.opacity=oBtn.miaovOpacity/100;
			}
			else
			{
				oBtn.style.filter="";
				oBtn.style.opacity="";
				
				clearInterval(oBtn.miaovTimer);
				oBtn.miaovTimer=0;
			}
		}, 30
	);
}

function hideBtn(oBtn)
{
	if(oBtn.miaovTimer)
	{
		clearInterval(oBtn.miaovTimer);
	}
	
	oBtn.miaovTimer=setInterval
	(
		function ()
		{
			if(oBtn.miaovOpacity>0)
			{
				oBtn.miaovOpacity-=10;
				
				oBtn.style.filter="alpha(opacity:"+oBtn.miaovOpacity+")";
				oBtn.style.opacity=oBtn.miaovOpacity/100;
			}
			else
			{
				oBtn.style.display='none';
				oBtn.style.filter="";
				oBtn.style.opacity="";
				
				clearInterval(oBtn.miaovTimer);
				oBtn.miaovTimer=0;
			}
		}, 30
	);
}

function gotoImg(index)
{
	if(index==g_iNowImg)
	{
		return;
	}
	
	aLiImg[index].style.height='0px';
	aLiImg[index].style.display='block';
	aLiImg[index].style.zIndex=g_iZIndexBase++;
	
	if(g_aTimerImg[index])
	{
		clearInterval(g_aTimerImg[index]);
	}
	g_aTimerImg[index]=setInterval("slideDown("+index+")", 30);
	
	for(i=0;i<aLiBtn.length;i++)
	{
		if(i==index)
		{
			showLiBtn(i);
		}
		else
		{
			hideLiBtn(i);
		}
	}
	
	moveUlBtn(index);
	
	oTxtInfo.innerHTML=g_aImgInfo[index].info;
	oTxtLength.innerHTML=(index+1)+'/'+aLiImg.length;
	
	oMarkPrev.href=g_aImgInfo[index].href;
	oMarkNext.href=g_aImgInfo[index].href;
	
	g_iNowImg=index;
}

function slideDown(index)
{
	var h=aLiImg[index].offsetHeight+10;
	
	if(h>=oUlContent.offsetHeight)
	{
		h=oUlContent.offsetHeight;
		
		clearInterval(g_aTimerImg[index]);
		g_aTimerImg[index]=null;
	}
	
	aLiImg[index].style.height=h+'px';
}

function gotoNext()
{
	gotoImg((g_iNowImg+1)%aLiImg.length);
}

function gotoPrev()
{
	gotoImg((g_iNowImg-1+aLiImg.length)%aLiImg.length);
}

function showLiBtn(index)
{
	if(g_aTimerBtn[index])
	{
		clearInterval(g_aTimerBtn[index]);
	}
	g_aTimerBtn[index]=setInterval("showLiBtnInner("+index+")", 30);
}

function showLiBtnInner(index)
{
	var alpha=g_aLiBtnAlpha[index]+10;
	
	if(alpha>=100)
	{
		aLiBtn[index].style.filter='';
		aLiBtn[index].style.opacity='1';
		
		clearInterval(g_aTimerBtn[index]);
		g_aTimerBtn[index]=null;
	}
	else
	{
		aLiBtn[index].style.filter='alpha(opacity:'+alpha+')';
		aLiBtn[index].style.opacity=alpha/100;
	}
	
	g_aLiBtnAlpha[index]=alpha;
}

function hideLiBtn(index)
{
	if(g_aTimerBtn[index])
	{
		clearInterval(g_aTimerBtn[index]);
	}
	g_aTimerBtn[index]=setInterval("hideLiBtnInner("+index+")", 30);
}

function hideLiBtnInner(index)
{
	var alpha=g_aLiBtnAlpha[index]-10;
	
	if(alpha<=60)
	{
		alpha=60;
		
		clearInterval(g_aTimerBtn[index]);
		g_aTimerBtn[index]=null;
	}
	aLiBtn[index].style.filter='alpha(opacity:'+alpha+')';
	aLiBtn[index].style.opacity=alpha/100;
	
	g_aLiBtnAlpha[index]=alpha;
}

function moveUlBtn(index)
{
	var iTarget=0;
	
	if(index==0)
	{
		index=1;
	}
	else if(index==aLiBtn.length-1)
	{
		index=aLiBtn.length-2;
	}
	
	iTarget=-(index-1)*aLiBtn[0].offsetWidth;
	
	if(g_oTimerUl)
	{
		clearInterval(g_oTimerUl);
	}
	
	g_oTimerUl=setInterval("moveUlBtnInner("+iTarget+")", 30);
}

function moveUlBtnInner(iTarget)
{
	var iSpeed=(iTarget-oUlBtn.offsetLeft)/7;
	
	if(iSpeed>0)
	{
		iSpeed=Math.ceil(iSpeed);
	}
	else
	{
		iSpeed=Math.floor(iSpeed);
	}
	
	if(oUlBtn.offsetLeft==iTarget)
	{
		clearInterval(g_oTimerUl);
		g_oTimerUl=null;
	}
	else
	{
		oUlBtn.style.left=oUlBtn.offsetLeft+iSpeed+'px';
	}
}

function startAutoPlay()
{
	if(g_oTimerAutoPlay)
	{
		clearInterval(g_oTimerAutoPlay);
	}
	
	g_oTimerAutoPlay=setInterval(gotoNext, 3000);
}

function stopAutoPlay()
{
	if(g_oTimerAutoPlay)
	{
		clearInterval(g_oTimerAutoPlay);
		g_oTimerAutoPlay=null;
	}
}





