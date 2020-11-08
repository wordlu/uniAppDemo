import StorageUtils from './storageUtils.js'
// import store from '@/store.js'
let HOST = "http://211.157.179.73:9750";
// let HOST = API_URL; //接口地址(统一挂载在vue原型上)

function getToken(){
  let tokentetx='';
  if (!localStorage) return undefined;
  // tokentetx=localStorage.getItem('token')
  tokentetx =StorageUtils.get('token')
  return tokentetx;
}
function getHeaders() {
  let headers = {};
  let token = getToken();
  if (token) {
    headers = {
      'Authorization': token,
	  // "X-Requested-With":"XMLHttpRequest"
    };
  }
  return headers;
}
function GET(urlName,params){
  let headers = getHeaders();
  return REQUEST(urlName,params,headers,'GET');
}

function POST(urlName,params){
  let headers = getHeaders();
  return REQUEST(urlName,params,headers,'POST');
}
function REQUEST(urlName,params,headers,mothed){
  return new Promise((resolve, reject) => {
    if (mothed == 'GET') {
	  uni.request({
	      url:HOST+urlName, 
	      data: params,
	      header: headers || {'content-type' : "application/json"},
		  method:'GET',
	      success: (res) => {
	         REQUEST_COMPLETE(resolve,res);
	      },
		  fail: (res) => {
			  reject(res);
		  }
	  });
    }else if(mothed == 'POST') {
		uni.request({
		    url:HOST+urlName,
		    data: params,
		    header: headers || {'content-type' : "application/json"},
		    method:'POST',
		    success: (res) => {
		       REQUEST_COMPLETE(resolve,res);
		    },
		    fail: (res) => {
		    	reject(res);
		    },
		});
    }
  });
}
function REQUEST_COMPLETE(resolve,res){
	if(typeof(res.data) == 'string' && res.data.indexOf("登录超时") != -1){
		uni.showToast({
			title: '登录超时，请重新登录',
			duration: 4000,
			icon:'none',
		});
		setTimeout(function(){
			uni.redirectTo({
			   url: '/pages/login/index'
			});
		},2000)
	}else{
	    if(res.data.code!= '0'){
			let str = res.data;
			if (str == null) {
				uni.showToast({
					title: '请求失败',
					duration: 4000,
					icon:'none',
				});
			} else {
				console.log(res);
				uni.showModal({
					title: '网络错误'					
				});
			 }
	    }else{
			resolve(res);
		}
  }
}
export default
{
  POST,GET,HOST
}