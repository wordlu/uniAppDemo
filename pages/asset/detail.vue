<!-- 已盘点明细页 -->
<template>
	<view class="container">
		<view class="mainBox">
			<view class="billMsgBox">
				<view class="title">资产信息</view>
				<view class="msgBox">
					<view class="itemBox">
						<text class="leftMsg">资产名称</text>
						<text class="rightMsg" >办公桌123</text>
					</view>
					<view class="itemBox">
						<text class="leftMsg">资产名称</text>
						<text class="rightMsg" >办公桌123</text>
					</view>
					<view class="itemBox">
						<text class="leftMsg">资产编号</text>
						<text class="rightMsg" >{{code}}</text>
					</view>
					<view class="itemBox">
						<text class="leftMsg">资产位置</text>
						<text class="rightMsg" >财务办公室</text>
					</view>
					<view class="itemBox">
						<text class="leftMsg">使用人</text>
						<text class="rightMsg" >张利明</text>
					</view>
					<view class="itemBox">
						<text class="leftMsg">责任人</text>
						<text class="rightMsg" >张利明</text>
					</view>
				</view>
			</view>
			
			<view class="billMsgBox">
				<view class="title">盘点结果</view>
				<view class="msgBox">
					<view class="itemBox">
						<text class="leftMsg">现使用人</text>
						<view class="rightMsg" ><input type="text" value="" v-model="resData.user"/></view>
					</view>
					<view class="itemBox">
						<text class="leftMsg">现负责人</text>
						<view class="rightMsg" ><input type="text" value="" v-model="resData.responseMen"/></view>
					</view>
					<view class="itemBox">
						<text class="leftMsg">现使用部门</text>
						<view class="rightMsg" ><input type="text" value="" v-model="resData.dapart"/></view>
					</view>
					<view class="itemBox">
						<text class="leftMsg">现存放地点</text>
						<view class="rightMsg" ><input type="text" value="" v-model="resData.area"/></view>
					</view>
					<view class="itemBox">
						<text class="leftMsg">现使用状态</text>
						<view class="rightMsg" ><input type="text" value="" v-model="resData.useStatus"/></view>
					</view>
					<view class="itemBox">
						<text class="leftMsg">填写备注</text>
						<view class="rightMsg" ><input type="text" value="" v-model="resData.memo"/></view>
					</view>
				</view>
			</view>
			<view class="bottomBox">
				<view class="bottom">
					<button type="primary" class="approveBtn" @click="goList">提交并返回</button>
					<button type="primary" class="lookBtn" @click="goScan">提交继续扫码</button>
				</view>			
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				resData:{
					user:"张利明",//现使用人
					responseMen:"张利明",//现负责人
					dapart:"财务办公室",//现使用部门
					area:"财务办公室",//现存放地点
					useStatus:"使用",//现使用状态
					memo:"使用正常",//备注
				},
				code:"",
			}
		},
		onLoad(option) {
			// console.log(option.code)
			if(option.code){
				this.code=option.code
			}else{
				this.code="CW1243"
			}
		},
		methods:{
			//去列表页
			goList(){
				uni.navigateTo({
					url:"/pages/asset/list"
				})
			},
			//去首页扫码
			goScan(){
				uni.navigateTo({
					url:"/pages/asset/index"
				})
			}
		}
	}
</script>

<style scoped>
	@import url("/static/css/expend.css");
	@import url("/static/css/bill_qk.css");
	.mainBox{
		padding-top: 20rpx;
	}
	.rightMsg input{
		height: 68rpx;
		line-height: 68rpx;
	}
	.rightMsg>input{
		height: 100%;
	}
	.bottomBox>.bottom>button{
		width: 40vw;
	}
</style>
