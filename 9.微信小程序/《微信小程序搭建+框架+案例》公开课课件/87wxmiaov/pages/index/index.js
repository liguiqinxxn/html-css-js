//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    user: "kimoo",
    idName: "box",
    obj: {
      name: "abc"
    },
    age: 2,
    flag: true,
    arr: [{
      text: "html",
      id: 0
    }, {
      text: "css",
      id: 1
    }, {
      text: "wx",
      id: 2
    }]
  },
  tap(e){
    let { arr } = this.data;
    console.log(e.target.dataset.id )
    arr = arr.filter( item=>item.id!=e.target.dataset.id );
    this.setData({ arr } );
  }
})
