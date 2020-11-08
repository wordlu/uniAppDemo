<template>
	<view class="container">
		<view class="">			
			<view class="infoBox" @click="mineInfo">
				<image src="../../static/img/mine-back.png" mode="widthFix" style="width: 100vw;" class="infoBack"></image>
				<view class="info">
					<view class="imgBox">
						<image src="../../static/img/mine-my.png" mode="widthFix" style="width: 168rpx;"></image>
					</view>
					<view class="msgBox">
						<view class="">姓名：{{userName}}</view>
						<view class="">科室：{{departName}}</view>
						<view class="">工号：{{workNumber}}</view>
					</view>
				</view>
			</view>
			<view class="functionBox">
				<view class="flexBox" @click="goMyBill">
					<view class="left">
						<view class=""><image src="../../static/img/mine-bill.png" mode="widthFix" class="flexImg"></image></view>
						<view class="">我的单据</view>
					</view>
					<view class="right">
						<image src="../../static/img/rightDetail.png" mode="" class="rightArrow"></image>
					</view>
				</view>
				
				<view class="flexBox" @click="developing">
					<view class="left">
						<view class=""><image src="../../static/img/mine-info.png" mode="widthFix" class="flexImg"></image></view>
						<view class="">通知设置</view>
					</view>
					<view class="right">
						<image src="../../static/img/rightDetail.png" mode="" class="rightArrow"></image>
					</view>
				</view>
				
				<view class="flexBox" @click="developing">
					<view class="left">
						<view class=""><image src="../../static/img/mine-clock.png" mode="widthFix" class="flexImg"></image></view>
						<view class="">修改密码</view>
					</view>
					<view class="right">
						<image src="../../static/img/rightDetail.png" mode="" class="rightArrow"></image>
					</view>
				</view>
				
				<view class="flexBox" @click="developing">
					<view class="left">
						<view class=""><image src="../../static/img/mine-clear.png" mode="widthFix" class="flexImg"></image></view>
						<view class="">清除缓存</view>
					</view>
					<view class="right">
						<image src="../../static/img/rightDetail.png" mode="" class="rightArrow"></image>
					</view>
				</view>
				
				<view class="flexBox" @click="developing">
					<view class="left">
						<view class=""><image src="../../static/img/mine-key.png" mode="widthFix" class="flexImg"></image></view>
						<view class="">权限检查</view>
					</view>
					<view class="right">
						<image src="../../static/img/rightDetail.png" mode="" class="rightArrow"></image>
					</view>
				</view>
				
				<view class="flexBox" @click="exitLogin">
					<view class="left">
						<view class=""><image src="../../static/img/mine-key.png" mode="widthFix" class="flexImg"></image></view>
						<view class="">退出登录</view>
					</view>
					<view class="right">
						<image src="../../static/img/rightDetail.png" mode="" class="rightArrow"></image>
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
	//引入封装的工具类
	import StorageUtil from "../../utils/storageUtils.js"
	export default {
		data() {
			return {
				userName:'',//用户名
				departName:'',//部门名称
				workNumber:'',//工号
			}
		},
		
		onShow:function(){
			//加载用户信息(因为是tab页，不可放在mounted中，否则出现用户信息加载错误)
			this.getUserInfo();
		},
		methods: {
			//个人信息
			mineInfo: function() {
				uni.navigateTo({
					url:"/pages/mine/mineInfo?userName="+this.userName
				})
			},
			//退出登录
			exitLogin(){
				// 1.弹出您是否要退出当前登录状态
				// 2.确认：2s后回到首页，并清除缓存；取消：关闭弹窗
				uni.showModal({
				    title: '退出登录提示',
				    content: '您是否要退出当前登录状态?',
				    success:  res=>{
				        if (res.confirm) {				       
							//弹出2秒后为您跳转登录页提示信息
							uni.showToast({
								title:"2秒后为您跳转登录页",
								icon:"none",
								duration:2000								
							})
							setTimeout(function() {
								//1.清除缓存
								StorageUtil.remove("userInfo")
								StorageUtil.remove("userInfo")
								StorageUtil.remove("token")
								//2.跳转登录页
								uni.navigateTo({
									url:"/pages/login/index"
								})
								// console.log("2s后跳转")
							}, 2000);
							
							
				        } else if (res.cancel) {
				            // console.log('用户点击取消');
				        }
				    }
				});
				
			},			
			//获取用户信息
			getUserInfo:function(){
				//获取本地存储中用户信息
				let userInfo = StorageUtil.get("userInfo")
				this.userName=userInfo.name
				this.departName =userInfo.departName
				this.workNumber = userInfo.username
			},
			//我的单据
			goMyBill:function(){
				uni.navigateTo({
					url:"/pages/myBill/index"
				})
			},
			//功能尚在开发中
			developing:function(){
				uni.showToast({
					title:"功能尚在开发中，敬请期待~",
					icon:"none"
				})
			}
			
		},
		
	}
</script>

<style scoped>
	.clearfix::after{
		content: "";
		display: block;
		clear: both;
	}
	.container{
		width: 100vw;
		height: 100vh;
		background-color: #f2f2f2;
	}
	/* 用户信息 */
	.infoBox{
		position: relative;
		width: 100vw;
		height: auto;
	}
	.info{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.infoBack{
		position: absolute;
	}
	.msgBox{
		margin-left: 50rpx;
		color: #fdfffe;
		z-index: 999;
	}
	.msgBox>view{
		margin-top: 20rpx;
	}
	/* 下方弹性盒 */
	.functionBox{
		margin-top: 140rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.flexImg{
		width: 50rpx;
	}
	.rightArrow{
		width: 30rpx;
		height: 46rpx;
	}
	.flexBox{
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 90vw;
		height: 90rpx;
		margin-bottom: 20px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 3px 4px 2px  rgba(139, 132, 132, 0.4);
	}
	.left{
		display: flex;
		align-items: center;
	}
	.left>view:first-child{
		margin-left: 32rpx;
		margin-right: 26rpx;
	}
	.right{
		margin-right: 25rpx;
	}
	.version{
		margin-top:30rpx;
		font-size: 28rpx;
		text-align: center;
	}
</style>
