(function(){
	//让下面的区域自适应

	var header = tools.$(".header")[0];
	var weiyunContent = tools.$(".weiyun-content")[0];

	var headerH = header.offsetHeight;

	changeHeight();
	function changeHeight(){
		var viewHeight = document.documentElement.clientHeight;	
		weiyunContent.style.height = viewHeight - headerH + "px";
	}
	window.onresize = changeHeight;

	//要准备的数据
	var datas = data.files;

	//渲染文件区域
	var renderId = 0;  //默认一上就要渲染这个id下的所有的子数据

	//文件区域的容器
	var fileList = tools.$(".file-list")[0];  

	//渲染指定id下所有子数据构成的html结构
	fileList.innerHTML = createFilesHtml(datas,0);

	//利用事件委托，点击每一个文件夹
	tools.addEvent(fileList,"click",function(ev){
		var target = ev.target;
		if( tools.parents(target,".item") ){
			target = tools.parents(target,".item");
			//找到文件的id
			var fileId = target.dataset.fileId;

			//渲染文件导航
			pathNav.innerHTML = createPathNavHtml(datas,fileId);

			//如果指定的id没有子数据，需要提醒
			var hasChild =dataControl.hasChilds(datas,fileId);

			if( hasChild ){  //如果有子数据，就渲染出子数据的结构
				//找到当前这个id下所有的子数据，渲染在文件区域中
				empty.style.display = "none";
				fileList.innerHTML = createFilesHtml(datas,fileId);
			}else{
				empty.style.display = "block";
			}

			//需要给点击的div添加上样式，其余的div没有样式
			var treeNav = tools.$(".tree-nav",treeMenu)[0];

			tools.removeClass(treeNav,"tree-nav");
			positionTreeById(fileId);

		}
	})

	//渲染菜单区域
	var treeMenu = tools.$(".tree-menu")[0];

	var pathNav = tools.$(".path-nav")[0];  //文件导航的容器

	var empty = tools.$(".g-empty")[0];  //没有文件提醒的结构

	treeMenu.innerHTML = treeHtml(datas,-1);

	//var positionId = 0;  //定位到属性菜单的上
	positionTreeById(0);

	//渲染文件导航
	//渲染文件导航
	pathNav.innerHTML = createPathNavHtml(datas,0);

	//利用事件委托，点击树形菜单的区域，找到事件源就可以

	tools.addEvent(treeMenu,"click",function(ev){
		var target = ev.target;
		if( tools.parents(target,".tree-title") ){
			target = tools.parents(target,".tree-title");

			//找到div身上的id 
			//console.dir(target);

			var fileId = target.dataset.fileId;
			//渲染文件导航
			pathNav.innerHTML = createPathNavHtml(datas,fileId);

			//如果指定的id没有子数据，需要提醒
			var hasChild =dataControl.hasChilds(datas,fileId);

			if( hasChild ){  //如果有子数据，就渲染出子数据的结构
				//找到当前这个id下所有的子数据，渲染在文件区域中
				empty.style.display = "none";
				fileList.innerHTML = createFilesHtml(datas,fileId);
			}else{
				empty.style.display = "block";
			}

			//需要给点击的div添加上样式，其余的div没有样式

			var treeNav = tools.$(".tree-nav",treeMenu)[0];

			tools.removeClass(treeNav,"tree-nav");
			positionTreeById(fileId);

		}
	})

	

}())