//公共地址
let HOST = "http://211.157.179.73:9750";
export default class UploadUtils {
	//解决小程序不支持多文件上传问题
	static async uploads(uploadFileList, uploadFileURL, saveAttachmentURL, token, callback) {
		const that = this
		let fileDataList = []
		if(typeof(uploadFileList) == "string") {
			console.log("string:")
			const fileData = await that.uploadFileRequest(uploadFileList, uploadFileURL, token)
			fileDataList.push(fileData)
		} else {
			//上传多张发票
			for (let k in uploadFileList) {
				const fileData = await that.uploadFileRequest(uploadFileList[k], uploadFileURL, token)
				fileDataList.push(fileData)
			}
		}
		
		callback(fileDataList)
	}
	/*
	 *uploadFileRequest方法--封装一个上传文件的方法（返回promise对象）
	 *filesPath:String,必填，要上传文件资源的路径（通过选择图片接口等获取到的本地资源的临时文件路径）
	 *url:String,必填,请求的接口地址 url
	 *token:String,必填,请求头加上token
	 *name:String,文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
	 */
	static uploadFileRequest(filesPath, url, token, flodBillList) {
		return new Promise((resolve, reject) => {
			//默认为post请求
			uni.uploadFile({
				url: HOST + url,
				filePath: filesPath,
				name: "file",
				header: {
					"Authorization": uni.getStorageSync('token') //为请求头加上token
				},
				success: res => {
					let data = JSON.parse(res.data)
					if (data.code == 0) {
						// 2.图片选择成功提示
						// 3.调取接口:通过上传的发票获取数据
						let fileData = data.data //object，上传后的发票信息
						resolve(fileData)
					}
				},
				fail: err => {
					
				}
			})

		})

	}
	static getBody(content) {
		// let REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
		let REG_BODY = /(<div class="msg">).*(<\/div>)/g;
		let result = REG_BODY.exec(content)
		if(result) {
			return result[0];
		} else {
			return '识别错误';
		}
	}


}
