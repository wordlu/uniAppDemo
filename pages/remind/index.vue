
<template>
	
	<view class="container">
		<view>
			<view class="tabBox">
				<view class="">
					<view :class="[remindFlag == true?'tabActive':'tab']" @click="approvaling">未读消息</view>
					<view :class="[remindFlag == true?'tab':'tabActive']" @click="approved">已读消息</view>
				</view>
			</view>
		</view>
		<view class="contentBox">
			<uni-bh-unRead v-if="remindFlag" ref="approvaling"></uni-bh-unRead>
			<uni-bh-haveRead v-if="!remindFlag" ref="approvedIframe"></uni-bh-haveRead>
		</view>
		
	</view>
</template>

<script>
	// import Utils from "../../../utils/utils.js"
	export default{
		data(){
			return{
				remindFlag:true,//类名标识 默认：待审批
			}
		},
		components:{
			//注册组件
			// approvaling,
			// approved,
			// search
		},
		watch:{
			remindFlag(value){
			}
		},
		methods:{
			approvaling:function(){
				//点击"未读消息"
				this.remindFlag=true;

			},
			approved:function(){
				//点击"已读信息"
				this.remindFlag=false;
			}
		}
	}
</script>

<style scoped>
	.tabBox{
		position: fixed;
		left: 0;
		margin-top: 20rpx;
		background-color: #fff;
	}
	.tabBox .tab,.tabBox .tabActive{
		width: 50vw;
		height: 36px;
		line-height: 36px;
		display: inline-block;
		text-align: center;
		font-size: 16px;
	}
	.tabBox .tabActive{
		color: #5a9af7;
		border-bottom: 2px solid #5A9AF7;
	}
	.contentBox {
		padding: 140rpx 20rpx;
		background-color: #f2f2f2;
		height: 100vh;
	}
	.content {
		max-width: 250px;
	}
</style>
