//处理本地存储的相关方法
export default class StorageUtil{
	
	//1.获取本地存储内容
	static get(key){
		return uni.getStorageSync(key);
	}
	
	  
	 /**
	   * 2.向本地,存储内容
	   * @param key：String类型,本地缓存中的指定的 key
	   * @param value:[String,Object,Boolean,Number] 本地缓存中的指定的 value
	   * @returns {*}
	 */
	static set(key,value){
		uni.setStorageSync(key,value)
	}
	
	/**
	   * 3.更新
	   * @param key
	   * @param value
	*/
	static update(key,value){
		StorageUtil.set(key,value)
	}
	
	/**
	   * 4.删除 从本地缓存中同步移除指定 key。
	   * @param key
	*/
	static remove(key){
		uni.removeStorageSync(key)
	}
	
	/**
	  * 5.清除所有Storage
	*/
   static clear(){
	   uni.clearStorage();
   }
	
}