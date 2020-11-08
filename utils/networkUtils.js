//处理网络请求

import StorageUtils from "./storageUtils.js"

let common_url="http://211.157.179.73:9720"
// let common_url="http://cwapp.pkuh6.cn:801"
//获取token
let token = StorageUtils.get("token");
//设置请求头
let header = {
	//'Accept': 'application/json',
	'Content-Type': 'application/json;charset=UTF-8',
	'X-Requested-With':'XMLHttpRequest'
	//"accesstoken":token  //用户登陆后返回的token，某些涉及用户数据的接口需要在header中加上token
};

export default class NetworkUtil{
	
	 /**
	     * @param {string} url 接口地址
	     * @param {string} method 请求方法：GET、POST，只能大写，可选，默认为GET
	     * @param {JSON} [params=''] body的请求参数，可选，默认为空
		 * @param {string} token 可能某些访问需要在headers里添加token，可选，默认为空
		 * @return 返回Promise
	*/   
	static fetchRequest({url,method="GET",params={},tokenType = 1,successCallback,errCallback},){
		
		if(tokenType==0){
			token == '' ? header : header.accesstoken = token;
		}else{
			token == '' ? header : header.Authorization = token;
		}
		
		return uni.request({
			url:common_url+url,//请求参数
			method:method,//请求方法:默认为get
			data:params,//请求参数
			header:header,
			success: successCallback,
			fail: errCallback
		})
	}
	// static getProcInsId(url){
	// 	uni.request({
	// 		url:common_url+url,
	// 	})
	// }
}