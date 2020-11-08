<!-- 已盘点资产列表页 -->
<template>
	<view class="container">
		<!-- <search></search> -->
		<uni-bh-search ref='searcBox'></uni-bh-search>
		<view class="title">
			<text>已盘点资产</text>
		</view>
		<view class="mainBox">
			<view class="itemList">
				<view class="itemBox" v-for="item in assetList" :key="item.code" @click="goDetail(item.code)">
					<view>
						<!-- 图片 -->
						<image src="../../static/img/itemLeft1.png" class="leftImg"></image>						
					</view>
					<view class="itemInfo">
						<view class="info" >
							<!-- 审批单信息 -->
							<view class="infoItem">
								<!-- 审批单上面信息 -->
								<view class="billCode">办公桌</view>
								<!-- <view class="billType" >billTypeDetail</view> -->
							</view>
							<view class="infoItem infoOperator ">
								<!-- 审批单下面信息 -->
								<view class="">{{item.code}}</view>
							</view>
						</view>
						<view class="flexBox">
							<view class="statusBox">
								<view class="status">
									状态：正常
								</view>
								<view class="memo">
									备注：正常使用
								</view>
							</view>
							<view class="more" >
								<!-- 更多 -->
								<image src="../../static/img/rightDetail.png" ></image>							
							</view>
						</view>
						
					</view>	
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	// import search from "@/components/components_self/search/index.vue"
	export default{
		data(){
			return{
				assetList:[
					{
						code:"CW0291"
					},
					{
						code:"CW0292"
					},
					{
						code:"CW0293"
					},
					{
						code:"CW0294"
					},
					{
						code:"CW0295"
					},
					
				]
			}
		},
		components:{
			// search
		},
		methods:{
			goDetail(code){
				// console.log(code,"--------code")
				uni.navigateTo({
					url:"/pages/asset/detail?code="+code
				})
			}
		},
	}
</script>

<style scoped>
	
	@import url("/static/css/approve.css");
	.container{
		min-height: 100vh;
		background-color: #f2f2f2;
	}
	.itemList{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.leftImg{
		width:36rpx;
		height: 126rpx;
	}
	.itemInfo{
		width: 90%;
		display: flex;
		justify-content: space-between;
	}
	.flexBox{
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.more{
		margin-left: 20rpx;
	}
	.title{
		margin-top: 60px;
		margin-left: 40rpx;
		font: 46rpx/100rpx "微软雅黑";
		color: #6997e2;
	}
</style>
