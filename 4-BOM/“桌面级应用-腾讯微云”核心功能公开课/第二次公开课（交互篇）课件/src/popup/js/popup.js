/**
 * Created by leiyongsheng on 2016/7/9.
 */

(function(win){
	var PopUp = function(){
		//遮罩层
		var mask = this.mask = document.createElement('div');
		//弹窗
		var fullPop = this.fullPop = document.createElement('div');
		//设置遮罩层样式
		mask.style.cssText = 'z-index:1000;top: 0px; left: 0px; position: fixed; width: 100%; height: 100%; opacity: 0.65; background-color: white;';
		mask.className = "mask";
		//设置弹窗内容和样式。
		fullPop.className = 'full-pop';
		fullPop.style.cssText = 'z-index:2001;position:absolute;left:0px;top:0px;visibility:hidden';
		fullPop.innerHTML ='\
		<h3 class = "move">\
			<p class="title">选择存储位置</p>\
			<a href="javascript:void(0);" class="close" title="关闭">×</a>\
		</h3>\
		<div class="dialog">\
			<p class="dir-file">\
				<span class="file-img"></span>\
				<span class="file-name">老王</span>\
				<span class="total" style="color:#868686;margin:left:12;">3个文件</span>\
			</p>\
			<div class="dir-box">\
				<div class="cur-dir">\
					<span>移动到：</span><span class="fileMovePathTo">微云</span>\
				</div>\
				<div class="dirTree"></div>\
			</div>\
		</div>\
		<div class="pop-btns">\
			<span class="error"> </span>\
			<a href="javascript:void(0)" class="confirm">确定</a>\
			<a href="javascript:void(0)" class="cancel">取消</a>\
		</div>';
		//拿到需要用的元素。
		//关闭按钮
		this.close = fullPop.getElementsByClassName('close')[0];
		//文件图标
		this.fileImg = fullPop.getElementsByClassName('file-img')[0];
		//文件名称
		this.fileName = fullPop.getElementsByClassName('file-name')[0];
		//移动到目标文件的提示信息。
		this.fileMovePathTo = fullPop.getElementsByClassName('fileMovePathTo')[0];
		//目录树
		this.dirTree = fullPop.getElementsByClassName('dirTree')[0];
		//错误提示信息。
		this.error = fullPop.getElementsByClassName('error')[0];
		//确定按钮
		this.confirm = fullPop.getElementsByClassName('confirm')[0];
		//取消按钮。
		this.cancel = fullPop.getElementsByClassName('cancel')[0];
		//上方拖拽区域。
		this.move = fullPop.getElementsByClassName('move')[0];
		//下方拖拽区域。
		this.popBtns = fullPop.getElementsByClassName('pop-btns')[0];
		//执行初始化。
		this.init();
	};	
	PopUp.prototype = {
		constructor:PopUp,
		init:function(){
			var self = this;
			//关闭按钮和取消按钮点击时处理。
			this.cancel.onclick = this.close.onclick = function(){
				//如果绑定了弹窗关闭事件，关闭时触发该事件，如果事件处理函数返回false则不执行关闭弹窗操作。
				var isClose = self.onclose&&self.onclose();

				if(isClose !== false){
					self.closePopUp();
				}
			};
			/*this.cancel.onclick = function(){

				var iscancel = self.oncancel&&self.oncancel();

				if(iscancel === undefined){
					self.closePopUp();
				}
			};*/
			//点击确定时处理。
			this.confirm.onclick = function(){
				//如果绑定了onconfirm事件，确定按钮点击时执行该事件处理函数，如果事件函数返回false则不执行确定操作。
				var isconfirm = self.onconfirm&&self.onconfirm();

				if(isconfirm !== false){
					self.closePopUp();
				}
			};
			//阻止弹窗的右键默认菜单。
			this.fullPop.oncontextmenu = function(){
				return false;
			};
			//窗口发生变化时从新定位弹窗。
			window.onresize = function(){
				self.setPos();
			};
			//调用拖拽，第一个参数拖拽的区域，第二个参数拖拽时移动的元素。
			var drag1 = new Drag(this.move,this.fullPop);
			var drag2 = new Drag(this.popBtns,this.fullPop);
			//调用init方法初始拖拽。
			drag1.init();
			drag2.init();
		},
		//显示弹窗
		open:function(options){
			//显示遮罩层
			document.body.appendChild(this.mask);
			//显示弹出层
			document.body.appendChild(this.fullPop);
			//定位弹窗
			this.setPos();
			if( typeof options.content === "string" ){
				this.dirTree.innerHTML = options.content;
			}else{  //是一个元素呢?
				this.dirTree.appendChild(options.content);
			}
			
		},
		//关闭弹窗。
		closePopUp:function(){
			document.body.removeChild(this.mask);
			document.body.removeChild(this.fullPop);
		},
		//定位弹窗。
		setPos:function(){
			var left = (document.documentElement.clientWidth - this.fullPop.offsetWidth)/2;
			var top = (document.documentElement.clientHeight - this.fullPop.offsetHeight)/2;
			
			if(left<0){
				left = 0;
			}
			if(top<0){
				top = 0;
			}
			this.fullPop.style.cssText = 'z-index:2000;position:absolute;left:'+left+'px;top:'+top+'px;visibility:visible;';
		}

	};
	//拖拽。
	var Drag = function(dragArea,dragEle){
		//拖拽区域
		this.dragArea = dragArea;
		//拖拽时移动的元素。
		this.dragEle = dragEle;
	};
	Drag.prototype = {
		constructor:Drag,
		//初始化拖拽。
		init:function(){
			var self = this;
			this.fndown(function(){
				//如果绑定了开始拖拽事件，则执行该事件。
				self.onstartmove&&self.onstartmove();
				self.fnmove(function(){
					//绑定了移动事件则执行事件。
					self.onmove&&self.onmove();
				});
				self.fnup(function(){
					//绑定了拖拽结束事件则执行事件。
					self.onend&&self.onend();
				})
			});
		},
		fndown:function(callBack){
			var self = this;
			this.dragArea.onmousedown = function(ev){
				ev = ev||event;
				//记录初始位置。
				self.disx = ev.clientX - self.dragEle.offsetLeft;
				self.disy = ev.clientY - self.dragEle.offsetTop;
				//执行回调。
				callBack();
				//阻止冒泡
				ev.cancelBubble = true;
				//阻止默认行为。
				return false;
			};
		},
		fnmove:function(callBack){
			var self = this;
			
			document.onmousemove = function(ev){
				
				ev = ev||event;
				//计算拖拽位置。
				self.x = ev.clientX - self.disx;
				self.y = ev.clientY - self.disy;
				//范围限制。
				self.region();
				//移动拖拽元素。
				self.dragEle.style.top = self.y+'px';
				self.dragEle.style.left = self.x+'px';
				//回调。
				callBack&&callBack();
			};
			
		},
		fnup:function(callBack){
			//拖拽结束操作。
			document.onmouseup = function(){
				document.onmouseup = document.onmousemove = null;
				callBack&&callBack();
			};
				
		},
		//拖拽范围限制。
		region:function(){
			var maxX = document.documentElement.clientWidth - this.dragEle.offsetWidth;
			var maxY = document.documentElement.clientHeight - this.dragEle.offsetHeight;
			if(this.y<0){
				this.y = 0;
			}
			if(this.y>maxY){
				this.y = maxY;
			}
			if(this.x<0){
				this.x = 0;
			}
			if(this.x>maxX){
				this.x = maxX;
			}
		}
	};
	//对外提供弹窗组件。
	win.PopUp = PopUp;
})(window)