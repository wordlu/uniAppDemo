<template name="approvaling">
	<view class="container">
		<view class="itemList">
			<mescroll-uni ref="mescrollRef" @init='mescrollInit' @down="downCallback" @up="upCallback" :up="upOption"  class="message" :top='220' :bottom='160'>
				<view class="itemBox"  v-for="(item,index) in dataList" :key="item.id">
					<view>
						<image src="../../static/img/itemLeft1.png" style="width:36rpx;height: 126rpx;" ></image>
					</view>				
					<view class="">
						<checkbox :value="item.id" :checked="item.checked" style="transform:scale(0.7)" @click.stop="changeBoxChange(item.id)"/>
					</view>
					<view class="itemInfo" @click="goDetail(item.id,item.billType,item.billTypeDetail,item.auditState)">
						<view class="info" >
							<view class="infoItem">
								<view class="billCode">{{item.code==""?"code暂时为空":item.code}}</view>
								<view class="billType" @click="showDes(item.billTypeDetail)">{{item.billTypeDetail}}</view>
							</view>
							<view class="infoItem infoOperator ">
								<view class="">经办人:<text>{{item.nextOperation}}</text></view>
							</view>
						</view>
						<view class="moneyBox">
							<view class="pedding">
								待审批
							</view>
							<view class="price">
								￥{{item.amount}}
							</view>
						</view>
						<view class="more" >
							<image src="../../static/img/rightDetail.png" style="width:26rpx;height: 42rpx;" ></image>
						</view>
					</view>
				</view>
			</mescroll-uni>
		</view>
		<view class="btnBox">
			<button type="primary" class="approveBtn" @click="allAudit">批量审批</button>
			<button type="primary" class="approveBtn" @click="goApprovalprogress">流程查看</button>
		</view>
	</view>
</template>

<script>
	//引入封装的字典匹配方法
	import FixedDictionaryData from "../../utils/fixedDictionaryData.js"
	//引入工具类
	import Utils from "../../utils/utils.js"
	//懒加载
	import MescrollUni from '../uni-mescroll-master/mescroll-uni/components/mescroll-uni/mescroll-uni.vue';  //插件上拉加载下拉刷新
	export default{
		name:"approvaling",
		props:["searchVal"],
		data(){
			return{
				urlType:"/common/myToDoBillPage",//待审批
				dataList:[],
				idsArr:[],	//选中的bill的id			
				token:"",//token
				mescroll:null,//懒加载
				upOption:{
					noMoreSize: 5,
					textNoMore:'我是有底线的 >_<',
				},
			}
		},
		components:{
			MescrollUni,
		},
		mounted:function(){},
		methods:{
			showDes: function(des){				
				this.showDescription(des)				
			},
			//流程查看
			goApprovalprogress: function() {
				let idsArr=[] //网报模块的ids
				this.dataList.map(item=>{
					if(item.checked==true){
						idsArr.push(item.procInsId)
					}						
				})
				//没有选中任何单据
				if(idsArr.length!=1){
				   uni.showToast({
				   	title:"请选择一项单据查看审批流程及进度",
					icon:"none"
				   })
				   return
				}
				if(idsArr.length==1){
				   //将选中的单据id数组转换为字符串
				   let ids = idsArr.toString()
				   uni.navigateTo({
				   	url:"/pages/approval/approveProcess?id="+ids
				   })
				}
			},
			//批量审批按钮
			allAudit: function(){
				let idsArr=[] //网报模块的ids
				this.dataList.map(item=>{
					if(item.checked==true){
						idsArr.push(item.id+ '-' +item.billType)
					}						
				})
				//没有选中任何单据
				if(idsArr.length==0){
				   uni.showToast({
				   	title:"请至少选择一项单据进行审批",
					icon:"none"
				   })
				   return
				}
				if(idsArr.length>0){
				   //将选中的单据id数组转换为字符串
				   let ids = idsArr.toString()
				   this.goApprovalComments(ids)
				}
			},
			//审批意见
			goApprovalComments:function(id){
				uni.navigateTo({
					url:"/pages/approval/approveComments?id="+id
				})
			},
			//复选框状态发生变化时
			changeBoxChange:function(currentId){
				this.dataList.map(item=>{
					if(item.id==currentId){
						item.checked = !item.checked
					}						
				})
			},
			//查看详情
			goDetail:function (id,billType,billTypeDetail,auditState){
				if(billType=="FY"){ //费用
					uni.navigateTo({
						url:"/pages/reim/costExpense/costExpense?id="+id+"&billType="+billType+"&auditState="+auditState+"&isWrite=false"
					})	
				} else if(billType=="QK"){ //请款
					uni.navigateTo({
						url:"/pages/reim/reimRequiser/reimRequiser?id="+id+"&billType="+billType+"&auditState="+auditState+"&isWrite=false"
					})	
				} else if(billType=="SQSQ"){ //事前申请
					uni.navigateTo({
						url:"/pages/reim/priorApproval/priorApproval?id="+id+"&billType="+billType+"&auditState="+auditState+"&isWrite=false"
					})	
				} else if(billType=="GWJD"){ //公务接待
					uni.navigateTo({
						url:"/pages/reim/receptionApply/receptionApply?id="+id+"&billType="+billType+"&auditState="+auditState+"&isWrite=false"
					})	
				} else if(billType=="YWBX"){ //公务报销
					uni.navigateTo({
						url:"/pages/reim/receptionExpense/receptionExpense?id="+id+"&billType="+billType+"&auditState="+auditState+"&isWrite=false"
					})	
				} else if(billType=="CC"){ //出差申请
					uni.navigateTo({
						url:"/pages/reim/travelApply/travelApply?id="+id+"&billType="+billType+"&auditState="+auditState+"&isWrite=false"
					})	
				} else if(billType=="CLBX"){ //出差报销
					uni.navigateTo({
						url:"/pages/reim/travelExpense/travelExpense?id="+id+"&billType="+billType+"&auditState="+auditState+"&isWrite=false"
					})	
				} else{
					uni.showToast({
						title:"移动端暂不支持，请在PC端查看",
						icon:"none"
					})
				}
			},
			//搜索
			doSearch:function(val){
				this.code=val;
				this.dataList = [];
				this.mescroll.resetUpScroll();
			},
			//上拉加载
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
							"page":page.num,
							"limit":page.size,
							code,
						}						
						let JsonData=null
						this.$http.GET(this.urlType,params).then(res=>{
							if(res.data.code==0){
								let data = res.data.data
								if(res.data.data.length>0){
									if(page.num==1){
										_this.dataList=[];
										_this.mescroll.setPageNum(2)
									}
									_this.mescroll.endSuccess(res.data.count);
									let newArr=data.map(item =>{
										//单据类型
										item.billTypeDetail = FixedDictionaryData.findValue("dict_bill_type",item.billType);
										//经办人
										item.operator=FixedDictionaryData.findValue("dict_user",item.operator);
										//费用
										item.amount = Utils.fmtMoney(item.amount,2);
										//复选框
										item.checked =false;
										_this.dataList.push(item);
										return item;
									})
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
	.itemInfo{
		width: 90%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.btnBox{
		display: flex;
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
	.no_more_data{
		padding-bottom: 140rpx;
	}
	.itemBox{margin: 0 auto 15px;font-size: 14px;}
	.approveBtn{margin-top: 0px;width: 100%;width: 49%;background-color: #599af6;}
	.more{margin-right: 4px};
	.container{
		min-height: 100vh;
	}
	.itemList{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
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
	}
	.item{
		display: flex;
		margin-left: 12rpx;
		justify-content: space-around;
		align-items: center;
		width: 80vw;
	}
	.info{
		display: flex;
		flex-direction: column;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.infoItem{
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		max-width: 55vw;
	}
	.infoItem span {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.infoOperator{
		font-size: 30rpx;
	}
	.pedding,.price{
		color: #ee9e01;
		white-space: nowrap;
	}
	.pedding{
		text-align: center;
	}
	.no_more_data{
		
		font-size: 16px;
		color: #949292;
		text-align: center;
	}
	.billType{
		min-width: 78px;
		max-width:120rpx;
		margin-left: 26rpx;
		/* 超出显示省略号 */
		overflow: hidden;
		text-overflow:ellipsis;
		white-space: nowrap;
	}
	
	.billCode{
		/* width: 250rpx; */
	}
	.moneyBox{
		position: relative;
		top: -26rpx;
	}
	.price{
		position: absolute;
		right: 2rpx; 
		/* min-width: 162rpx; */
	}
	.more{
		margin-right: 4px
	}
	.more image{
		width:26rpx;
		height: 42rpx;
	}
</style>
