<template>
	<!-- 审批意见 -->
	<view class="container">
		<view class="main">
			<view class="navBox">
				<image src="../../static/img/nav_icon.png"  class="img"></image>
				<text class="title">审批意见</text>
			</view>
			<view class="inputBox">
				<textarea v-model="comments" placeholder="请输入审批意见" placeholder-class="input_palce" class="input"/>
			</view>
			<view class="btnBox">
				<button type="primary" class="passBtn" @click="goApprove">审批通过</button>
				<button type="primary" class="nopassBtn" @click="disagree">审批驳回</button>
			</view>
		</view>
	</view>
</template>
<script>
	//引入封装的本地存储处理工具
	import StorageUtil from "../../utils/storageUtils.js"
	//引入封装的字典匹配方法
	import FixedDictionaryData from "../../utils/fixedDictionaryData.js"
	//引入工具类
	import Utils from "../../utils/utils.js"
	export default{
		data(){
			return{
				token:"",//token，用于设置请求头
				id:"",//当前审核单据的id
				comments:"",//审核意见
				lockFlag:false,//锁定标识位 只有为false时，才执行代码	
				urlType: '/common/batchAudit',
			}
		},
		onLoad:function(option){
			this.id = option.id
		},
		onShow:function(){
			this.token = StorageUtil.get("token")
		},
		methods:{
			//审核通过
			goApprove:function(){				
				this.RequestApproveURL("yes")							
			},
			//驳回审核
			disagree:function(){			
				this.RequestApproveURL("no")
			},
			//请求审核的接口
			RequestApproveURL:function(agreeState){				
				//驳回审批必须填写意见
				if(agreeState=="no" && this.comments==""){					
					uni.showToast({
						title:"审批驳回时，必须填写审批意见",
						icon:"none"
					})
					return
				}
				uni.showLoading({
					title:"正在审批中~"
				})
				//增加防抖操作
				//调取审批接口
				if(!this.lockFlag){
					this.lockFlag =true
					uni.request({
						url:this.API_URL+this.urlType,
						method:"POST",
						header:{
							"Authorization":this.token,//为请求头加上token
							"Content-Type": "application/x-www-form-urlencoded",
						},
						data:{
							"data":this.id,
							"comment":this.comments,
							"agree":agreeState
						},					
						success: (res) => {
							let msg =""
							this.lockFlag=false
							// console.log(res,"我是请求的res")
							if(res.data.code==0){
								//审批完成
								if(agreeState=="yes"){
									msg = "审批已通过"
								}else if(agreeState=="no"){
									msg = "审批已驳回"
								}else if(agreeState=="cancel"){
									msg = "已取消"
								}
								setTimeout(()=>{
									uni.redirectTo({
										url:"/pages/approval/index"
									})
								},1500)
							}else{
								msg = "审批失败"
							}
							uni.showToast({
								title:msg,
								icon:"none",
								duration:1500
							})
							
						}
					})
					
				}else{
					//锁定该函数，无法再次点击
					uni.showToast({
						title:"请勿重复审批该单据",
						icon:"none"
					})
				}
				
			},
		}
	}
</script>

<style scoped>
	.container{
		width: 100vw;
		height: 100vh;
		background-color: #f2f2f2;
	}
	.main{
		padding: 20rpx 20rpx 80rpx 20rpx;
	}
	.navBox{
		margin-top: 45rpx;
		font-size: 32rpx;
	}
	.img{
		width: 10rpx;
		height: 32rpx;
		vertical-align: middle;
	}
	.title{
		margin-left: 14rpx;
	}
	.inputBox{
		margin-top: 45rpx;
	}
	.input_palce{
		/* 指定 placeholder 的样式类 */
		color: #969696;
		margin-left: 10rpx;
	}
	.input{
		width: 100%;
		min-height: 430rpx;
		font-size: 34rpx;
		line-height: 40rpx;
		border:1px solid #808080;
	}
	.btnBox{
		margin-top: 80rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		
	}
	.btnBox button{
		width: 75%;
		background-color: #5c97f5;
	}
	.btnBox .nopassBtn{
		margin-top: 24rpx;
		background-color: #fff;
		color: #000;
	}
</style>
