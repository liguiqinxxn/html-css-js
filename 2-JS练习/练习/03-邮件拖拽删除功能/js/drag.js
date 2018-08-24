
let html = list.map((item) => {
	return `
		<li>
			<input type="checkbox" data-item-id='${item.id}'>
			<div>
				<span>${item.caption}</span>
				<span>${item.time}</span>
			</div>
			<p>${item.desc}</p>
		</li>
	`
}).join(" ")

var emailListUl = document.querySelector(".emailListUl");

emailListUl.innerHTML = html;

//全选按钮
var checkAllBox = document.querySelector('.emailHead input');
// 所有的单选按钮
var checkSingleBox = emailListUl.querySelectorAll('input');

checkAllBox.onclick = function(){
	Array.from(checkSingleBox).forEach((ele)=>{
		ele.checked = this.checked;
		if(this.checked){
			ele.parentNode.style.backgroundColor = '#f2f6f9';
		}else{
			ele.parentNode.style.backgroundColor = '';
		}
	})


}
Array.from(checkSingleBox).forEach((ele)=>{
	ele.onclick = function(ev){
		var checkedNum = 0;
		if(!this.checked){
			checkAllBox.checked = false;
			ele.parentNode.style.backgroundColor = '';
		}else{
			ele.parentNode.style.backgroundColor = '#f2f6f9';
			// 看一下手否都选选中了
			if(selectCheckbox().length === checkSingleBox.length){
				checkAllBox.checked = true;
			}	
		}
		ev.stopPropagation();
	}
	ele.onmousedown = function(ev){
		ev.stopPropagation();
	}
})
// 统计选中的
// checkbox 
function selectCheckbox(){
	var arr = [];
	Array.from(checkSingleBox).forEach((item)=>{
		if(item.checked) arr.push(item)
	})
	return arr;
}

// 删除
var delet = document.querySelector('#delet');

delet.onclick = function(){
	
	// 同时删除数据
	console.log(list)
	delectData()
}

// 删除数据和结构
function delectData(){
	var selectInput = selectCheckbox();
	selectInput.forEach((item)=>{
		item.parentNode.remove();
		for(var i = 0; i < list.length; i++){
			/*list = list.filter((data)=>{
				return data.id !== item.dataset.itemId;
			})*/
			if(list[i].id === item.dataset.itemId){
				console.log(i)
				list.splice(i,1)
				console.log(list)
			}
			
		}
	});
}

// 扩展：不给每一个li添加事件，而是把事件放在ul身上

var hint3 = document.querySelector('#hint3');
var emailListUlLi = emailListUl.querySelectorAll('li')
var beenDel = document.querySelector('.beenDel')
Array.from(emailListUlLi).forEach((ele)=>{
	ele.onmousedown = function(ev){
		var input = this.querySelector("input");
		ev.preventDefault()
		if(!input.checked) return;

		var disX = ev.clientX;
		var disY = ev.clientY;

		var selectAll = selectCheckbox();

		hint3.innerText = `选中${selectAll.length}封邮件`
		hint3.style.display = 'block';
		hint3.style.left = disX + 'px';
		hint3.style.top = disY + 'px';

		var p = false;

		document.onmousemove = function(ev){
			hint3.style.left = ev.clientX + 'px';
			hint3.style.top = ev.clientY + 'px';

			if( pengzhuang(hint3,beenDel) ){
				console.log("碰上了")
				p = true;
			}

			ev.preventDefault()
		}
		document.onmouseup = function(ev){
			hint3.style.display = 'none';
			if( p ){
				delectData();
			}
		}
	}
})
function getRect(obj){
		return obj.getBoundingClientRect();
	}
function pengzhuang(obj1,obj2){
	var obj1Rect = 	getRect(obj1);
	var obj2Rect = 	getRect(obj2);

	//如果obj1碰上了哦obj2返回true，否则放回false
	var obj1Left = obj1Rect.left;
	var obj1Right = obj1Rect.right;
	var obj1Top = obj1Rect.top;
	var obj1Bottom = obj1Rect.bottom;

	var obj2Left = obj2Rect.left;
	var obj2Right = obj2Rect.right;
	var obj2Top = obj2Rect.top;
	var obj2Bottom = obj2Rect.bottom;

	if( obj1Right < obj2Left || obj1Left > obj2Right || obj1Bottom < obj2Top || obj1Top > obj2Bottom ){
		return false;
	}else{
		return true;
	}
}










