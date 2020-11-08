<!-- 穆文元 -->
<template>
	<!-- 关联单据明细 -->
	<view class="peojectName">
		<view  v-for="(item,index) in detailList" class='detailList_list'>
			<view class='detailList_title'>
				<view class="listtitle_left">
					<view v-if='item.billTypeIndex==="" || item.billTypeIndex==undefined || item.billTypeIndex==null'>关联单据明细{{index+1}}</view>
					<view v-else>关联单据明细{{index+1}}:{{billTypeLabel[item.billTypeIndex]}}</view>
				</view>
				<view class="listtitle_right">
					<text v-if='item.amountSum'>￥{{item.amountSum}}</text>
					<text v-else>￥0.00</text>
					<text style="font-size: 24px;color: #5A96F7;font-weight: bold;width: 31px;display: flex;align-items: center;justify-content: center;" 
					@click="iscontent(index)" :animation="item.animationData"><span>></span></text>
				</view>
			</view>
			<view class='smallItemBox' v-show='item.open'>
				<view class="delateBox" @click="delateItem(index)" v-if='isWrite'>
					<image src="../../static/img/delate_icon.png" mode="" class="delIcon"></image>
				</view>
				<view class='list_conten' style="width: 100%;">
					<view class="smallItemBoxTitle">关联单据</view>
					<view class="smallItemBoxContent">
						<view class="itemBox">
							<text class="leftMsg">关联单据类型</text>
							<view class="rightMsg">
								<picker :value="item.billTypeIndex" :range="billTypeLabel" :disabled='billTypeSelect || !isWrite'  @change="billTypeSelectMethod(index)">
									<view class="uni-input">{{billTypeLabel[item.billTypeIndex]}}</view>
								</picker>
							</view>
						</view>
						<view class="itemBox">
							<text class="leftMsg">单据编号</text>
							<input class="uni-input rightMsg" name="input" v-model="item.billCode" disabled/>
							<text style="margin-right: 3px;font-size: 24px;" v-if='isWrite'  @click="selectPage(index)">&gt;</text>
						</view>
						<view class="itemBox">
							<text class="leftMsg">名称</text>
							<input class="uni-input rightMsg" name="input" v-model="item.billName" disabled/>
						</view>
						<view class="itemBox">
							<text class="leftMsg">明细</text>
							<input class="uni-input rightMsg" name="input" v-model="item.detail" disabled/>
						</view>
						<view class="itemBox">
							<text class="leftMsg">单据总金额</text>
							<input class="uni-input rightMsg" name="input" v-model="item.billAmount" disabled/>
						</view>
						<view class="itemBox">
							<text class="leftMsg">单据已执行金额</text>
							<input class="uni-input rightMsg" name="input" v-model="item.billExecutedAmount" disabled/>
						</view>
						<view class="itemBox">
							<text class="leftMsg">单据未执行金额</text>
							<input class="uni-input rightMsg" name="input" v-model="item.billSurplusAmount" disabled/>
						</view>
						<view class="itemBox">
							<text class="leftMsg">本次执行额</text>
							<input class="uni-input rightMsg" name="input" v-model="item.amountSum" @focus="moneys(item.amountSum,index,'amountSum')"
							 @blur="moneyFormatter(item.amountSum,index,'amountSum')" :disabled='!isWrite'/>
						</view>
						<view class="itemBox">
							<text class="leftMsg">备注</text>
							<input class="uni-input rightMsg" name="input" v-model="item.memo" :disabled='!isWrite'/>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="addBox" @click="addDetailList" v-if='isWrite'>
			<image src="../../static/img/add.png" mode="" class="addIcon" ></image>
		</view>
		<!-- 请款单 -->
		<uni-requiser v-if='requiserState'  @closeIframe="closeIframe" @iframeContent='iframeApplyContent'></uni-requiser> 
	</view>
</template>

<script>
	import Utils from "../../utils/utils.js"
	export default{
		props:['billTypep','connectdata','isWritep'],
		data() {
			return {
				detailList:[], //单据明细
				isWrite:true, //控制是否可以编辑
				billTypeLabel:[], //关联单据类型
				billTypeValue:[], //关联单据类型
				billTypeSelect:false, //控制关联单据类型是否可以下拉,false为可以下拉，true为不可以
				requiserState:false,
				clickIndex:0,
				watchFirst:1,
				//添加动画
				animationData: {},
			};
		},
		components:{
			Utils,
		},
		watch:{
			connectdata:function(){
				if(this.watchFirst=='1'){
					this.detailList=this.connectdata;
					if(this.detailList.length>0){
						for(let i=0;i<this.detailList.length;i++){
							this.$set(this.detailList[i],"animationData",this.animation.export());
							this.$set(this.detailList[i],"billTypeIndex",'1');
							//本次执行金额
							if (this.detailList[i].amountSum === '' || this.detailList[i].amountSum == null || this.detailList[i].amountSum == undefined) {
								this.detailList[i].amountSum = '';
							} else {
								this.detailList[i].amountSum = Utils.fmtMoney(this.detailList[i].amountSum, 2); 
							}
							//单据总金额
							if (this.detailList[i].billAmount === '' || this.detailList[i].billAmount == null || this.detailList[i].billAmount == undefined) {
								this.detailList[i].billAmount = '';
							} else {
								this.detailList[i].billAmount = Utils.fmtMoney(this.detailList[i].billAmount, 2); 
							}
							//单据已执行金额
							if (this.detailList[i].billExecutedAmount === '' || this.detailList[i].billExecutedAmount == null || this.detailList[i].billExecutedAmount == undefined) {
								this.detailList[i].billExecutedAmount = '';
							} else {
								this.detailList[i].billExecutedAmount = Utils.fmtMoney(this.detailList[i].billExecutedAmount, 2); 
							}
							//单据未执行金额
							if (this.detailList[i].billSurplusAmount === '' || this.detailList[i].billSurplusAmount == null || this.detailList[i].billSurplusAmount == undefined) {
								this.detailList[i].billSurplusAmount = '';
							} else {
								this.detailList[i].billSurplusAmount = Utils.fmtMoney(this.detailList[i].billSurplusAmount, 2); 
							}
						}
					}else{
						this.addDetailList()
					}
					this.watchFirst+=1
				}
			},
		},
		mounted:function(){
			this.billType=this.billTypep
			this.isWrite=this.isWritep
			// 初始化一个动画
			var animation = uni.createAnimation({
				transformOrigin: "50% 50%",
				duration:300,
				timingFunction: 'ease',
			})
			this.animation = animation;
			//币种
			Utils.getTitle('dict_conection_page_type').then((res)=>{
			 	this.billTypeLabel=res[0]; 
			 	this.billTypeValue=res[1]; 
			})
			// if(this.billType=='QK' || this.billType=='YWBX' || this.billType=='CLBX' || this.billType=='HTSQ' || this.billType=='HTBG'){
			//   this.billTypeSelect=true;
			// }
		},
		methods:{
			//增加明细
			addDetailList:function(){
			 	let text={
			 		"amountSum": "", //本次执行金额
					"billAmount": "", //单据总金额
					"billCode": "", //单据编号
					"billName":'', //单据名称
					"billExecutedAmount": "", //单据已执行金额
					"billId": "", //单据id
					"billSurplusAmount": "", //单据未执行金额
					"billType": "", //关联单据类型
					"check": false, //
					"detail": "", //明细
					"id": "", //
					"isAudit": "", //
					"mainId": "", //主表id
					"memo": "",//备注
					"billTypeIndex":1,
			 		"open":true,
			 	}
			 	this.detailList.push(text);
			 	let len=this.detailList.length*1-1;
			 	this.animation.rotate(90).step()
			 	this.$set(this.detailList[len],"animationData",this.animation.export());
			},
			//删除明细
			delateItem:function(index){
				let _this=this;
				if(this.detailList.length==1){
				uni.showToast({
					title: '请保留一条数据',
					duration: 4000,
					icon:'none',
				});
				}else{
					uni.showModal({
						title: '提示',
						content: '确定要删除该数据吗？',
						success: function (res) {
							if (res.confirm) {
							   _this.detailList.splice(index,1);
							   _this.amountSumTotalmethod()
							} else if (res.cancel) {}
						}
					});
				}
			},
			//计算本次执行金额
			amountSumTotalmethod:function(){
			  if(this.detailList.length>0){ 
				let sum=0;
				for(var i=0;i<this.detailList.length;i++){
				  sum=Utils.accAdd(sum,Utils.delcommafy(this.detailList[i].amountSum)*1)
				}
				this.amountSumTotal=sum;
				this.$emit('getamountSumTotals',sum);
				if(this.billType=='FY'){
				  this.$parent.$parent.$parent.getyinbufa()
				}
			  }else{
				this.amountSumTotal='';
				this.$emit('getamountSumTotals','');
				if(this.billType=='FY'){
				  this.$parent.$parent.$parent.getyinbufa()
				}
			  }
			},
			//关联单据切换
			billTypeSelectMethod:function(i){
			  this.$set(this.detailList[i],'amountSum',''); //本次执行金额
			  this.$set(this.detailList[i],'billAmount',''); //单据总金额
			  this.$set(this.detailList[i],'billCode',''); //单据编号
			  this.$set(this.detailList[i],'billExecutedAmount',''); //单据已执行金额
			  this.$set(this.detailList[i],'billId',''); // 单据id
			  this.$set(this.detailList[i],'billName',''); //名称
			  this.$set(this.detailList[i],'billSurplusAmount',''); //单据未执行金额
			  this.$set(this.detailList[i],'budgetNum',''); //预算数量
			  this.$set(this.detailList[i],'budgetUnitPrice',''); //预算单价
			  this.$set(this.detailList[i],'detail',''); //明细
			  this.$set(this.detailList[i],'memo',''); //备注
			  this.$set(this.detailList[i],'planDate',''); //计划执行日期
			  this.$set(this.detailList[i],'amountSum',''); //
			  this.$set(this.detailList[i],'amountSum',''); //
			  this.getbufa()
			},
			//调用父级计算应不发金额
			getbufa:function(){
			  // this.$parent.$parent.$parent.getyinbufa()
			},
			//选择单据
			selectPage:function(index){
				//选择合同，可以选择的合同是合同状态为生效、执行中、维保期的合同
				this.clickIndex=index
				if(this.billTypeValue[this.detailList[index].billTypeIndex]=='HT'){
					// if(this.billType=='QK' || this.billType=='FY'){
					//   this.$util.layerFrameSpecial('选择合同', this.$page.contractPlan, '60%', '80%', this)
					// }else{
					//   this.$util.layerFrameSpecial('选择合同', this.$page.contract, '60%', '80%', this)
					// }
					uni.showToast({title: '正在开发中......',duration: 2000,icon:'none',});
				}
				//选请款单【剩余借款】大于0的单据
				if(this.billTypeValue[this.detailList[index].billTypeIndex]=='QK'){
					this.clickIndex=index;
					this.requiserState=true;
				} 
				//选预算信息
				if(this.billTypeValue[this.detailList[index].billTypeIndex]=='YS'){ 
					// let mustBudget=[],budgetDeparts=[];
					// if(this.billType=='FY'){
					//   if(this.$parent.$parent.$parent.detailList.length>0){
					// 	for(let i=0;i<this.$parent.$parent.$parent.detailList.length;i++){
					// 	  if(this.$parent.$parent.$parent.detailList[i].relationBudget=='0'){
					// 		mustBudget.push(this.$parent.$parent.$parent.detailList[i].budgetSubjectCode);
					// 	  }
					// 	  budgetDeparts.push(this.$parent.$parent.$parent.detailList[i].budgetDepartid);
					// 	}
					//   }
					// }
					// this.mustBudgetString=mustBudget.join(',');
					// this.departIdString=budgetDeparts.join(',');
					// this.$util.layerFrameProject('选择预算单据', this.$page.budgetIframe, '95%', '95%', this)
					uni.showToast({title: '正在开发中......',duration: 2000,icon:'none',});
				}
			},
			//请款单返回的内容
			iframeApplyContent:function(data){
				if (this.billType == "YWBX" || this.billType == "CLBX" || this.billType == "FY" || this.billType == "QK") {
				  this.$set(this.detailList[this.clickIndex],'billCode',data.billCode);
				  this.$set(this.detailList[this.clickIndex],'billName',data.billName);
				  this.$set(this.detailList[this.clickIndex],'billId',data.billId);
				  this.$set(this.detailList[this.clickIndex],'detail',data.detail); //明细
				  this.$set(this.detailList[this.clickIndex],'billAmount',data.billAmount); //单据总金额
				  this.$set(this.detailList[this.clickIndex],'billExecutedAmount',data.billExecutedAmount);//单据已执行金额
				  this.$set(this.detailList[this.clickIndex],'billSurplusAmount',data.billSurplusAmount); //单据未执行金额
				}
				if(this.billType == "FY"){
					// this.$parent.getbufa()
				}
				this.requiserState=false;
			},
			// 金额失去焦点格式化金额
			moneyFormatter:function(value,index, name) {
			    let _this = this;
			    let tableData = [];
			    tableData=this.detailList;
			    let moneyState=Utils.fmtMoney(value,2)
			    if(moneyState=='NaN'){
				  uni.showToast({
				  	title:'请输入正确金额',
				  	duration: 4000,
				  	icon:'none',
				  });
				  _this.$set(tableData[index], name,'');
			    }else{
				  if (value === "" || value == undefined || value == null) {
				    _this.$set(tableData[index], name, '');
				  } else {			  
				    _this.$set(tableData[index],name,moneyState);
				  }
			    }
				this.amountSumTotalmethod();
			},
			//金额获得焦点
			moneys:function(value, index, name) {
			   let _this = this;
			   let tableData = [];
			   tableData = _this.detailList;
			   if (value === "" ||value == "undefined" ||value == undefined)
			   {
				 _this.$set(tableData[index], name, "");
			   } else {
				 _this.$set(tableData[index],name,Utils.delcommafy(tableData[index][name]));
			   }
			},
			//切换小三角显示和隐藏
			iscontent:function(index){
				if(this.detailList[index].open){ //正在打开
					this.$set(this.detailList[index],"open",false);
					this.norotateAndScale(index);
				}else{ //正在关闭
					this.$set(this.detailList[index],"open",true);
					this.rotateAndScale(index);
				}
			},
			// 定义动画内容
			rotateAndScale:function(index) {
				this.animation.rotate(90).step()
				this.$set(this.detailList[index],"animationData",this.animation.export());
			},
			norotateAndScale:function(index) {
				this.animation.rotate(0).step()
				this.$set(this.detailList[index],"animationData",this.animation.export());
			},
			//关闭弹框
			closeIframe:function(){
				this.requiserState=false; //请款单
			},
		}
	}
</script>
<style scoped>
	
</style>
