import Vue from 'vue'
import App from './App'
// import store from "./store/index.js"
import API from "./utils/Api.js"
import './static/css/common.css' //公共样式
// 在main.js注册全局组件(下拉刷新组件)
// import MescrollBody from "@/components/mescroll-uni/mescroll-body.vue"
// import MescrollUni from "@/components/mescroll-uni/mescroll-uni.vue"
	
// import $ from "./utils/jquery.min.js"

// import StorageUtils from "./utils/storageUtils.js"
Vue.config.productionTip = false

App.mpType = 'app'

//配置URL地址 
//测试接口： http://211.157.179.73:9720
//正式接口： http://cwapp.pkuh6.cn:801

Vue.prototype.API_URL = "http://211.157.179.73:9750"
//配置请求方法
Vue.prototype.$http = API
// Vue.prototype.$ = $
//版本号
Vue.prototype.$version = "1.0.0"
//显示详情
Vue.prototype.showDescription = function(des){
	if(typeof(des)=="undefined" ||des=="" ){
		return
	}else{
		uni.showToast({
			title:des,
			icon:"none"
		})
	}
	
}
//根据单据类型，获取请求地址
Vue.prototype.getREQUEST_URL = function(billType){
	//单据获取接口地址
	// let BILL_GET_URL=this.API_URL+this.REQUEST_URL+"/get"
	//单据保存接口地址
	// let BILL_SAVE_URL=this.API_URL+this.REQUEST_URL+"/save"
	let REQUEST_URL=""
	// if(billType=="LY"){
	// 	//领用单 完成
	// 	REQUEST_URL= "/reim/billly"
	// }else if(billType=="CL"){
	// 	//差旅报销单
	// 	REQUEST_URL = "/reim/billcl"
	// }else if(billType=="WL"){
	// 	//往来单 
	// 	REQUEST_URL = "/reim/billwl"
	// }else if(billType=="QK"){
	// 	//请款单 
	// 	REQUEST_URL = "/reim/billqk"
	// }else if(billType=="YF"){
	// 	//应付单
	// 	REQUEST_URL = "/reim/billyf"
	// }else if(billType=="FY"){
	// 	//支出凭证FY
	// 	REQUEST_URL = "/reim/billfy"
	// }else if(billType=="CG"){
	// 	//因公出国报销单
	// 	REQUEST_URL = "/reim/billcg"
	// }else if(billType=="ZZ"){
	// 	//内部转账单
	// 	REQUEST_URL = "/reim/transfer"
	// }else if(billType=="HK"){
	// 	//还款单
	// 	REQUEST_URL = "/reim/billhk"
	// }else if(billType=="YS"){
	// 	//预算执行单(/reim/budget/get)
	// 	REQUEST_URL = "/reim/budget"
	// }else if(billType=="SC"){
	// 	//财政收入单(/income/financial/get)
	// 	REQUEST_URL = "/income/financial"
	// }else if(billType=="SQ"){
	// 	//其他收入单
	// 	REQUEST_URL = "/income/other"
	// }else if(billType=="SK"){
	// 	//科教收入单
	// 	REQUEST_URL = "/income/science"
	// }else if(billType=="KL"){
	// 	//科教劳务单
	// 	REQUEST_URL = "/labor/science"
	// }else if(billType=="XZ"){
	// 	//行政劳务单
	// 	REQUEST_URL = "/labor/administration"
	// }else if(billType=="YZ"){
	// 	//夜班值班费
	// 	REQUEST_URL = "/labor/nightshift"
	// }else if(billType=="TC"){
	// 	//提成发放单
	// 	REQUEST_URL = "/labor/pushmoney"
	// }else if(billType=="KY"){
	// 	//科教项目预算编制单
	// 	REQUEST_URL = "/budget/science"
	// }
	 return REQUEST_URL
}
//格式化日期
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
// 调用： 
// var date1 = new Date().Format("yyyy-MM-dd");
// var date2 = new Date().Format("yyyy-MM-dd HH:mm:ss");

Date.prototype.Format =function(fmt) {
	 var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"H+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
}

// 在main.js注册全局组件
// Vue.component('mescroll-body', MescrollBody)
// Vue.component('mescroll-uni', MescrollUni)	

const app = new Vue({
	...App,
	//挂载store
	// store
})
app.$mount()

