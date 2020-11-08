<template>
	<!-- 登录 -->
	<view class="container">
		<view class="">
			<view class="imageBox">
				<image src="../../static/img/loginTopImage.png" mode="widthFix"></image>
			</view>
			<view class="titleBox">
				<!-- <image src="../../static/img/bhLogo.png" mode="aspectFill"></image> -->
			</view>
			<view class="userInfo">
				<view class="nameBox">
					<image src="../../static/img/username.png" mode="widthFix"  class="userInfoImg"></image>
					<input type="text"  v-model="username" placeholder="请输入用户名" class="userName" />
				</view>
				<view class="passBox">
					<image src="../../static/img/password.png" mode="widthFix" class="userInfoImg"></image>
					<input password="true" v-model="password" placeholder="请输入密码" class="password"/>
				</view>
			</view>
			<view class="loginBtnBox">
				<button type="default" class="loginBtn" @click="login">登录</button>
				<view class="opt">
					<view class="opt-btn">
						<view @click="forget">忘记密码?</view>
						<view class="switch-btn">
							<view class="title" >记住密码</view>
							<view>
								<switch style="transform: scale(0.5,0.5)" name="switch" @change="switchClick" />
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="version">
				当前版本：版本{{$version}}
			</view>
		</view>
	</view>
</template>

<script>
	//引入字典模块
	import FixedDictionaryData from"@/utils/fixedDictionaryData.js"
	import StorageUtil from"@/utils/storageUtils.js"
	import {RSAKey,hex2b64} from "../../static/js/login.js"
	export default{
		data(){
			return{
				username:"",//用户名
				password:"",//密码
				errorMsg:"",//错误信息提示
				switchValue: true,
			}
		},
		mounted() {
			let _this = this;
			//页面加载完成，获取本地存储的用户名及密码
			const username = uni.getStorageSync('username');
			const password = uni.getStorageSync('password');
			if(username && password){
				_this.username = username;
				_this.password = password;
			}else{
				_this.username = "";
				_this.password = "";
			}
			
		},
		methods:{
			//记住密码
			switchClick: function(e) {
				let value = e.target.value
				let _this = this
				if(value) {
					this.switchValue = true;
				} else {
					this.switchValue = false;
				}
			},
			//忘记密码
			forget: function() {
				uni.showModal({
					title:this.errorMsg,
					content:"请联系系统管理员找回密码",
					showCancel:false
				})
				return;
			},
			//登录按钮
			login:async function(){
				this.errorMsg = "";
				if(this.username=="" || this.password==""){
					this.errorMsg = "用户名或者密码不能为空";
					uni.showModal({
						title:this.errorMsg,
						content:"请输入完整的用户名和密码",
						showCancel:false
					})
					return;
				}				
				// 对密码进行加密处理
				await uni.request({
					url:this.API_URL + '/keys',
					success:(res)=>{
						let {data}=res
						if(data.code==0){
							//接口调取成功
							let pubKey = data.data.pubKey;//公钥
							let e = data.data.pubExep;//
							let modulus = data.data.modulus;
							
							//加密
							var rsa = new RSAKey();
							rsa.setPublic(modulus, e);
							var pwdEncrypt = rsa.encrypt(this.password);
							pwdEncrypt = hex2b64(pwdEncrypt);
							//调取加密发生登录请求
							this.doLogin(this.username,pwdEncrypt,pubKey)
						}else{
							//接口调取失败
							this.errorMsg = data.msg;
							//给出提示信息
							uni.showToast({
								title:this.errorMsg,
								icon:"none",
								duration:1500
							})
							return;
						}
					},
					fail: (err) => {
						// console.log(err,"----错误返回的数据")
						this.errorMsg='网络错误，请稍后重试';
					}
				})
			},
			//加密发送登录请求
			doLogin: function(username,password,pubKey){
				let _this = this;
				uni.request({
					url:this.API_URL + '/1ogin',
					data:{
						username,
						password,
						pubKey
					},
					method:"POST",
					success:async (res)=>{
						if(res.data.code==1){
							//接口返回错误
							uni.showToast({
								title:res.data.msg,
								icon:"none",
								duration:1500
							})
							return;
						}else if(res.data.code ==0){
							let userInfo = res.data.data.user;
							//1.设置本地存储
							uni.setStorageSync("userInfo",userInfo);
							uni.setStorageSync("token",res.data.data.token);
							//2.获取字典数据，并存储在本地中
							let Dictionary= await this.getDictionaryDataFromServe(res.data.data.token)
							StorageUtil.set("Dictionary",Dictionary)
							//3.判断是否记住密码
							//登录成功将用户名密码存储到用户本地
							if(_this.switchValue){//用户勾选“记住密码”
								uni.setStorageSync('username', _this.username);
								uni.setStorageSync('password',  _this.password);
							}else{//用户没有勾选“记住密码”
								uni.removeStorageSync('username');
								uni.removeStorageSync('password');
								_this.username = "";
								_this.password = "";
							}
							// 3.跳转到首页(tab页面)
							uni.showToast({
								title:"登录成功",
								icon:"none",
								duration:600,
								success: () => {
									//跳转首页
									setTimeout(()=>{
										uni.switchTab({
											url:"/pages/index/index",	
										})
									},1000)
								}
							})
				
						}
	
					},
					fail: (err) => {
						console.log(err);
						this.errorMsg='网络错误，请稍后重试';
					}
				})
			},
			//获取字典的数据
			getDictionaryDataFromServe:function(token){
				return new Promise((resolve,reject)=>{					
					 uni.request({
						url:this.API_URL+"/json/dict",
						data:{
							dict:'loadall'
						},
						header:{
							"Authorization":token//为请求头加上token
						},
						success: res=> {
							// console.log(res,"-----字典的res")
							if (res.data.code == 0) {
								let Dictionary = res.data.data;
								resolve(Dictionary)
								//将字典数据存入本地存储中
								// _this.$store.commit('setDictdata',res.data.data);
								// console.log("---------字典的数据存储到本地了啊啊啊啊")
							}
						},
						fail:(err)=>{
							reject(err)
						}
					})
				})
				
			},
		}
	}
</script>

<style scoped>
	.container{
		width: 100vw;
		height: 100vh;
		background: url("../../static/img/loginBGN.png") 50% no-repeat;
	}
	.imageBox{
		padding-top: 80rpx;
		display: flex;
		justify-content: center;
	}
	.titleBox{
		margin-top: 50rpx;
		display: flex;
		justify-content: center;
	}
	.titleBox image{
		height: 64rpx;
	}
	/* 用户信息 */
	.userInfo{
		width: 100vw;
		margin-top: 60rpx;
	}
	
	.userInfo>view{
		width: 80vw;
		height: 80rpx;
		margin: 0 auto;
		font: 40rpx/2 "微软雅黑";
		background-color: #fff;
		border:1px solid #ccc;
		border-radius: 8px;
	}
	
	.userInfo >input{
		display:block;
		/* width: 80vw;
		height: 80rpx; */
		/* font: 40rpx/2 "微软雅黑"; */
		font-size: 40rpx;
		line-height: 80rpx;
	}
	/* .userInfo .userName{
		font-size: 40rpx;
	} */
	.userInfo .nameBox,.userInfo .passBox{
		display: flex;
		/* justify-content: space-between; */
		align-items: center;
	}
	.userInfo .nameBox>input,.userInfo .passBox>input{
		/* margin-left: 40rpx; */
	}
	.userInfo .passBox{
		margin-top: 45rpx;
	}
	.userInfoImg{
		width: 40rpx;
		/* height: 50rpx; */
		margin-left: 40rpx;
		margin-right: 86rpx;
	}
	.loginBtnBox{
		margin-top: 75rpx;
		width: 100vw;
	}
	.opt {
		width: 100vw;
		display: flex;
		justify-content: center;
		align-items: center;
		line-height: 40px;
	}
	.opt-btn {
		/* margin-top: 10px; */
		width: 80%;
		display: flex;
		align-items: row;
		justify-content: space-between;
		font-size: 28rpx;
		color: white;
	}
	.switch-btn {
		display: flex;
	}
	.uni-switch-wrapper {
		width: 60rpx;
		height: 20px;
	}
	.loginBtn{
		width: 80%;
		background-color: #4169e1;
		color: #fff;
	}
	.version{
		margin-top:30rpx;
		font-size: 28rpx;
		text-align: center;
	}
</style>
