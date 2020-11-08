<template name="approvaling">
	<!-- 待审批组件 -->
	<view class="container">
		<view class="itemList">
			<MeScrollUni ref="mescrollRef" @init='mescrollInit' @down="downCallback" @up="upCallback" :up="upOption"  class="message" :top='180' :bottom='160'>
				<view class="itemBox"  v-for="(item,index) in dataList" :key="item.id">
					<view class="itemInfo" @click="goDetail(item.id)">
						<view class="info" >
							<view class="infoItem">
								<view class="content">{{item.content}}</view>
							</view>
						</view>
						<view class="moneyBox">
						</view>
						<view class="more" >
							<!-- 更多 -->
							<image src="../../static/img/rightDetail.png" style="width:26rpx;height: 42rpx;" ></image>
						</view>
						
					</view>
				</view>
			</MeScrollUni>
		</view>
		
		<view class="btnBox">
			<button type="primary" class="approveBtn" @click="close">关闭</button>
		</view>
	</view>
</template>

<script>
	//引入封装的本地存储处理工具
	import StorageUtil from "../../utils/storageUtils.js"
	//引入封装的网络请求方法
	import NetworkUtil from "../../utils/networkUtils.js"
	//引入封装的字典匹配方法
	import FixedDictionaryData from "../../utils/fixedDictionaryData.js"
	//引入工具类
	import Utils from "../../utils/utils.js"
	//上拉加载，下拉刷新
	import MeScrollUni from '../uni-mescroll-master/mescroll-uni/components/mescroll-uni/mescroll-uni.vue'
	export default{
		name:"approvaling",
		props:["searchVal"],
		data(){
			return{
				urlType:"/admin/notify/page",//单据审批请求地址(全部)
				dataList:[],//列表数据
				auditState:0,//审批状态：0（待审批） 1(已审批)
				current:"",//单选框当前值
				idsArr:[],	//选中的bill的id			
				token:"",//token
				limit:999,//默认加载的条数
				// 上拉加载下拉刷新
				mescroll:null,
				upOption:{
					noMoreSize: 5,
					textNoMore:'我是有底线的 >_<',
				},
			}
		},
		components:{
			MeScrollUni,
		},
		mounted:function(){
			this.getList();
		},
		methods:{
			//关闭按钮
			close: function(){
			   uni.switchTab({
					url:"/pages/index/index"
			   })
			},
			//详情
			goDetail:function (id){
				uni.navigateTo({
					url:"/pages/remind/form?id="+id
				});
			},
			//加载列表
			getList:function(universal,limit){
				let _this = this;
				this.$http.GET(this.urlType,{
					page:1,
					limit:5,
				}).then(res=>{
					if(res.data.code==0){
						let data = res.data.data
						_this.dataList=data;
						setTimeout(()=>{
							// 关闭加载框
							uni.hideLoading()
						},2000)
					}else{
						uni.showToast({
							title:res.msg,
							duration: 2000,
							icon:'none',
						});
					}
				})
			},
			//上拉加载，下拉刷新
			mescrollInit:function(mescroll) {
				this.mescroll=mescroll;
			},
			// 下拉回调
			downCallback:function(mescroll){
				setTimeout(()=>{
					mescroll.endErr()
				},1000)
			},
			// 上拉回调
			upCallback:function(page){
				let _this=this;
				let code = this.code
				if(typeof code=="undefined") code=""
				setTimeout(()=>{ 
					let params={
						page:1,
						limit:5,
					}						
					this.$http.GET(this.urlType,params).then(res=>{
						if(res.data.code==0){
							let data = res.data.data
							if(res.data.data.length>0){
								let data = res.data.data
								_this.dataList=data;
							}else{
								_this.mescroll.endUpScroll(true); 
							}
						}else{
							uni.showToast({
								title:res.msg,
								duration: 2000,
								icon:'none',
							});
							this.mescroll.endErr();
						}
					}).catch(err=>{
						uni.showModal({
							title:"错误提示："+err,
							content:err,
						})
					})
				},1000)
			},			
		},
	}
</script>

<style scoped>
	.content {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 220px;
	}
	.itemBox{
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90vw;
		height: 140rpx;
		background-color: #fff;
		margin-bottom: 15px;
		border-radius: 6px;
		box-shadow: 3px 4px 2px  rgba(139, 132, 132, 0.4);
		font-size: 32rpx;
		line-height: 50rpx;
		margin: 0 auto 15px;
	}
	.itemInfo{
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 10px;
	}
	.btnBox{
		width:100%;
		position: fixed;
		bottom:0px; 
		left: 0;
		height: 77px;
		background-color: #f7f3f7;
		z-index: 999;
		padding: 10px 5vw 16px;
		box-sizing: border-box;
	}
	.more{margin-right: 4px};
	.itemList{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.approveBtn{width: 90%; background-color: #599af6;}
	.more image{
		width:32rpx;
		height: 42rpx;
		padding-top: 7px;
	}
</style>
