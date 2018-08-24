// 写完我也看不懂了，不好意思。


/*
	1. 全选单选功能、事件冲突解决方案
	2. 拖拽和碰撞检测分析和实践
	3. 删除数据同时移出DOM结构
*/

let checkedNum = 0;

let tempList = [];

let email = document.getElementById('email');
let html = email.innerHTML.trim();

let hint3 = document.getElementById('hint3');
let beenDel = document.querySelector('.beenDel');

let rect = beenDel.getBoundingClientRect();
let flag = false;
// --------------------------------------------------------

createList(list);
removeList();
deleteItem();

// --------------------------------------------------------

function createList(data){
	email.innerHTML = '';
	let strArr = [];
	data.forEach((item,i)=>{
		let _html = html.replace(/{{caption}}/,item.caption)
						.replace(/{{time}}/,item.time)
						.replace(/{{desc}}/,item.desc);
		strArr.push(_html);
	});
	email.innerHTML = strArr.join('');

	selection();
}

function selection(){
	let checkeds = document.querySelectorAll('#email li input');
	let selectAll = document.querySelector('.emailHead input');
	for(var i = 0; i < checkeds.length; i++){
		checkeds[i].id = Number(list[i].id);
		checkeds[i].index = i;
		checkeds[i].addEventListener('click', function(e){
			if(this.checked){
				this.parentNode.classList.add('active');
				tempList.push(this.id);
				checkedNum++;
			}else{
				this.parentNode.classList.remove('active');
				for(var i=0; i<tempList.length; i++){
					if(tempList[i] == list[this.index].id){
						tempList.splice(i, 1);
					}
				}
				checkedNum--;
			}
			if(checkedNum == list.length){
				selectAll.checked = true;
			}else{
				selectAll.checked = false;
			}
			console.log(tempList);
			deleteItem();
		});
	}
	if(checkedNum == 0){
		selectAll.checked = false;
	}
	selectAll.addEventListener('click', function(e){
		console.log(checkeds);
		tempList = [];
		for(var i=0; i<checkeds.length; i++){
			checkeds[i].checked = this.checked;
			if(this.checked){
				checkeds[i].parentNode.classList.add('active');
				tempList.push(checkeds[i].id)
				checkedNum = list.length;
			}else{
				checkeds[i].parentNode.classList.remove('active');
				tempList = [];
				checkedNum = 0;
			}
		}

		console.log(tempList);
		deleteItem();
	});
}

function removeList(){
	let delet = document.querySelector('#delet');
	delet.addEventListener('click', function(e){
		for(var i=0; i<tempList.length; i++){
			for(var j=0; j<list.length; j++){
				if(parseInt(list[j].id) == tempList[i]){
					list.splice(j,1);
					tempList.splice(i,1);
					checkedNum--;
					j--;
					i--;
				}
			}
		}
		console.log(list,tempList,checkedNum);
		createList(list)
	});
}

function deleteItem(){
	let items = document.querySelectorAll('#email li');
	
	for(var i=0; i<items.length; i++){
		drawDelete(items[i])
	}
	
}

function drawDelete(ele){

	

	ele.onmousedown = function(e){
		var input = this.getElementsByTagName('input')[0];
		
		console.log(input.checked);

		if(input.checked){
			flag = true;
			hint3.style.display = 'block';
			hint3.innerHTML = `选中${tempList.length}封邮件`;
			hint3.style.left = e.pageX + 'px';
			hint3.style.top = e.pageY + 'px';
		}

		
		return false;
	};
	document.onmousemove = function(e){
		if(!flag) return false;
		hint3.style.left = e.pageX + 'px';
		hint3.style.top = e.pageY + 'px';



		return false;
	};
	document.onmouseup = function(e){
		flag = false;
		hint3.style.display = 'none';

		if(e.pageX < rect.right && e.pageX > rect.left && e.pageY < rect.bottom && e.pageY > rect.top){
			for(var i=0; i<tempList.length; i++){
				for(var j=0; j<list.length; j++){
					if(parseInt(list[j].id) == tempList[i]){
						list.splice(j,1);
						tempList.splice(i,1);
						checkedNum--;
						j--;
						i--;
					}
				}
			}
			console.log(list,tempList,checkedNum);
			createList(list)
		}


		return false;
	};
}


























