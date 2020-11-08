<template>
	<view class="container">
		<view class="mainBox" v-if="billPage == 1 || billPage == 0">
			<view class="title">
				费用报销
			</view>
			<view class="itemBox">
				<view class="item" v-for="(item,index) in expenseList" :key="index" @click="goBillLink(item.link)">
					<view class="item_img">
						<image :src="item.imgUrl" mode="widthFix" class="iconItem"></image>
					</view>
					<view class="item_title">
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="mainBox" v-if="billPage == 2 || billPage == 0">
			<view class="title">
				业务申请
			</view>
			<view class="itemBox">
				<view class="item" v-for="(item,index) in applyList" :key="index" @click="goBillLink(item.link)">
					<view class="item_img">
						<image :src="item.imgUrl" mode="widthFix" class="iconItem"></image>
					</view>
					<view class="item_title">
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="mainBox" v-if="billPage == 3 || billPage == 0">
			<view class="title">
				请款单据
			</view>
			<view class="itemBox">
				<view class="item" v-for="(item,index) in qkList" :key="index" @click="goBillLink(item.link)">
					<view class="item_img">
						<image :src="item.imgUrl" mode="widthFix" class="iconItem"></image>
					</view>
					<view class="item_title">
						<text>{{item.title}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			//商旅接口列表
			let expenseList=[
				{
					imgUrl:"../../static/img/ZCPT.png",
					title:"费用报销单",
					link:"costExpense/costExpense?isWrite=true",
				},
				{
					imgUrl:"../../static/img/DD.png",
					title:"差旅报销单",
					link:"travelExpense/travelExpense?isWrite=true"
				},				
				{
					imgUrl:"../../static/img/SF.png",
					title:"公务接待报销",
					link:"receptionExpense/receptionExpense?isWrite=true"
				},
			];
			let applyList=[
				{
					imgUrl:"../../static/img/SF.png",
					title:"出差审批单",
					link:"travelApply/travelApply?isWrite=true",
				},
				{
					imgUrl:"../../static/img/12306.png",
					title:"公务接待审批",
					link:"receptionApply/receptionApply?isWrite=true"
				},				
				{
					imgUrl:"../../static/img/SYQC.png",
					title:"事前审批单",
					link:"priorApproval/priorApproval?isWrite=true",
				},
			];
			let qkList=[
				{
					imgUrl:"../../static/img/XCJD.png",
					title:"请款单",
					link:"reimRequiser/reimRequiser?isWrite=true",
				},
				{
					imgUrl:"../../static/img/XC.png",
					title:"付款申请单",
					link:""
				},				
			];
			return{
				expenseList: expenseList,
				applyList: applyList,
				qkList: qkList,
				billPage: 0,
			}
		},
		onLoad:function(option) {
			this.billPage = option.billPage;
		},
		methods:{
			//商旅平台链接
			goBillLink(url){
				uni.navigateTo({
					url: url,
				})
			},
		}
	}
</script>

<style scoped>
	.container {
		width: 100vw;
		min-height: 100vh;
		padding-bottom: 20px;
		font-size: 14px;
		line-height: 24px;
		background-color: #f7f3f7;
	}
	.mainBox{
		width: 100vw;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.mainBox .title {
		font-weight: bold;
	}
	.itemBox{
		width: 100vw;
		display: flex;
		/* justify-content: flex-start; */
		/* justify-content:space-between; */
		align-items: center;	
		/* 自动换行 */
		flex-wrap:wrap;
	}
	.itemBox .item{
		display: flex;
		width: 29.3vw;
		height: 240rpx;
		background-color: #fff;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin: 2vw;
		float: left;
	}
	.iconImg{
		width: 60rpx;
		vertical-align:middle;
	}
	.iconItem{
		width: 100rpx;
		height: 100rpx;
	}
</style>
