
<template>
	<!-- 审批首页 -->
	<view class="container">
		<view>
			<!-- @searchVal为子传父的值 -->
			<uni-bh-search :searchHolder="searchPlaceholder" @searchVal="search" ref='searcBox'></uni-bh-search>
			<view class="tabBox">
				<view class="">
					<view :class="[billFlag == 1?'tabActive':'tab']" @click="approvaling">待提交</view>
					<view :class="[billFlag == 2?'tabActive':'tab']" @click="approved">审批中</view>
					<view :class="[billFlag == 3?'tabActive':'tab']" @click="approvalReturned">审批完成</view>
				</view>
			</view>
		</view>
		<view class="contentBox" style="padding-bottom:80px;">
			<uni-bh-toSubmit v-if="billFlag==1" :searchVal="searchVal" ref="approvaling"></uni-bh-toSubmit>
			<uni-bh-toApprovaling v-if="billFlag==2" :searchVal="searchVal" ref="approved"></uni-bh-toApprovaling>
			<uni-bh-toApproved v-if="billFlag==3" :searchVal="searchVal" ref="approvalReturned"></uni-bh-toApproved>
		</view>
		
	</view>
</template>

<script>
	import Utils from "../../utils/utils.js"
	export default{
		data(){
			return{
				searchVal: "",//搜索内容
				billFlag: 1,//类名标识 默认：待审批
				searchPlaceholder: "可搜索单据编号",
			}
		},
		onLoad:function(option){
			if(option.billFlag) {
				this.billFlag = option.billFlag;
			}
		},
		components:{},
		watch:{
			billFlag: function(value){
				this.searchVal='';
				this.$refs.searcBox.searchVal='';
			}
		},
		methods:{
			//搜索
			search: function(val){
				//val为子组件搜索框传递的搜索值
				if(this.billFlag == 1){
					this.$refs.approvaling.doSearch(val)
				}else if(this.billFlag == 2){
					this.$refs.approved.doSearch(val)
				} else {
					this.$refs.approvalReturned.doSearch(val)
				}
			},
			approvaling:function(){
				//点击"待提交"
				this.billFlag=1;
			},
			approved:function(){
				//点击"审批中"
				this.billFlag=2;
			},
			approvalReturned: function(){
				//点击"审批完成"
				this.billFlag=3;
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
