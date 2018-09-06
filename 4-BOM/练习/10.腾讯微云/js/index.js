(function(){
	// 让下面的区域自适应

	var header = tools.$(".header")[0];
	var weiyunContent = tools.$(".weiyun-content")[0];

	var headerH = header.offsetHeight;

	changeHeight();
	function changeHeight(){
		var viewHeight = document.documentElement.clientHeight;
		weiyunContent.style.height = viewHeight -headerH + "px";
	}
	window.onresize = changeHeight;

	var datas = data.files;// 要准备的数据
	var renderId = 0;  //默认一上就要渲染这个id下的所有的子数据
	var fileList = tools.$(".file-list")[0];// 文件区域的容器

	var treeMenu = tools.$(".tree-menu")[0];
	var pathNav = tools.$(".path-nav")[0]; //文件导航的容器
	var empty = tools.$(".g-empty")[0]; //没有文件提醒的结构

	// 渲染指定id下所有子数据构成的html结构
	fileList.innerHTML = createFilesHtml(datas,0); //0：默认渲染微云下的文件

	// 渲染菜单区域
	treeMenu.innerHTML = treeHtml(datas,-1); 
	positionTreeById(0);//定位到树形菜单上，0：默认在微云上加class

	// 渲染文件导航
	pathNav.innerHTML = createPathNavHtml(datas,0); //0：默认导航在微云

	//利用事件委托，点击每一个文件夹
	tools.addEvent(fileList,"click",function(ev){
		var target = ev.target;
		if ( tools.parents(target,".item") ) {
			target = tools.parents(target,".item");
			// 找到文件的id
			var fileId = target.dataset.fileId;

			renderNavFilesTree(fileId);
		}
	})

	//文件导航区域点击，利用事件委托
	tools.addEvent(pathNav,"click",function(ev){
		var target = ev.target;
		if ( tools.parents(target,"a") ) {
			var fileId = target.dataset.fileId;
			renderNavFilesTree(fileId);
		}
	})

	tools.addEvent(treeMenu,"click",function(ev){
		var target = ev.target;
		if ( tools.parents(target,".tree-title") ) {
			target =  tools.parents(target,".tree-title");

			//找到div身上的id 
			//console.dir(target);

			var fileId = target.dataset.fileId;
			renderNavFilesTree(fileId);
		}
	})

	//通过指定的id渲染文件区域，文件导航区域，树形菜单
	function renderNavFilesTree(fileId){
		// 渲染文件导航
		pathNav.innerHTML = createPathNavHtml(datas,fileId);

		// 如果指定的id没有子数据，需要提醒
		var hasChild = dataControl.hasChilds(datas,fileId);

		if ( hasChild ) { //如果有子数据，就渲染出子数据的结构
			// 找到当前这个id下所有的子数据，渲染在文件区域中
			empty.style.display = "none";
			fileList.innerHTML = createFilesHtml(datas,fileId);
		}else{
			empty.style.display = "block";
		}

		// 需要给点击的div添加上样式，其余的div没有样式

		var treeNav = tools.$(".tree-nav",treeMenu)[0];

		tools.removeClass(treeNav,"tree-nav");
		positionTreeById(fileId);
	}

}())