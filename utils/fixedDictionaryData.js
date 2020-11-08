/*
 * @Description: 保存固定数据字典的类，在用户登录后向服务器发送一次数据请求
 * @Author: 瑾瑜
 * @Date: 2020-06-23 14:56:24
 * @LastEditTime: 2020-06-23 18:45:01
 * @LastEditors: Please set LastEditors
 * http://cwapp.pkuh6.cn:801/json/dict/?loading=false&dict=loadall
 */
import StorageUtil from "./storageUtils.js"
//数据字典的地址：/json/dict
let instance = null;
// var Dictionary = StorageUtil.get("Dictionary")
export default class FixedDictionaryData {
	constructor(arg) {
		if (!instance) {
			instance = this;
		}
		return instance;
	}
	static ShareInstance() {
		let singleton = new FixedDictionaryData();
		return singleton;
	}

	static Destroy() {
		if (instance) {
			instance = null;
		}
	}

	/**
	 * 查找对应的字典值
	 * @param dic：String类型,如：dict_all_bill_type
	 * @param key:每一个类型中具体的key,如："XZ":"行政劳务发放单"中的"XZ"
	 */
	static findValue(dic, key) {
		//字典数据内容
		let Dictionary = StorageUtil.get("Dictionary")
		// console.log(Dictionary,"---------Dictionary Dictionary")
		// console.log(dic,key,"查找字典值的条件")
		let dicObj = JSON.parse(Dictionary[dic])
		// console.log('所查字典详情',dicObj);
		if(dicObj){
			let data = dicObj[key]
			// console.log(data,"-------最终要查的的值")
			return data
		}
		// let dicName=dic.toString()
		// return (JSON.parse(Dictionary[dic]))[key];
	}


}
