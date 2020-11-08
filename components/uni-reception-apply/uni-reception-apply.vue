<!-- 穆文元 -->
<template>
	<!-- 部门弹框 -->
	<view class="peojectName">
		<view class="header_top">
			<view class="headerTopLeft" @click="close"><image src="../../static/img/back_icon.png" mode="" class='banc-icon'></image></view>
			<view class="serchBoxRight">
				<uni-search-bar2 :searchHolder="searchPlaceholder" @searchVal="getData" ref='searcBox'></uni-search-bar2>
			</view>
		</view>
		<view class="peojectContent">
			<mescroll-uni @init='mescrollInit' @down="downCallback" @up="upCallback" :up="upOption"  class="message" :top='160' v-if='isList'>
				<view class="billMsgBox" v-for='(item,index) in pageData' :key="index">
					<radio :value="index+''" :checked="index === current" @click="radioClick(index)"  style="margin-left: 6px;"/>
					<view class='contentright'>
						<view class="peojectList">
							<text class='left'>单据编号：</text>
							<text class='right'>{{item.code}}</text>
						</view>
						<view class="peojectList">
							<text class='left'>公务内容：</text>
							<text class='right' :title='item.content'>{{item.content}}</text>
						</view>
						<view class="peojectList">
							<text class='left'>单据日期：</text>
							<text class='right'>{{item.billDate}}</text>
						</view>
						<view class="peojectList">
							<text class='left'>经办人：</text>
							<text class='right'>{{item.operatorName}}</text>
						</view>
						<view class="peojectList">
							<text class='left'>经办部门：</text>
							<text class='right'>{{item.departName}}</text>
						</view>
					</view>
				</view> 
			</mescroll-uni>
			<view class="noData" v-else>暂无数据</view> 
		</view>
		<view class="black_bg" v-if='blackState'></view>
	</view>

</template>

<script>
	import MescrollUni from '../uni-mescroll-master/mescroll-uni/components/mescroll-uni/mescroll-uni.vue';  //插件上拉加载下拉刷新
	import Utils from "../../utils/utils.js"
	export default{
		props:['departRows'],
		data() {
			return {
				searchPlaceholder:'可搜索单据编号',
				isList:true, //控制显示暂无数据
				current:'', //当前选中的行
				pageData:[], //数据集合
				//下拉到最底部的信息
				upOption:{
					textNoMore:'我是有底线的 >_<',
					auto:false
				},
				isShowNoMore:false, //显示无更多数据
				currentpage:1, //当前分页
				limit:8, //每页显示的条数
				totalpage:0,
				blackState:false, //控制显示大黑背景是否显示
				searchName:'',
			};
		},
		components:{
			MescrollUni,
			Utils,
		},
		mounted:function(){
			
		},
		methods:{
			// mescroll组件初始化的回调
			mescrollInit:function(mescroll) {
				this.getData()
			},
			//获取第一页数据
			getData:function(code){
				let _this=this;
				let params={}
				if(code==='' || code==null || code==undefined){
					code=''
					this.searchName=''
				}else{
					this.currentpage=1;
					this.searchName=code;
				}
				this.blackState=true;
				uni.showLoading({
				   title: '加载中'  
				});
				params={
					code:code,
					page:this.currentpage,
					limit:this.limit,
				}
				this.$http.GET("/reimburse/reimReceptionApply/page2",params).then((res)=>{
					if(res.data.code==0){
						this.pageData=res.data.data;
						this.blackState=false;
						if(this.pageData.length>0){
							uni.hideLoading();
							 _this.blackState=false;
							this.totalpage=Math.ceil(res.data.count/this.limit); //计算有几页
							this.$forceUpdate();
							this.isList=true;
						}else{
							this.isList=false;
							this.totalpage=0;
							this.isList=false;
							uni.hideLoading();
						}
					}
				})
			},
			// 下拉回调
			downCallback:function(mescroll){
				setTimeout(()=>{
					mescroll.endErr()
				},1000)
			},
			// 上拉回调
			upCallback:function(mescroll){
				let _this=this;
				setTimeout(()=>{ 
					if(this.totalpage > this.currentpage){
						this.currentpage++
						let params={}
						uni.showLoading({
						   title: '加载中'  
						});
						this.blackState=true;
						params={
							code:this.searchName,
							page:this.currentpage,
							limit:this.limit,
						}
						this.$http.GET("/reimburse/reimReceptionApply/page2",params)
						.then((res)=>{
							if(res.data.code==0){
								for(var i=0;i<res.data.data.length;i++){
									this.pageData.push(res.data.data[i]);
								}
								if(this.pageData.length>0){
									uni.hideLoading();
									this.totalpage=Math.ceil(res.data.count/this.limit); //计算有几页
								}
							}
						})
						this.isShowNoMore = false;
						mescroll.endUpScroll(this.isShowNoMore);
					}else {
						this.isShowNoMore = true;
						mescroll.endUpScroll(this.isShowNoMore); 
					}
				},1000)
			},
			//选中操作
			radioClick:function(value){
				if(this.current===value){
				 	this.current=''
				}else{
				 	this.current=value
				}
				let checkData=this.pageData[value]; //选中的数据
				let backData={
					busiCode:checkData.code,
					busiId:checkData.id,
					memo:checkData.content, 
				}
				this.$emit('iframeContent',backData);
			},
			//关闭
			close(){
				this.$emit('closeIframe');
			}
		}
	}
</script>
<style scoped>
	.header_top{width: 100%;height:70px;background-color: rgb(90, 154, 247);position: fixed;left: 0;top:0;right: 0;z-index: 999;display: flex;flex-direction: row;}
	.headerTopLeft{position: absolute;left: 0;top:20px;width:44px;height:44px;}
	.banc-icon{width: 100%;height: 100%;}
	.serchBoxRight{flex: 1;margin-left: 50px;margin-right:20px;display: flex;align-items: center;box-sizing: border-box;padding-top: 16px;width: 0px;}

	.serchBoxLeft{font-size: 27px;color: #FFFFFF;width: 38px;height: 30px;text-align: center;line-height: 30px;}
	.peojectName{display: flex;flex-direction: column;position: fixed;left: 0px;top:0px;right: 0px;bottom: 0px;background: #f2f2f2;
	z-index: 1000;}
	.peojectContent{padding: 0 2%;width: 100%;box-sizing: border-box;}
	.billMsgBox{display: flex;justify-content: center;align-items: center;flex-direction: row;padding:8px 0;background:#FFFFFF;
	border-bottom: 1px solid #cecbce;border-radius: 5px;margin-bottom: 20rpx;width: 96%;position: relative;margin: 0 auto 10px;}
	.checkleft{width:26px;margin-left: 8px;}
	.contentright{flex: 1;width: auto;}
	.peojectList{display: flex;flex-direction: row;text-align: left;font-size: 12px;width: 100%;
	box-sizing: border-box;padding: 0px 4px;line-height:22px;}
	.peojectList .left{width:74px;text-align: right;}
	.peojectList .right{flex: 1;width: 0px;word-wrap:break-word;word-break:normal; }
	.noData{width: 100%;height:20px;text-align: center;line-height:20px;margin-top: 100px;color: #ababab;font-size: 18px;}
	.black_bg{position: fixed;left: 0;top:0;right: 0;bottom: 0;background: rgba(0,0,0,0.4);z-index: 99999998;}
</style>
