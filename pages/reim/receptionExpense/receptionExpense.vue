<template>
	<!-- 差旅报销单 -->
	<view class="contentBox gray">
		<view class="tabBox">
			<view  v-for="(item,index) in tabArr" :key="index"  :class='{"tabListActive":active==index}' class='tabList'
			 @click="changTab(index)">{{item}}</view>
		</view>
		<view class="reimContent gray">
			<!-- 基本信息 -->
			<view  v-show="active==0">
				<view class="vertical">
					<view class="smallItemBox">
						<view class="smallItemBoxTitle">基础信息</view>
						<view class="smallItemBoxContent">						
							<view class="itemBox">
								<text class="leftMsg">单据编号</text>
								<input class="uni-input rightMsg" name="input" placeholder="保存后自动生成" v-model="allData.code" disabled/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">单据日期</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.billDate" disabled/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">经办人</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.operatorName" disabled/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">经办部门</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.departName" disabled/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">公务接待申请单<i class='mustIcon'>*</i></text>
								<input class="uni-input rightMsg must" name="input" v-model="allData.busiCode" disabled 
								:data-value='allData.busiCode' data-must='公务接待申请单'/>
								<text @click="goChooseApply()" style="margin-right: 3px;font-size: 24px;" v-if='isWrite'>&gt;</text>
							</view>
							<view class="itemBox">
								<text class="leftMsg">报销金额合计</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.amountSum" disabled/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">应补发金额</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.replacementAmount" disabled/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">合计支付金额</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.sumAmount" disabled/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">归属年度</text>
								<view class="rightMsg">
									<picker :value="yearIndex" :range="yearLabel" :disabled='!isWrite'  @change="yearChange">
										<view class="uni-input">{{yearLabel[yearIndex]}}</view>
									</picker>
								</view>
							</view>
							<view class="itemBox">
								<text class="leftMsg">币种</text>
								<view class="rightMsg">
									<picker @change="currencyChange" :value="currencyIndex" :range="currencyLabel" :disabled='!isWrite'>
										<view class="uni-input">{{currencyLabel[currencyIndex]}}</view>
									</picker>
								</view>
							</view>
							<view class="itemBox">
								<text class="leftMsg">报销类型</text>
								<view class="rightMsg">
									<picker @change="expensetypeChange" :value="expensetypeIndex" :range="expensetypeLabel" :disabled='!isWrite'>
										<view class="uni-input">{{expensetypeLabel[expensetypeIndex]}}</view>
									</picker>
								</view>
							</view>
							<view class="itemBox">
								<text class="leftMsg">项目名称</text>
								<view class="rightMsg">
									<picker @change="projectNameChange" :value="projectNameIndex" :range="projectNameLabel" :disabled='!isWrite'>
										<view class="uni-input">{{projectNameLabel[projectNameIndex]}}</view>
									</picker>
								</view>
							</view>
							<view class="itemBox">
								<text class="leftMsg">其他事项说明</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.otherMemo" :disabled='!isWrite'/>
							</view>
						</view>
					</view>
					<view class="smallItemBox">
						<view class="smallItemBoxTitle">填写基础信息</view>
						<view class="smallItemBoxContent">
							<view class="memoBox">
								<view class='itemBoxTextareaTitle'>招待说明<i class='mustIcon'>*</i></view>
								<textarea placeholder="请输入招待说明" v-model="allData.memo" class="itemBoxTextarea must" :disabled='!isWrite'
								:data-value='allData.memo' data-must='招待说明'/>
							</view>
						</view>
					</view> 
				</view>
			</view>
			<!-- 报销明细 -->
			<view  v-show="active==1">
				<view  v-for="(item,index) in allData.detailList" class='detailList_list'>
					<view class='detailList_title'>
						<view class="listtitle_left">
							<view>明细{{index+1}}</view>
						</view>
						<view class="listtitle_right">
							<text v-if='item.expenseAmount'>￥{{item.expenseAmount}}</text>
							<text v-else>￥0.00</text>
							<text style="font-size: 24px;color: #5A96F7;font-weight: bold;width: 31px;display: flex;align-items: center;justify-content: center;" 
							@click="iscontent(index)" :animation="item.animationData"><span>></span></text>
						</view>
					</view>
					<view class='smallItemBox' v-show='item.open'>
						<view class="delateBox" @click="delateItem(index)" v-if='isWrite'>
							<image src="../../../static/img/delate_icon.png" mode="" class="delIcon"></image>
						</view>
						<view class='list_conten' style="width: 100%;">
							<view class="smallItemBoxTitle">报销明细</view>
							<view class="smallItemBoxContent">
								<!-- <view class="itemBox">
									<text class="leftMsg">支出项目<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.payprojectname" disabled 
									:data-value='allData.payprojectname' data-must='支出项目'/>
									<text style="margin-right: 3px;font-size: 24px;" v-if='isWrite'>&gt;</text>
								</view> -->
								<!-- <view class="itemBox">
									<text class="leftMsg">负责接待部门<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.receptionDepartIndex" :range="receptionDepartLabel" :disabled='!isWrite'  @change="receptionDepartChange" 
										:id='index' :data-value='item.receptionDepartIndex' data-must='负责接待部门' class='must'>
											<view class="uni-input">{{receptionDepartLabel[item.receptionDepartIndex]}}</view>
										</picker>
									</view>
								</view> -->
								<view class="itemBox">
									<text class="leftMsg">接待对象<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.username" :disabled='!isWrite' :data-value='item.username' data-must='接待对象'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg">招待人数<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.peoplenum" :disabled='!isWrite'
									@blur="peoplechange(item.peoplenum,index,'peoplenum')" :data-value='item.peoplenum' data-must='招待人数'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg">陪同人数<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.accompaniedNumber" :disabled='!isWrite'
									@blur="peoplechange(item.accompaniedNumber,index,'accompaniedNumber')" :data-value='item.accompaniedNumber' data-must='陪同人数'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg">报销金额<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.expenseAmount" @focus="moneys(item.expenseAmount,index,'expenseAmount')"
									 @blur="moneyFormatter(item.expenseAmount,index,'expenseAmount')" :disabled='!isWrite' :data-value='item.expenseAmount' data-must='报销金额'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg">单据张数</text>
									<input class="uni-input rightMsg" name="input" v-model="item.billNumber" :disabled='!isWrite'/>
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
					<image src="../../../static/img/add.png" mode="" class="addIcon" ></image>
				</view>
			</view>
			<!-- 关联单据 -->
			<view  v-show="active==2">
				<uni-connection-page :billTypep='billType' :isWritep='isWrite' :connectdata='connectPagedata' @getamountSumTotals='getamountSumTotals' 
				ref='connectionPage'></uni-connection-page> 
			</view>
			<!-- 支付信息 -->
			<view  v-show="active==3">
				<uni-payment :billTypep='billType' :isWritep='isWrite' :connectdata='payData' @paymentSumTotals='paymentSumTotals' ref='payPage' :first='1'></uni-payment> 
			</view>
			<!-- 附件 -->
			<view  v-show="active==4">
				<uni-bh-uploadFile :fileList='fileList' ref="attachmentData">
				</uni-bh-uploadFile>
			</view>
		</view>
		<view class="bottomBox" v-if='seeprocInsId'>
			<button type="primary" class="tabfirst" @click="goApprovalprogress()">流程查看</button>
		</view>
		<view class="bottomBox" v-if='isWrite'>
			<button type="primary" class="tabfirst" @click="next" v-if='active==0'>下一步</button>
			<view class="tabCenter">
				<button type="primary" class="tabCenterBtn" @click="prev" v-if='active!=0 && active!=(tabArr.length*1-1)'>上一步</button>
				<button type="primary" class="tabCenterBtn" @click="next" v-if='active!=0 && active!=(tabArr.length*1-1)'>下一步</button>
			</view>
			<view class="tabCenter">
				<button type="primary" class="tabfirst tabCenterBtn" @click="prev" v-if='active==(tabArr.length*1-1)'>上一步</button>
				<button type="primary" class="tabCenterBtn" @click="save(2)" v-if='active==(tabArr.length*1-1)'>提交</button>
			</view>
		</view>
		<!-- 公务接待申请单 -->
		<uni-reception-apply v-if='applyState'  @closeIframe="closeIframe" @iframeContent='iframeApplyContent'></uni-reception-apply> 
	</view>
</template>

<script>
	import Utils from "../../../utils/utils.js"
	export default{
		data(){
			 return{
				billType:'YWBX',
				urlType:'/reimburse/reimReceptionExpense',
				tabArr: ['基本信息', '报销明细', '关联单据', '支付信息', '附件'], //导航切换
				isWrite:true, //是否可以编辑
				active:0,//当前导航索引值
				seeprocInsId:false, //流程查看是否显示
				pageId:'',
				applyState:false, //控制申请单是否显示
				allData:{},
				yearLabel:[], //归属年度
				yearValue:[], //归属年度
				yearIndex:0, // 归属年度索引
				currencyLabel:[], //币种
				currencyValue:[], //币种
				currencyIndex:0, // 币种索引
				expensetypeLabel:[], //报销类型
				expensetypeValue:[], //报销类型
				expensetypeIndex:0, // 报销类型索引
				projectNameLabel:[], //项目名称
				projectNameValue:[], //项目名称
				projectNameIndex:0, // 项目名称索引
				receptionDepartLabel:[], //负责接待部门
				receptionDepartValue:[], //负责接待部门
				connectPagedata:[], //关联单据
				payData:[], //支付信息
				fileList:[],//附件列表
				//添加动画
				animationData: {},
			 }
		},
		onShow() {
		 	// 初始化一个动画
			var animation = uni.createAnimation({
				transformOrigin: "50% 50%",
				duration:300,
				timingFunction: 'ease',
			})
			this.animation = animation
		},
		components:{},
		onLoad:function(option) {
			if(option.isWrite == "true") {
				this.isWrite = true;
			} else {
				this.isWrite = false;
			}
			this.pageId=option.id; //单据id
			//归属年度
			Utils.getTitle('dict_year_list').then((res)=>{
			 	this.yearLabel=res[0]; 
			 	this.yearValue=res[1]; 
			})
			//币种
			Utils.getTitle('dict_currency_list').then((res)=>{
			 	this.currencyLabel=res[0]; 
			 	this.currencyValue=res[1]; 
			})
			//报销类型
			Utils.getTitle('dict_channel').then((res)=>{
			 	this.expensetypeLabel=res[0]; 
			 	this.expensetypeValue=res[1]; 
			})
			//项目名称
			Utils.getTitle('dict_project_code_list').then((res)=>{
			 	this.projectNameLabel=res[0]; 
			 	this.projectNameValue=res[1]; 
			})
			//负责接待部门
			Utils.getTitle('dict_depart').then((res)=>{
				this.receptionDepartLabel=res[0]; //级别
				this.receptionDepartValue=res[1]; //级别
			})
			if(this.$mp.page.$getAppWebview && this.isWrite == false) {
				var webView = this.$mp.page.$getAppWebview();
				// index: 按钮索引, style {WebviewTitleNViewButtonStyles }  
				webView.setTitleNViewButtonStyle(0, {  
					color:'#f7f7f7'  
				});  
				webView.setTitleNViewButtonStyle(1, {
					color:'#f7f7f7'  
				});  
			}
		},
		computed: {},
		mounted: function() {
			this.getData()
		},
		//导航自定义按钮事件
		onNavigationBarButtonTap: function(type) {  
			 if(this.isWrite){
			 	if(type.text=='暂存'){
			 				 		this.save(0)
			 	}
			 	if(type.text=='保存'){
			 		this.save(1)		 
			 	}
			 }
		},
		methods:{
			//获取单据数据
			getData:function(){
				let _this = this; 
				let params={
					id:this.pageId,
				}
				this.$http.GET(`${this.urlType}/get`,params).then((res)=>{
					if(res.data.code==0){
						this.allData=res.data.data;
						this.connectPagedata=this.allData.detailList2; //关联单据
						this.payData=this.allData.detailList3; //支付信息
						this.fileList=this.allData.attachmentList;
						//经办部门	
						Utils.getDictTitle('dict_depart',this.allData.departId).then((res)=>{
							 this.allData.departName=res;
						});
						//归属年度
						if(this.allData.year){
							let index=this.yearValue.indexOf(this.allData.year+'');
							this.yearIndex=index;
						}else{
							this.yearIndex=0; 
						}
						//币种
						if(this.allData.currency){
							let index=this.currencyValue.indexOf(this.allData.currency);
							this.currencyIndex=index;
						}else{
							this.currencyIndex=0; 
						}
						//报销类型
						if(this.allData.expensetype){
							let index=this.expensetypeValue.indexOf(this.allData.expensetype+'');
							this.expensetypeIndex=index;
						}else{
							this.expensetypeIndex=0; 
						}
						//项目名称
						if(this.allData.projectName){
							let index=this.projectNameLabel.indexOf(this.allData.projectName);
							this.projectNameIndex=index;
						}else{
							this.projectNameIndex=0; 
						}
						//是否是独立核算部门 
						if(this.allData.isIndepd=='1'){ //是否是独立核算部门(1:否)
							if(this.allData.expensetype===''|| this.allData.expensetype==null ||  this.allData.expensetype==undefined){
							  this.allData.expensetype='1'
							  this.expensetypeIndex=this.expensetypeValue.indexOf('1');
							}
							if(this.allData.projectCode===''|| this.allData.projectCode==null ||  this.allData.projectCode==undefined){
							  this.allData.projectCode='123004002001000002';
							  this.projectNameIndex=this.projectNameValue.indexOf('123004002001000002');
							}
						}else{
							if(this.allData.expensetype===''|| this.allData.expensetype==null ||  this.allData.expensetype==undefined){
							  this.allData.expensetype='2'
							  this.expensetypeIndex=this.expensetypeValue.indexOf('2');
							}
							if(this.allData.projectCode===''|| this.allData.projectCode==null ||  this.allData.projectCode==undefined){
							  this.allData.projectCode='123004002001170001'
							  this.projectNameIndex=this.projectNameValue.indexOf('123004002001170001');
							}
						}
						//报销合计金额
						if (this.allData.amountSum === '' || this.allData.amountSum == null || this.allData.amountSum == undefined) {
							this.allData.amountSum = '';
						} else {
							this.allData.amountSum = Utils.fmtMoney(this.allData.amountSum, 2); 
						}
						//应补发金额
						if (this.allData.replacementAmount === '' || this.allData.replacementAmount == null || this.allData.replacementAmount == undefined) {
							this.allData.replacementAmount = '';
						} else {
							this.allData.replacementAmount = Utils.fmtMoney(this.allData.replacementAmount, 2); 
						}
						//合计支付金额
						if (this.allData.sumAmount === '' || this.allData.sumAmount == null || this.allData.sumAmount == undefined) {
							this.allData.sumAmount = '';
						} else {
							this.allData.sumAmount = Utils.fmtMoney(this.allData.sumAmount, 2); 
						}
						if(this.allData.detailList.length==0){
							this.addDetailList()
						}else{
							for(let i=0;i<this.allData.detailList.length;i++){
								//就餐标准
								if (this.allData.detailList[i].eatStandard === '' || this.allData.detailList[i].eatStandard == null || this.allData.detailList[i].eatStandard == undefined) {
									this.allData.detailList[i].eatStandard = '';
								} else {
									this.allData.detailList[i].eatStandard = Utils.fmtMoney(this.allData.detailList[i].eatStandard, 2); 
								}
								//报销金额
								if (this.allData.detailList[i].expenseAmount === "" || this.allData.detailList[i].expenseAmount == null
								) {
								  this.allData.detailList[i].expenseAmount = "";
								} else {
								  this.allData.detailList[i].expenseAmount = Utils.fmtMoney(this.allData.detailList[i].expenseAmount, 2); 
								}
								//预算总额
								if (this.allData.detailList[i].budgetAmountSum === "" || this.allData.detailList[i].budgetAmountSum == null
								) {
								  this.allData.detailList[i].budgetAmountSum = "";
								} else {
								  this.allData.detailList[i].budgetAmountSum = Utils.fmtMoney(this.allData.detailList[i].budgetAmountSum, 2); 
								}
								//预算已执行额
								if (this.allData.detailList[i].budgetExecutedAmount === "" || this.allData.detailList[i].budgetExecutedAmount == null
								) {
								  this.allData.detailList[i].budgetExecutedAmount = "";
								} else {
								  this.allData.detailList[i].budgetExecutedAmount = Utils.fmtMoney(this.allData.detailList[i].budgetExecutedAmount, 2); 
								}
								//预算剩余额度
								if (this.allData.detailList[i].budgetSurplusAmount === "" || this.allData.detailList[i].budgetSurplusAmount == null
								) {
								  this.allData.detailList[i].budgetSurplusAmount = "";
								} else {
								  this.allData.detailList[i].budgetSurplusAmount = Utils.fmtMoney(this.allData.detailList[i].budgetSurplusAmount, 2); 
								}
								//负责接待部门
								// if(this.allData.detailList[i].receptionDepart){
								// 	let index=this.receptionDepartValue.indexOf(this.allData.detailList[i].receptionDepart);
								// 	this.$set(this.allData.detailList[i],'receptionDepartIndex',index); //级别
								// }else{
								// 	this.receptionDepartIndex=0; 
								// }
							}
						}
					}else{
						uni.showToast({
						 	title:res.msg,
						 	duration: 4000,
						 	icon:'none',
						});
					}
				})
			},
			//增加报销明细
			addDetailList:function(){
				let index=this.receptionDepartValue.indexOf(this.allData.departId);
			 	let text={
			 		"accompaniedNumber": "", //陪同人数
					"billNumber": "", //单据张数
					"budgetAmountSum": "", //预算总额
					"budgetCentralizDepartid": "", //预算归口部门id
					"budgetCentralizDepartname": "", //预算归口部门
					"budgetDepartid":'', //预算部门id
					"budgetDepartname":'', //预算部门
					"budgetExecutedAmount": "", //预算已执行额
					"budgetSubjectCode": "", //预算科目
					'budgetSubjectName':'',
					"budgetSurplusAmount": "", //预算剩余额度
					"check": false, //
					"eatStandard": "", //就餐标准
					"eatingnum": "", //陪餐人数
					"endTime": "", //结束时间
					"expenseAmount": "", //报销金额
					"id": "", //
					"isAudit": "", //
					"mainId": "", //主表id
					"memo": "", //备注
					"payprojectcode": "", //支出项目编码
					"payprojectname": "", //支出项目名称
					"peoplenum": "", //招待人数
					"percentage": "", //执行率
					"receptionDepart":null, //接待部门
					"startTime": "", //开始时间
					"username": "",//接待对象
			 		"open":true,
			 	}
			 	this.allData.detailList.push(text);
			 	let len=this.allData.detailList.length*1-1;
			 	this.animation.rotate(90).step()
			 	this.$set(this.allData.detailList[len],"animationData",this.animation.export());
			 	if(this.active=='1'){
			 		uni.pageScrollTo({
			 		    scrollTop:9999999999,
			 		    duration: 300
			 		});
			 	}
			},
			//点击选择申请单
			goChooseApply:function(){
				this.applyState=true;
			},
			//申请单选中返回的内容
			iframeApplyContent:function(data){
				this.$set(this.allData, "busiCode", data.busiCode);
				this.$set(this.allData, "busiId", data.busiId);
				this.$set(this.allData, "memo", data.memo);
				this.allData.detailList=[];
				//获取明细
				let params={
					id:data.busiId
				}
				this.$http.GET(`/reimburse/reimReceptionApply/get`,params).then(res => {
				  if (res.data.code == 0) {
					if (res.data.data.detailList.length > 0) {
					  for (var i=res.data.data.detailList.length; i >0; i--) {
						let text = {
						  busiDetailId:res.data.data.detailList[i-1].id,
						  accompaniedNumber:res.data.data.detailList[i-1].accompaniedNumber, //陪同人数
						  billNumber: "", //单据张数
						  budgetAmountSum: "", //预算总额
						  budgetCentralizDepartid: "", //预算归口部门id
						  budgetCentralizDepartname: "", //预算归口部门
						  budgetDepartid: "", //预算部门id
						  budgetDepartname: "", //预算部门
						  budgetExecutedAmount: "", //预算已执行额
						  budgetSubjectCode: "", //预算科目
						  budgetSurplusAmount: "", //预算剩余额度
						  check: false, //
						  eatStandard: '', //就餐标准
						  eatingnum: res.data.data.detailList[i-1].eatingnum, //陪餐人数
						  endTime: '', //结束时间
						  expenseAmount:Utils.fmtMoney(res.data.data.detailList[i-1].estimatedTotalCost,2), //报销金额
						  id: "", //
						  isAudit: "", //
						  mainId: "", //主表id
						  memo: res.data.data.detailList[i-1].memo, //备注
						  payprojectcode: "", //支出项目编码
						  payprojectname: "", //支出项目名称
						  peoplenum: res.data.data.detailList[i-1].peoplenum, //招待人数
						  percentage: "", //执行率
						  receptionDepart:Utils.getDictValue('dict_depart',res.data.data.detailList[i-1].receptionDepart), //接待部门
						  startTime: res.data.data.detailList[i-1].startTime, //开始时间
						  username: res.data.data.detailList[i-1].username //接待对象
						};
						this.allData.detailList.unshift(text);
					  }
					}
					for (let i = 0; i < this.allData.detailList.length; i++) {
					  this.allData.detailList[i].indexs = i;
					}
					this.amountSumTotal()
				  }
				});
				this.applyState=false;
			},
			//计算预计费用总额
			amountSumTotal:function(){
			  let connectArray=[],sum2=0;
			  if(this.allData.detailList2.length>0){
				for(var i=0;i<this.allData.detailList2.length;i++){
				  sum2=Utils.accAdd(sum2,Utils.delcommafy(this.allData.detailList2[i].amountSum)*1)
				  if(this.allData.detailList2[i].billCode){
					connectArray.push(this.allData.detailList2[i].billCode)
				  }
				}
			  }
			  if(this.allData.detailList.length>0){
				let sum=0;
				for(var i=0;i<this.allData.detailList.length;i++){
				  sum=Utils.accAdd(sum,Utils.delcommafy(this.allData.detailList[i].expenseAmount)*1)
				}
				if(connectArray.length>0){
				  let money=Utils.numSub(sum*1,sum2*1)
				  this.allData.replacementAmount=Utils.fmtMoney(money,2)
				}else{
				  this.allData.replacementAmount=Utils.fmtMoney(sum,2)
				}
				this.$set(this.allData,'amountSum',Utils.fmtMoney(sum,2))
			  }else{
				this.$set(this.allData,'amountSum','');
				this.allData.replacementAmount=Utils.fmtMoney(sum2,2)
			  }
			},
			//归属年度修改
			yearChange:function(e){
				this.yearIndex=e.target.value;
				this.allData.year=this.yearValue[this.yearIndex];
			},
			//币种修改
			currencyChange:function(e){
				this.currencyIndex=e.target.value;
				this.allData.currency=this.currencyValue[this.currencyIndex];
			},
			//报销类型修改
			expensetypeChange:function(e){
				this.expensetypeIndex=e.target.value;
				this.allData.expensetype=this.expensetypeValue[this.expensetypeIndex];
			},
			//项目名称修改
			projectNameChange:function(e){
				this.projectNameIndex=e.target.value;
				this.allData.projectName=this.projectNameLabel[this.projectNameIndex];
				this.allData.projectCode=this.projectNameValue[this.projectNameIndex];
			},
			//负责接待部门切换
			receptionDepartChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id;
				this.$set(this.allData.detailList[detailseIndex],'receptionDepart',this.receptionDepartValue[index]); //级别
				this.$set(this.allData.detailList[detailseIndex],'receptionDepartIndex',index); //级别
			},
			// 金额失去焦点格式化金额
			moneyFormatter:function(value,index, name) {
			    let _this = this;
			    let tableData = [];
			    tableData=this.allData.detailList;
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
				if(name=='expenseAmount'){ //如果是就餐标准，计算总额
				  this.amountSumTotal()
				}
			},
			//金额获得焦点
			moneys:function(value, index, name) {
			   let _this = this;
			   let tableData = [];
			   tableData = _this.allData.detailList;
			   if (value === "" ||value == "undefined" ||value == undefined)
			   {
				 _this.$set(tableData[index], name, "");
			   } else {
				 _this.$set(tableData[index],name,Utils.delcommafy(tableData[index][name]));
			   }
			},
			//修改招待人数，陪同人数
			peoplechange:function(value,index,type){
			  let valuetext=Utils.attachNumChange(value);
			  let accompaniedNumbertext=0;//陪同人数
			  if(valuetext){
				if(type=='peoplenum'){ //招待人数
				  if(valuetext<10){ //招待人数<10;陪同人数<=3
					accompaniedNumbertext=3;
					this.$set(this.allData.detailList[index],'peoplenum',valuetext); //招待人数
					this.$set(this.allData.detailList[index],'accompaniedNumber',accompaniedNumbertext); //陪同人数
				  }else{ //招待人数>=10,陪同人数<=招待人数/3
					accompaniedNumbertext=Math.floor(valuetext*1/3);
					this.$set(this.allData.detailList[index],'peoplenum',valuetext); //招待人数
					this.$set(this.allData.detailList[index],'accompaniedNumber',accompaniedNumbertext); //陪同人数
				  }
				}
				if(type=='accompaniedNumber'){ //陪同人数
				  let peoplenum=this.allData.detailList[index].peoplenum; //招待人数
				  if(peoplenum==='' || peoplenum==null || peoplenum==undefined){
					uni.showToast({title: '请填写招待人数',duration:2000,icon:'none',});
					this.$set(this.allData.detailList[index],'accompaniedNumber',''); //陪同人
				  }else{
					if(peoplenum<10){
					  accompaniedNumbertext=3;
					}else if(peoplenum>10 || peoplenum==10){
					  accompaniedNumbertext=Math.floor(peoplenum*1/3);
					}
					if(valuetext>accompaniedNumbertext){
					  uni.showToast({title: '陪同人数大于招待人数的1/3',duration:2000,icon:'none',});
					  this.$set(this.allData.detailList[index],'accompaniedNumber',accompaniedNumbertext); //陪同人数
					}else{
					  this.$set(this.allData.detailList[index],'accompaniedNumber',valuetext); //陪同人数
					}
				  }
				}
			  }else{
				this.$set(this.allData.detailList[index],type,'')
			  }
			  //计算就餐人数
			  let peoplenumtexts=this.allData.detailList[index].peoplenum; //招待人数
			  let accompaniedNumbertexts=this.allData.detailList[index].accompaniedNumber; //招待人数
			  let eatingnumtexts=peoplenumtexts*1+accompaniedNumbertexts*1;
			  this.$set(this.allData.detailList[index],'eatingnum',eatingnumtexts); //陪同人数
			  this.estimatedTotal(index); //计算总额
			},
			//计算预计费用总额
			estimatedTotal:function(index){
			  let eatingnumText=this.allData.detailList[index].eatingnum; //陪餐人数
			  let eatStandardText=0; //就餐标准
			  if(this.allData.detailList[index].eatStandard==='' || this.allData.detailList[index].eatStandard==null){
				eatStandardText=0
			  }else{
				eatStandardText=Utils.delcommafy(this.allData.detailList[index].eatStandard)
			  }
			  let estimatedMoney=Utils.numMulti(eatingnumText,eatStandardText);
			  this.$set(this.allData.detailList[index],'estimatedTotalCost',Utils.fmtMoney(estimatedMoney,2))
			},
			//计算应补发金额
			getamountSumTotals:function(value){
				if(value*1>0){
					let money=Utils.numSub(Utils.delcommafy(this.allData.amountSum)*1,value*1)
					this.allData.replacementAmount=Utils.fmtMoney(money,2)
				}else{
					this.allData.replacementAmount=this.allData.amountSum
				}
			},
			//计算支付金额合计
			paymentSumTotals:function(value){
				console.log('计算支付金额合计')
				console.log(value)
				if(value*1>0){
					this.allData.sumAmount=Utils.fmtMoney(value,2)
				}else{
					this.allData.sumAmount=''
				}
			},
			//保存/提交接口
			save:function(types){
				let saveFlag = true;
				const that = this;
				var committext = "",flagtext='';
				if(types==0){ //暂存
					flagtext=2;
				}
				if (types == 1) { //保存
					flagtext= 1;
				}
				if(types == 2){ //提交
					flagtext=1;
					committext=true;
				}
				var tableDatas = {};
				var cloneArray = this.allData;
				cloneArray.attachmentList =this.$refs.attachmentData.attachData;
				cloneArray.detailList2 =this.$refs.connectionPage.detailList; //关联单据明细
				cloneArray.detailList3 =this.$refs.payPage.detailList; //支付信息
				tableDatas =Utils.deepClone(cloneArray);
				//报销金额合计
				if (tableDatas.amountSum === '' || tableDatas.amountSum == null || tableDatas.amountSum == undefined) {
					tableDatas.amountSum = '';
				} else {
					tableDatas.amountSum = Utils.delcommafy(tableDatas.amountSum); 
				}
				//应补发金额
				if (tableDatas.replacementAmount === '' || tableDatas.replacementAmount == null || tableDatas.replacementAmount == undefined) {
					tableDatas.replacementAmount = '';
				} else {
					tableDatas.replacementAmount = Utils.delcommafy(tableDatas.replacementAmount); 
				}
				//合计支付金额
				if (tableDatas.sumAmount === '' || tableDatas.sumAmount == null || tableDatas.sumAmount == undefined) {
					tableDatas.sumAmount = '';
				} else {
					tableDatas.sumAmount = Utils.delcommafy(tableDatas.sumAmount); 
				}
				//报销明细
				for (let i = 0; i < tableDatas.detailList.length; i++) {
					//就餐标准
					if (tableDatas.detailList[i].eatStandard === "" || tableDatas.detailList[i].eatStandard == null
					) {
					  tableDatas.detailList[i].eatStandard = "";
					} else {
					  tableDatas.detailList[i].eatStandard = Utils.delcommafy(tableDatas.detailList[i].eatStandard);
					}
					//报销金额
					if (tableDatas.detailList[i].expenseAmount === "" || tableDatas.detailList[i].expenseAmount == null
					) {
					  tableDatas.detailList[i].expenseAmount = "";
					} else {
					  tableDatas.detailList[i].expenseAmount = Utils.delcommafy(tableDatas.detailList[i].expenseAmount);
					}
					//预算总额
					if (tableDatas.detailList[i].budgetAmountSum === "" || tableDatas.detailList[i].budgetAmountSum == null
					) {
					  tableDatas.detailList[i].budgetAmountSum = "";
					} else {
					  tableDatas.detailList[i].budgetAmountSum = Utils.delcommafy(tableDatas.detailList[i].budgetAmountSum);
					}
					//预算已执行额
					if (tableDatas.detailList[i].budgetExecutedAmount === "" || tableDatas.detailList[i].budgetExecutedAmount == null
					) {
					  tableDatas.detailList[i].budgetExecutedAmount = "";
					} else {
					  tableDatas.detailList[i].budgetExecutedAmount = Utils.delcommafy(tableDatas.detailList[i].budgetExecutedAmount);
					}
					//预算剩余额度
					if (tableDatas.detailList[i].budgetSurplusAmount === "" || tableDatas.detailList[i].budgetSurplusAmount == null
					) {
					  tableDatas.detailList[i].budgetSurplusAmount = "";
					} else {
					  tableDatas.detailList[i].budgetSurplusAmount = Utils.delcommafy(tableDatas.detailList[i].budgetSurplusAmount);
					}
				}
				//关联单据明细
				if(tableDatas.detailList2.length>0){
					for (let i = 0; i < tableDatas.detailList2.length; i++) {
						//本次执行金额
						if (tableDatas.detailList2[i].amountSum === "" || tableDatas.detailList2[i].amountSum == null
						) {
						  tableDatas.detailList2[i].amountSum = "";
						} else {
						  tableDatas.detailList2[i].amountSum = Utils.delcommafy(tableDatas.detailList2[i].amountSum);
						}
						//单据总金额
						if (tableDatas.detailList2[i].billAmount === "" || tableDatas.detailList2[i].billAmount == null
						) {
						  tableDatas.detailList2[i].billAmount = "";
						} else {
						  tableDatas.detailList2[i].billAmount = Utils.delcommafy(tableDatas.detailList2[i].billAmount);
						}
						//单据已执行金额
						if (tableDatas.detailList2[i].billExecutedAmount === "" || tableDatas.detailList2[i].billExecutedAmount == null
						) {
						  tableDatas.detailList2[i].billExecutedAmount = "";
						} else {
						  tableDatas.detailList2[i].billExecutedAmount = Utils.delcommafy(tableDatas.detailList2[i].billExecutedAmount);
						}
						//单据未执行金额
						if (tableDatas.detailList2[i].billSurplusAmount === "" || tableDatas.detailList2[i].billSurplusAmount == null
						) {
						  tableDatas.detailList2[i].billSurplusAmount = "";
						} else {
						  tableDatas.detailList2[i].billSurplusAmount = Utils.delcommafy(tableDatas.detailList2[i].billSurplusAmount);
						}
					}
				}
				//支付信息
				if(tableDatas.detailList3.length>0){
					for (let i = 0; i < tableDatas.detailList3.length; i++) {
						//支付金额
						if (tableDatas.detailList3[i].paymentSum === "" || tableDatas.detailList3[i].paymentSum == null
						) {
						  tableDatas.detailList3[i].paymentSum = "";
						} else {
						  tableDatas.detailList3[i].paymentSum = Utils.delcommafy(tableDatas.detailList3[i].paymentSum);
						}
					}
				}
				if (types == 0) { //暂存
					tableDatas.flag =flagtext;
					this.savaDate(tableDatas,types);
				}
				if (types == 1) { //保存
					let mustmsg = Utils.mustFun(this);
					if(mustmsg){
						uni.showToast({title: '请填写' + mustmsg,duration: 2000,icon:'none',});
						return false
					}
					if(tableDatas.replacementAmount!=tableDatas.sumAmount){
					   uni.showToast({title: '支付金额需等于应补发金额',duration: 2000,icon:'none',});
					   return false
					}
					tableDatas.flag = 1;
					this.savaDate(tableDatas, types);
				}
				if (types == 2) { //提交
					let mustmsg = Utils.mustFun(this);
					if(mustmsg){
						uni.showToast({title: '请填写' + mustmsg,duration: 2000,icon:'none',});
						return false
					}
					if(tableDatas.replacementAmount!=tableDatas.sumAmount){
					   uni.showToast({title: '支付金额需等于应补发金额',duration: 2000,icon:'none',});
					   return false
					}
					tableDatas.flag = 1;
					tableDatas.commit =true;
					this.savaDate(tableDatas, types);
				}
			},
			savaDate:function(tableDatas, n) {
			  this.loading = true;
			  var _this = this;
			  this.$http.POST(`${this.urlType}/save`, tableDatas).then(res => {
				  if (res.data.code == 1) {
					return false;
				  }
				  if (n == 0) {
					uni.showToast({
						title: '暂存成功',
						duration:2000,
						icon:'none',
					});
				  }
				  if (n == 1) {
					uni.showToast({
						title: '保存成功',
						duration:2000,
						icon:'none',
					});
				  }
				  if (n == 2) {
					uni.showToast({
						title: '提交成功',
						duration:2000,
						icon:'none',
					});
				  }
				  //跳转我的单据
				  if (n == 2) {
				  	setTimeout(function(){
				  		uni.navigateTo({
				  			url:"../../myBill/index?billFlag=2",
				  		})
				  	},2000)
				  	
				  } else {
				  	  setTimeout(function(){
				  		uni.navigateTo({
				  			url:"../../myBill/index",
				  		})
				  	  },2000)
				  }
				})
				.catch(err => {
				  return err;
				});
				this.loading = false;
			},
			//删除明细
			delateItem:function(index){
				let _this=this;
				if(this.allData.detailList.length==1){
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
							   _this.allData.detailList.splice(index,1);
							   _this.amountSumTotal()
							} else if (res.cancel) {}
						}
					});
				}
			},
			//关闭弹框
			closeIframe:function(){
				this.applyState=false; //申请单弹框
			},
			//返回上一个页面
			close: function() {
				 uni.navigateBack()
			},
			//切换tab
			changTab:function(index){
				this.active=index
			},
			// 下一步
			next:function(){
				this.active=this.active+1
			},
			//上一步
			prev:function(){
				this.active=this.active-1
			},
			//切换小三角显示和隐藏
			iscontent:function(index){
				if(this.allData.detailList[index].open){ //正在打开
					this.$set(this.allData.detailList[index],"open",false);
					this.norotateAndScale(index);
				}else{ //正在关闭
					this.$set(this.allData.detailList[index],"open",true);
					this.rotateAndScale(index);
				}
			},
			// 定义动画内容
			rotateAndScale:function(index) {
				this.animation.rotate(90).step()
				this.$set(this.allData.detailList[index],"animationData",this.animation.export());
			},
			norotateAndScale:function(index) {
				this.animation.rotate(0).step()
				this.$set(this.allData.detailList[index],"animationData",this.animation.export());
			},
			// 去审批流程
			goApprovalprogress:function(){
				uni.navigateTo({
					url:"/pages/function/approval/approve_process?id="+this.allData.procInsId
				})
			},
		}
	 }
</script>
<style>
	@import url("../../../static/css/common.css");
</style>
<style scoped>
</style>
