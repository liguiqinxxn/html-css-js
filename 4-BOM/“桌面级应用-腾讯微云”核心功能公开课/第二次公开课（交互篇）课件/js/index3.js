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

			renderNavFilesTree(fileId);

		}
	})

	//渲染菜单区域
	var treeMenu = tools.$(".tree-menu")[0];

	var pathNav = tools.$(".path-nav")[0];  //文件导航的容器

	//文件导航区域点击，利用事件委托

	tools.addEvent(pathNav,"click",function (ev){
		var target = ev.target;
		if( tools.parents(target,"a") ){
			var fileId = target.dataset.fileId;
			console.log( fileId );
			renderNavFilesTree(fileId);
		}

	})

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
			
			renderNavFilesTree(fileId);
		}
	});

	//通过指定的id渲染文件区域，文件导航区域，树形菜单
	function renderNavFilesTree(fileId){
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


	//找到文件区域下所有的文件
	var fileItem = tools.$(".file-item",fileList);
	var checkboxs = tools.$(".checkbox",fileList);

	tools.each(fileItem,function(item,index){
		//给每一个文件绑定鼠标移入移出事件
		var checkbox = tools.$(".checkbox",item)[0];

		tools.addEvent(item,"mouseenter",function(){
			tools.addClass(this,"file-checked");
		});

		tools.addEvent(item,"mouseleave",function(){
			if( !tools.hasClass(checkbox,"checked") ){
				tools.removeClass(this,"file-checked");
			}
			
		});

		//给checkbox添加点击处理

		tools.addEvent(checkbox,"click",function(ev){
			var isaddClass = tools.toggleClass(this,"checked");

			if( isaddClass ){
				//判断一下是否所有的checkbox是都都勾选了


				if( whoSelect().length == checkboxs.length ){
					tools.addClass(checkedAll,"checked");
				}

			}else{
				//只要当前这个checkbox没有被勾选，那么肯定全选按钮就没有class为checked
				tools.removeClass(checkedAll,"checked");
			}

			//阻止冒泡，目的：防止触发fileList上的点击
			ev.stopPropagation();
		})

	})

	//获取到全选按钮
	var checkedAll = tools.$(".checked-all")[0];

	tools.addEvent(checkedAll,"click",function(){
		/*
			toggleClass的返回值是一个布尔值
				true 有添加class
				flase 没有添加的class
		*/
		var isAddClass = tools.toggleClass(this,"checked"); 

		if( isAddClass ) {
			tools.each(fileItem,function(item,index){
				tools.addClass(item,"file-checked");
				//找到每个文件下对应checkbox
				tools.addClass(checkboxs[index],"checked");
			})
		}else{
			tools.each(fileItem,function(item,index){
				tools.removeClass(item,"file-checked");
				tools.removeClass(checkboxs[index],"checked");
			})
		}
	});

	//作用：找到所有checkbox勾选的文件
	function whoSelect(){
		var arr = [];
		//找一下checkbox如果有class为checked，那么就放在数组中
		tools.each(checkboxs,function (checkbox,index){
			if( tools.hasClass(checkbox,"checked") ){
				arr.push(fileItem[index]);
			}
		});

		return arr;	
	}


	//新建文件的功能
	var create = tools.$(".create")[0];

	tools.addEvent(create,"mouseup",function(){
		var newElement = createFileElement({
			title:"",
			id : new Date().getTime()
		});
		fileList.insertBefore(newElement,fileList.firstElementChild);

		//获取标题
		var fileTitle = tools.$(".file-title",newElement)[0];
		var fileEdtor = tools.$(".file-edtor",newElement)[0];

		var edtor = tools.$(".edtor",newElement)[0];

		fileTitle.style.display = "none";
		fileEdtor.style.display = "block";

		edtor.select();  //自动获取光标

		create.isCreateFile = true;  //添加一个状态，表示正在创建文件

	})

	//给document绑定一个mousedown，为了创建文件夹

	tools.addEvent(document,"mousedown",function(){
		//判断一下新创建的元素中的输入框是否有内容，如果有内容就创建，没有内容就removeChild

		if( create.isCreateFile ){  //如果为true，说明正在创建文件
			var firstElement = fileList.firstElementChild;
			var edtor = tools.$(".edtor",firstElement)[0];
			var value = edtor.value.trim();

			if( value === "" ){
				fileList.removeChild(firstElement);
			}else{
				var fileTitle = tools.$(".file-title",firstElement)[0];
				var fileEdtor = tools.$(".file-edtor",firstElement)[0];
				fileTitle.style.display = "block";
				fileEdtor.style.display = "none";

				fileTitle.innerHTML = value;

				
			}


			create.isCreateFile = false;  //无论创建成不成功，状态都要设为false
		}

	})
	

}())