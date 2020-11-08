<template>
	<!-- 请款单 -->
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
								<text class="leftMsg">请款人</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.operatorName" disabled/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">请款人部门</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.departName" disabled/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">归属年度<i class='mustIcon'>*</i></text>
								<view class="rightMsg">
									<picker :value="yearIndex" :range="yearLabel" :disabled='!isWrite'  @change="yearChange">
										<view class="uni-input">{{yearLabel[yearIndex]}}</view>
									</picker>
								</view>
							</view>
							<view class="itemBox">
								<text class="leftMsg">请款事由<i class='mustIcon'>*</i></text>
								<input class="uni-input must" data-must='请款事由' :data-value="allData.reason" name="input" v-model="allData.reason"/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">币种<i class='mustIcon'>*</i></text>
								<view class="rightMsg">
									<picker @change="currencyChange" :value="currencyIndex" :range="currencyLabel" :disabled='!isWrite'>
										<view class="uni-input">{{currencyLabel[currencyIndex]}}</view>
									</picker>
								</view>
							</view>
							<view class="itemBox">
								<text class="leftMsg">报销类型<i class='mustIcon'>*</i></text>
								<view class="rightMsg">
									<picker @change="expensetypeChange" :value="expensetypeIndex" :range="expensetypeLabel" :disabled='!isWrite'>
										<view class="uni-input">{{expensetypeLabel[expensetypeIndex]}}</view>
									</picker>
								</view>
							</view>
							<view class="itemBox">
								<text class="leftMsg">项目名称<i class='mustIcon'>*</i></text>
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
				</view>
			</view>
			<!-- 请款明细 -->
			<view  v-show="active==1">
				<view  v-for="(item,index) in allData.detailList" class='detailList_list'>
					<view class='detailList_title'>
						<view class="listtitle_left">
							<view>明细{{index+1}}</view>
						</view>
						<view class="listtitle_right">
							<text v-if='item.requisitionAmount'>￥{{item.requisitionAmount}}</text>
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
							<view class="smallItemBoxTitle"></view>
							<view class="smallItemBoxContent">
								<view class="itemBox">
									<text class="leftMsg">请款金额<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" 
										name="requisitionAmount" 
										v-model="item.requisitionAmount" 
										@focus="moneys(item.requisitionAmount,index,'requisitionAmount')"
										@blur="moneyFormatter(item.requisitionAmount,index,'requisitionAmount')" 
										:disabled='!isWrite' 
										:data-value='item.requisitionAmount' 
										data-must='请款金额'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg">预计还款日期</text>
									<picker mode="date" v-model="item.repaymentdate" @change="startTimeChange" :id="index"  :data-value='item.startTime' data-must='开始时间' 
									:disabled='!isWrite'>
										<view class="uni-input">{{item.repaymentdate}}</view>
									</picker>
								</view>
								<view class="itemBox">
									<text class="leftMsg">备注</text>
									<input class="uni-input rightMsg" name="input" v-model="item.memo"  :disabled='!isWrite'/>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="addBox" @click="addDetailList" v-if='isWrite'>
					<image src="../../../static/img/add.png" mode="" class="addIcon" ></image>
				</view>
			</view>
			<view  v-show="active==2">
				<uni-connection-page :billTypep='billType' :isWritep='isWrite' :connectdata='allData.detailList2' @getamountSumTotals='getamountSumTotals' ref='connectionPage'></uni-connection-page>
			</view>
			<view  v-show="active==3">
				<uni-payment :billTypep='billType' :isWritep='isWrite' :connectdata='payData' @paymentSumTotals='paymentSumTotals' ref='payPage' :first='1'></uni-payment>
			</view>
			<!-- 附件 -->
			<view  v-show="active==4">
				<uni-bh-uploadFile :fileList=fileList ref="attachmentData">
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
	</view>
</template>

<script>
	import Utils from "../../../utils/utils.js"
	export default{
		 data(){
			 return{
				billType:'QK',
				urlType:'/reimburse/reimRequisition',
				tabArr: ['基本信息', '请款明细', '关联单据', '支付信息', '附件'], //导航切换
				isWrite:true, //是否可以编辑
				active:0,//当前导航索引值
				seeprocInsId:false, //流程查看是否显示
				pageId:'',
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
				//添加动画
				animationData: {},
				fileList:[],//附件列表
				payData:[], //支付信息
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
			this.pageId=option.id; //单据id
			if(option.isWrite == "true") {
				this.isWrite = true;
			} else {
				this.isWrite = false;
			}
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
		 },
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
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
					id:this.pageId
					// id:'fbf6e2b8a5354939b849ef45c3200007'
				}
				this.$http.GET(`${this.urlType}/get`,params).then((res)=>{
					if(res.data.code==0){
						this.allData=res.data.data;
						this.connectPagedata=this.allData.detailList2; //关联单据
						this.payData=this.allData.detailList3; //支付信息
						this.fileList=this.allData.attachmentList; //附件
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
						//金额数据处理
						if(this.allData.detailList.length==0){
							this.addDetailList()
						}else{
							for(let i=0;i<this.allData.detailList.length;i++){
								//请款金额
								if (this.allData.detailList[i].requisitionAmount === "" || this.allData.detailList[i].requisitionAmount == null
								) {
								  this.allData.detailList[i].requisitionAmount = "";
								} else {
								  this.allData.detailList[i].requisitionAmount = Utils.fmtMoney(this.allData.detailList[i].requisitionAmount, 2); 
								}
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
			//增加请款明细
			addDetailList:function(){
			 	let text={
					"id": "", 
					"isAudit": "", 
					"mainId": "", //主表id
					"eatingnum":'', //就餐人数
					"requisitionAmount": "", //请款金额
					"repaymentdate": "",//预计还款日期
					"memo":"", //备注
					"reason":'',//请款事由
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
			//开始时间
			startTimeChange:function(e){
				let index=e.target.id; 
				this.$set(this.allData.detailList[index],'repaymentdate',e.target.value);
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
				//报销类型默认值
				if(!cloneArray.expensetype) {
					cloneArray.expensetype = 1;
				}
				//附件
				cloneArray.attachmentList =this.$refs.attachmentData.attachData;
				//关联单据明细
				cloneArray.detailList2 =this.$refs.connectionPage.detailList; //关联单据明细
				cloneArray.detailList3 =this.$refs.payPage.detailList; //支付信息
				tableDatas =Utils.deepClone(cloneArray);
				//请款单-请款明细
				for (let i = 0; i < tableDatas.detailList.length; i++) {
					//请款金额
					if (tableDatas.detailList[i].requisitionAmount === "" || tableDatas.detailList[i].requisitionAmount == null
					) {
					  tableDatas.detailList[i].requisitionAmount = "";
					} else {
					  tableDatas.detailList[i].requisitionAmount = Utils.delcommafy(tableDatas.detailList[i].requisitionAmount);
					}
					//金额
					if (tableDatas.detailList[i].amount === "" || tableDatas.detailList[i].amount == null
					) {
					  tableDatas.detailList[i].amount = "";
					} else {
					  tableDatas.detailList[i].amount = this.$util.delcommafy(tableDatas.detailList[i].amount);
					}
				}
				//请款单-关联单据
				for (let i = 0; i < tableDatas.detailList2.length; i++) {
					//金额合计
					if (tableDatas.detailList2[i].amountSum === "" || tableDatas.detailList2[i].amountSum == null
					) {
					  tableDatas.detailList2[i].amountSum = "";
					} else {
					  tableDatas.detailList2[i].amountSum = Utils.delcommafy(tableDatas.detailList2[i].amountSum);
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
					  tableDatas.detailList[i].billSurplusAmount = "";
					} else {
					  tableDatas.detailList2[i].billSurplusAmount = Utils.delcommafy(tableDatas.detailList2[i].billSurplusAmount);
					}
					//单据总金额
					if (tableDatas.detailList2[i].billAmount === "" || tableDatas.detailList2[i].billAmount == null
					) {
					  tableDatas.detailList[i].billAmount = "";
					} else {
					  tableDatas.detailList2[i].billAmount = Utils.delcommafy(tableDatas.detailList2[i].billAmount);
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
					tableDatas.flag = 1;
					this.savaDate(tableDatas, types);
				}
				if (types == 2) { //提交
					let mustmsg = Utils.mustFun(this);
					if(mustmsg){
						uni.showToast({title: '请填写' + mustmsg,duration: 2000,icon:'none',});
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
			//删除请款明细
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
							} else if (res.cancel) {}
						}
					});
				}
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
			//时间
			getDate:function(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				if (type === 'start') {
					year = year - 60;
				}else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
		}
	 }
</script>
<style>
	@import url("../../../static/css/common.css");
</style>
<style scoped>
</style>
