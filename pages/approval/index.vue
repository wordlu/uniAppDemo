
<template>
	<!-- 审批首页 -->
	<view class="container">
		<view>
			<!-- @searchVal为子传父的值 -->
			<uni-bh-search :searchHolder="searchPlaceholder" @searchVal="search" ref='searcBox'></uni-bh-search>
			<view class="tabBox">
				<view class="">
					<view :class="[approvalingFlag == 1?'tabActive':'tab']" @click="approvaling">待审批</view>
					<view :class="[approvalingFlag == 2?'tabActive':'tab']" @click="approved">已审批</view>
					<view :class="[approvalingFlag == 3?'tabActive':'tab']" @click="approvalReturned">已退回</view>
				</view>
			</view>
		</view>
		<view class="contentBox" style="padding-bottom:80px;">
			<uni-bh-approvaling v-if="approvalingFlag==1" :searchVal="searchVal" ref="approvaling"></uni-bh-approvaling>
			<uni-bh-approved v-if="approvalingFlag==2" :searchVal="searchVal" ref="approved"></uni-bh-approved>
			<uni-bh-approvalReturned v-if="approvalingFlag==3" :searchVal="searchVal" ref="approvalReturned"></uni-bh-approvalReturned>
		</view>
		
	</view>
</template>

<script>
	import Utils from "../../utils/utils.js"
	export default{
		data(){
			return{
				searchVal: "",//搜索内容
				approvalingFlag: 1,//类名标识 默认：待审批
				searchPlaceholder: "可搜索单据编号",
			}
		},
		onLoad:function(option){
			if(option.approvalingFlag) {
				this.approvalingFlag = option.approvalingFlag;
			}
		},
		components:{},
		watch:{
			approvalingFlag: function(value){
				this.searchVal='';
				this.$refs.searcBox.searchVal='';
			}
		},
		methods:{
			//搜索
			search: function(val){
				//val为子组件搜索框传递的搜索值
				if(this.approvalingFlag == 1){
					this.$refs.approvaling.doSearch(val)
				}else if(this.approvalingFlag == 2){
					this.$refs.approved.doSearch(val)
				} else {
					this.$refs.approvalReturned.doSearch(val)
				}
			},
			approvaling:function(){
				//点击"待审批"
				this.approvalingFlag=1;
			},
			approved:function(){
				//点击"已审批"
				this.approvalingFlag=2;
			},
			approvalReturned: function(){
				//点击"已退回"
				this.approvalingFlag=3;
			},
		}
	}
</script>

<style>
	.container{
		/* height: 100vh; */
		min-height: 100vh;
		background-color: #f2f2f2;
	}
	
	.tabBox{
		position: fixed;
		/* #ifndef H5 */
		top: -5px;
		/* #endif */
		
		/* #ifdef H5 */
		top:37px;
		/* #endif */
		/* top: 55px; */
		left: 0;
		margin-top: 120rpx;
		background-color: #fff;
	}
	.tabBox .tab,.tabBox .tabActive{
		width: 33.3vw;
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
	.contentBox{
		margin-top: 12px;
	}
</style>
