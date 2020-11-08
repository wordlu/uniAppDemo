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
								<text class="leftMsg">出差申请单<i class='mustIcon'>*</i></text>
								<input class="uni-input rightMsg must" name="input" v-model="allData.busiCode" disabled 
								:data-value='allData.busiCode' data-must='出差申请单'/>
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
								<view class='itemBoxTextareaTitle'>出差事由<i class='mustIcon'>*</i></view>
								<textarea placeholder="请输入出差事由" v-model="allData.reason" class="itemBoxTextarea must" :disabled='!isWrite'
								:data-value='allData.reason' data-must='出差事由'/>
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
							<text v-if='item.subtotal'>￥{{item.subtotal}}</text>
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
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">出差人<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.businessmanIndex" :range="businessmanLabel" :disabled='!isWrite'  @change="businessmanChange" :id='index' 
										:data-value='item.businessmanid' data-must='出差人' class='must'>
											<view class="uni-input" v-if='businessmanLabel && businessmanLabel.length>0'>{{businessmanLabel[item.businessmanIndex]}}</view>
											<view class="uni-input" v-else style="display: block;width: 100%;height: 100%;"></view>
										</picker>
									</view>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">起始时间<i class='mustIcon'>*</i></text>
									<picker mode="date" v-model="item.startTime" @change="startTimeChange" :id="index"  :data-value='item.startTime' data-must='起始时间' 
									:disabled='!isWrite' class='must'>
										<view class="uni-input">{{item.startTime}}</view>
									</picker>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">终止时间<i class='mustIcon'>*</i></text>
									<picker mode="date" v-model="item.endTime" :id="index"  @change="endTimeChange" :data-value='item.endTime' data-must='终止时间' class='must'
									:disabled='!isWrite'>
										<view class="uni-input">{{item.endTime}}</view>
									</picker>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">出差天数<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.busiDays" :disabled='!isWrite' 
									:data-value='item.busiDays' data-must='出差天数' @change="busiDaysChange(item.busiDays,index,item)"/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">休假天数</text>
									<input class="uni-input rightMsg" name="input" v-model="item.vacationDays" :disabled='!isWrite' 
									@change="vacationAndVisitChange(item,index,'vacationDays')"/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">探亲天数</text>
									<input class="uni-input rightMsg" name="input" v-model="item.visitDays" :disabled='!isWrite' 
									@change="vacationAndVisitChange(item,index,'visitDays')"/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">出发地点<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.startAdress" :disabled='!isWrite' :data-value='item.startAdress' data-must='出发地点'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">到达地点<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.endAdressIndex" :range="endAdressLabel" :disabled='!isWrite'  @change="endAdressChange" :id='index' 
										:data-value='item.endAdress' data-must='到达地点' class='must'>
											<view class="uni-input">{{endAdressLabel[item.endAdressIndex]}}</view>
										</picker>
									</view>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">具体地点</text>
									<input class="uni-input rightMsg" name="input" v-model="item.specificAdress" :disabled='!isWrite'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">交通工具<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.transportIndex" :range="transportLabel" :disabled='!isWrite'  @change="transportChange" :id='index' 
										:data-value='item.transport' data-must='交通工具' class='must'>
											<view class="uni-input">{{transportLabel[item.transportIndex]}}</view>
										</picker>
									</view>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">接站<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.pickUpStationIndex" :range="isoryesLabel" :disabled='!isWrite'  @change="pickUpStationChange" :id='index' 
										:data-value='item.pickUpStation' data-must='接站' class='must'>
											<view class="uni-input">{{isoryesLabel[item.pickUpStationIndex]}}</view>
										</picker>
									</view>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">送站<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.takeOffStationIndex" :range="isoryesLabel" :disabled='!isWrite'  @change="takeOffStationChange" :id='index' 
										:data-value='item.takeOffStation' data-must='送站' class='must'>
											<view class="uni-input">{{isoryesLabel[item.takeOffStationIndex]}}</view>
										</picker>
									</view>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">城市间交通费</text>
									<input class="uni-input rightMsg" name="input" v-model="item.cityTransamount" @focus="moneys(item.cityTransamount,index,'cityTransamount')"
									 @blur="moneyFormatter(item.cityTransamount,index,'cityTransamount')" :disabled='!isWrite'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">交通费单据张数</text>
									<input class="uni-input rightMsg" name="input" v-model="item.transBillNumber" :disabled='!isWrite'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">住宿费用</text>
									<input class="uni-input rightMsg" name="input" v-model="item.staySubsidies" @focus="moneys(item.staySubsidies,index,'staySubsidies')"
									 @blur="moneyFormatter(item.staySubsidies,index,'staySubsidies')" :disabled='!isWrite'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">住宿单据张数</text>
									<input class="uni-input rightMsg" name="input" v-model="item.stayBillNumber" :disabled='!isWrite'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">补贴天数<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.subsidiesDays" :disabled='!isWrite' 
									:data-value='item.subsidiesDays' data-must='补贴天数' @change="subsidiesDaysChange(item.subsidiesDays,index,item)"/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">交通补贴<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.transSubsidies" @focus="moneys(item.transSubsidies,index,'transSubsidies')"
									 @blur="moneyFormatter(item.transSubsidies,index,'transSubsidies')" :disabled='!isWrite' :data-value='item.days' data-must='交通补贴'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">伙食补贴<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.eatSubsidies" @focus="moneys(item.eatSubsidies,index,'eatSubsidies')"
									 @blur="moneyFormatter(item.eatSubsidies,index,'eatSubsidies')" :disabled='!isWrite' :data-value='item.days' data-must='交通补贴'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">其他费用金额</text>
									<input class="uni-input rightMsg" name="input" v-model="item.otherAmount" @focus="moneys(item.otherAmount,index,'otherAmount')"
									 @blur="moneyFormatter(item.otherAmount,index,'otherAmount')" :disabled='!isWrite'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">其他费用单据张数</text>
									<input class="uni-input rightMsg" name="input" v-model="item.otherBillNumber" :disabled='!isWrite'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">其他费用说明</text>
									<input class="uni-input rightMsg" name="input" v-model="item.otherMemo" :disabled='!isWrite'/>
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
				<button type="primary" class="tabCenterBtn" @click="save(1)" v-if='active==(tabArr.length*1-1)'>提交</button>
			</view>
		</view>
		<!-- 出差申请单 -->
		<uni-travel-apply v-if='applyState'  @closeIframe="closeIframe" @iframeContent='iframeApplyContent'></uni-travel-apply> 
	</view>
</template>

<script>
	import Utils from "../../../utils/utils.js"
	export default{
		data(){
			 return{
				billType:'CLBX',
				urlType:'/reimburse/reimTravelExpense',
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
				endAdressLabel:[], //出差地点(省份-城市)
				endAdressValue:[], //出差地点(省份-城市)
				transportLabel:[], //出发/返回交通工具
				transportValue:[], //出发/返回交通工具
				isoryesLabel:[], //是否
				isoryesValue:[], //是否
				businessmanLabel:[], //出差人
				businessmanValue:[], //出差人
				businessmanRankId:[], //职级
				rankLabel:[],
				rankValue:[],
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
				this.receptionDepartLabel=res[0];
				this.receptionDepartValue=res[1];
			})
			//到达地点
			Utils.getTitle('dict_travelsubsidy_list').then((res)=>{
				this.endAdressLabel=res[0];
				this.endAdressValue=res[1];
			})
			//出发交通工具
			Utils.getTitle('dict_transport').then((res)=>{
				this.transportLabel=res[0];
				this.transportValue=res[1];
			})
			//是否
			Utils.getTitle('dict_yes_no').then((res)=>{
				this.isoryesLabel=res[0];
				this.isoryesValue=res[1];
			})
			//职级
			Utils.getTitle('dict_rank_list').then((res)=>{
				this.rankLabel=res[0];
				this.rankValue=res[1];
			})
			//出差人数据
			this.$http.GET('/datas/staff/busiselect?flag=2') .then((res) => {
				if(res.data.code==0){
				  let datas=res.data.data[0];
				  let keyObj=Object.keys(datas)
				  if(keyObj.length>0){
					for(var i=0;i<keyObj.length;i++){
					  this.businessmanLabel.push(datas[keyObj[i]].split('-')[0]); //出差人
					  this.businessmanValue.push(keyObj[i]); //出差人
					  this.businessmanRankId.push(datas[keyObj[i]].split('-')[1]); //职级
					}
				  }
				}
			})
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
					//id:'587e8f59fb034d20946d24b6f1800004',
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
								//出差人
								if(this.allData.detailList[i].businessmanid){
									let index=this.businessmanValue.indexOf(this.allData.detailList[i].businessmanid);
									this.$set(this.allData.detailList[i],'businessmanIndex',index);
								}else{
									this.businessmanIndex=0; 
								}
								//到达地点
								if(this.allData.detailList[i].endAdress){
									let index=this.endAdressValue.indexOf(this.allData.detailList[i].endAdress);
									this.$set(this.allData.detailList[i],'endAdressIndex',index);
								}else{
									this.endAdressIndex=0; 
								}
								//交通工具
								if(this.allData.detailList[i].transport){
									let index=this.transportValue.indexOf(this.allData.detailList[i].transport+'');
									this.$set(this.allData.detailList[i],'transportIndex',index);
								}else{
									this.transportIndex=0; 
								}
								//接站
								let pickUpStationindex=this.isoryesValue.indexOf(this.allData.detailList[i].pickUpStation+'');
								this.$set(this.allData.detailList[i],'pickUpStationIndex',pickUpStationindex);
								//送站
								let takeOffStationindex=this.isoryesValue.indexOf(this.allData.detailList[i].takeOffStation+'');
								this.$set(this.allData.detailList[i],'takeOffStationIndex',takeOffStationindex);
								//城市交通费
								if (this.allData.detailList[i].cityTransamount === '' || this.allData.detailList[i].cityTransamount == null 
								|| this.allData.detailList[i].cityTransamount == undefined) {
									this.allData.detailList[i].cityTransamount = '';
								} else {
									this.allData.detailList[i].cityTransamount = Utils.fmtMoney(this.allData.detailList[i].cityTransamount, 2); 
								}
								//住宿费用
								if (this.allData.detailList[i].staySubsidies === '' || this.allData.detailList[i].staySubsidies == null 
								|| this.allData.detailList[i].staySubsidies == undefined) {
									this.allData.detailList[i].staySubsidies = '';
								} else {
									this.allData.detailList[i].staySubsidies = Utils.fmtMoney(this.allData.detailList[i].staySubsidies, 2); 
								}
								//交通补贴
								if (this.allData.detailList[i].transSubsidies === '' || this.allData.detailList[i].transSubsidies == null 
								|| this.allData.detailList[i].transSubsidies == undefined) {
									this.allData.detailList[i].transSubsidies = '';
								} else {
									this.allData.detailList[i].transSubsidies = Utils.fmtMoney(this.allData.detailList[i].transSubsidies, 2); 
								}
								//伙食补贴
								if (this.allData.detailList[i].eatSubsidies === '' || this.allData.detailList[i].eatSubsidies == null 
								|| this.allData.detailList[i].eatSubsidies == undefined) {
									this.allData.detailList[i].eatSubsidies = '';
								} else {
									this.allData.detailList[i].eatSubsidies = Utils.fmtMoney(this.allData.detailList[i].eatSubsidies, 2); 
								}
								//其他费用金额
								if (this.allData.detailList[i].otherAmount === '' || this.allData.detailList[i].otherAmount == null 
								|| this.allData.detailList[i].otherAmount == undefined) {
									this.allData.detailList[i].otherAmount = '';
								} else {
									this.allData.detailList[i].otherAmount = Utils.fmtMoney(this.allData.detailList[i].otherAmount, 2); 
								}
								//小计
								if (this.allData.detailList[i].subtotal === '' || this.allData.detailList[i].subtotal == null 
								|| this.allData.detailList[i].subtotal == undefined) {
									this.allData.detailList[i].subtotal = '';
								} else {
									this.allData.detailList[i].subtotal = Utils.fmtMoney(this.allData.detailList[i].subtotal, 2); 
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
			//增加报销明细
			addDetailList:function(){
				let flagText=0;
				if(this.allData.detailList.length>0){
				  flagText=this.allData.detailList[0].flag;
				  for(var i=1;i<this.allData.detailList.length;i++){
					if(flagText<this.allData.detailList[i].flag){
					  flagText=this.allData.detailList[i].flag
					}
				  }
				}
			 	let text={
			 		"budgetAmountSum": "", //预算总额
				    "budgetCentralizDepartid": "", //预算归口部门id
				    "budgetCentralizDepartname": "", //预算归口部门
				    "budgetDepartid":'', //预算部门id
				    "budgetDepartname":'', //预算部门
				    "budgetExecutedAmount": "", //预算已执行额
				    "budgetSubjectCode": "", //预算科目
				    "budgetSubjectName": "", //预算科目
				    "budgetSurplusAmount": "", //预算剩余额度
				    "busiDays": "", //出差天数
				    "businessmanid": "", //出差人id
				    "check": false, //
				    "cityTransamount": "", //城市间交通费
				    "eatSubsidies": "", //伙食补贴
				    "endAdress": "", //到达地点
				    "endTime": "", //终止时间
				    "id": "", //
				    "isAudit": "", //
				    "mainId": "", //主表id
				    "otherAmount": "", //其他费用金额
				    "otherBillNumber": "", //其他费用单据张数
				    "otherMemo": "", //其他费用说明
				    "payprojectcode": "", //支出项目编码
				    "payprojectname": "", //支出项目名称
				    "percentage": "", //执行率
				    "pickUpStation": "", //接站
				    "specificAdress": "", //具体地点
				    "startAdress": "", //出发地点
				    "startTime": "", //起始时间
				    "stayBillNumber": "", //住宿费单据张数
				    "staysubsidy": "", //住宿费用
				    "subsidiesDays": "", //补贴天数
				    "subtotal": "", //小计
				    "takeOffStation": "", //送站
				    "transBillNumber": "", //交通费单据张数
				    "transSubsidies": "", //交通补贴
				    "transport": "", //交通工具
				    "vacationDays": 0, //休假天数
				    "visitDays": 0,//探亲天数
				    "flag":flagText*1+1, //标识
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
				this.allData.detailList=[];
				//获取明细
				let params={
					id:data.busiId
				}
				//获取明细
				this.$http.GET("/reimburse/reimBusiverifyBusi/get",params).then(res => {
				  if (res.data.code == 0) {
					this.allData.reason=res.data.data.reason;
					if (res.data.data.detailList.length > 0) {
					  for (var i = 0; i < res.data.data.detailList.length; i++) {
						let text = {
						  "budgetAmountSum": "", //预算总额
						  "budgetCentralizDepartid": "", //预算归口部门id
						  "budgetCentralizDepartname": "", //预算归口部门
						  "budgetDepartid":this.allData.operatorDepartId, //预算部门
						  "budgetDepartname":'', //预算部
						  "budgetExecutedAmount": "", //预算已执行额
						  "budgetSubjectCode": "", //预算科目
						  "budgetSurplusAmount": "", //预算剩余额度
						  "busiDays": res.data.data.detailList[i].days, //出差天数
						  "businessmanid": res.data.data.detailList[i].businessmanid, //出差人id
						  "businessmanIndex":this.businessmanValue.indexOf(res.data.data.detailList[i].businessmanid),
						  'businessmanName':this.businessmanLabel[this.businessmanValue.indexOf(res.data.data.detailList[i].businessmanid)],
						  "check":false, //
						  "cityTransamount": "", //城市间交通费
						  "eatSubsidies": "", //伙食补贴
						  "endAdress":this.endAdressValue[this.endAdressLabel.indexOf(res.data.data.detailList[i].startAdress)], //到达地点
						  "endAdressIndex":this.endAdressLabel.indexOf(res.data.data.detailList[i].startAdress),
						  "endTime": res.data.data.detailList[i].endTime, //终止时间
						  "id": "", //
						  "isAudit": "", //
						  "mainId": "", //主表id
						  "mealsubsidy": "", //伙食费标准
						  "otherAmount": "", //其他费用金额
						  "otherBillNumber": "", //其他费用单据张数
						  "otherMemo": "", //其他费用说明
						  "payprojectcode": "", //支出项目编码
						  "payprojectname": "", //支出项目名称
						  "percentage": "", //执行率
						  "pickUpStation": "", //接站
						  "rankId":res.data.data.detailList[i].rankId, //职级
						  "specificAdress": res.data.data.detailList[i].address, //具体地点
						  "startAdress": "", //出发地点
						  "startTime": res.data.data.detailList[i].startTime, //起始时间
						  "stayBillNumber": "", //住宿费单据张数
						  "staySubsidies": "", //住宿费用
						  "staysubsidy": "", //住宿费标准
						  "subsidiesDays":res.data.data.detailList[i].days, //补贴天数
						  "subtotal": "", //小计
						  "takeOffStation": "", //送站
						  "trafficsubsidy": "", //交通费标准
						  "transBillNumber": "", //交通费单据张数
						  "transSubsidies": "", //交通补贴
						  "transport":res.data.data.detailList[i].departureTransport, //交通工具
						  "transportIndex":this.transportValue.indexOf(res.data.data.detailList[i].departureTransport),
						  "vacationDays": 0, //休假天数
						  "visitDays": 0,//探亲天数
						  "flag":i, //标识
						  'open':false,
						};
						this.allData.detailList.push(text);
					  }
					}
					let rankIdArray=[];
					for (let i = 0; i < this.allData.detailList.length; i++) {
					  this.allData.detailList[i].indexs = i;
					  let rankIndex=this.rankValue.indexOf(this.allData.detailList[i].rankId);
					  let rankName=this.rankLabel[rankIndex];
					  rankIdArray.push(rankName);
					}
					if (this.billType == "CLBX") {
					  if(rankIdArray.indexOf('正处')>-1 || rankIdArray.indexOf('副局')>-1 || rankIdArray.indexOf('正局')>-1){
						this.approverIdState=true;
					  }else{
						this.approverIdState=false;
					  }
					  this.getSubsidyAll()
					}
				  }
				});
				this.applyState=false;
			},
			//获取全部标准
			getSubsidyAll:function(){
			  if(this.allData.detailList.length>0){
				let arriveEndressIdArray=[],rankidArray=[],arrivetimeArray=[];
				let arriveEndressIdStr='',rankidStr='',arrivetimeStr='';
				for(var i=0;i<this.allData.detailList.length;i++){
				  arriveEndressIdArray.push(this.allData.detailList[i].endAdress); //到达地点
				  rankidArray.push(this.allData.detailList[i].rankId); //职级
				  arrivetimeArray.push(this.allData.detailList[i].startTime); //时间
				}
				arriveEndressIdStr=arriveEndressIdArray.join(',');
				rankidStr=rankidArray.join(',');
				arrivetimeStr=arrivetimeArray.join(',');
				//获取明细
				let params={
					id:arriveEndressIdStr,
					rankid:rankidStr,
					arrivetime:arrivetimeStr
				}
				this.$http.GET('/datas/travelsubsidystandard/getBusySeason',params)
				.then((res) => {
				  if(res.data.code==0){
					let data=res.data.data; //内容
					for(var i=0;i<this.allData.detailList.length;i++){
					  this.$set(this.allData.detailList[i],'mealsubsidy',data[i].mealsubsidy); //伙食费标准
					  this.$set(this.allData.detailList[i],'staysubsidy',data[i].staysubsidy); //住宿费标准
					  this.$set(this.allData.detailList[i],'trafficsubsidy',data[i].trafficsubsidy); //交通费标准
					  if(this.allData.detailList[i].subsidiesDays!='' || this.allData.detailList[i].subsidiesDays!=undefined || this.allData.detailList[i].subsidiesDays!=null){
						let eatSubsidiestext=Utils.numMulti(this.allData.detailList[i].mealsubsidy,this.allData.detailList[i].subsidiesDays); //伙食补贴
						let transSubsidiestext=Utils.numMulti(this.allData.detailList[i].trafficsubsidy,this.allData.detailList[i].subsidiesDays); //交通补贴
						let staySubsidiestext=Utils.numMulti(this.allData.detailList[i].staysubsidy,this.allData.detailList[i].busiDays); //住宿费用
						this.$set(this.allData.detailList[i],'eatSubsidies',Utils.fmtMoney(eatSubsidiestext,2)); //伙食补贴
						this.$set(this.allData.detailList[i],'transSubsidies',Utils.fmtMoney(transSubsidiestext,2)); //交通补贴
						this.$set(this.allData.detailList[i],'staySubsidies',Utils.fmtMoney(staySubsidiestext,2)); //住宿费用
					  }
					  this.jsSubtotal(this.allData.detailList[i],i)
					}
				  }
				})
			  }
			},
			//计算当前行的小计
			jsSubtotal:function(row,index){
			  let sum1=Utils.accAdd(Utils.delcommafy(row.cityTransamount),Utils.delcommafy(row.staySubsidies)); //城市间交通费+住宿费用
			  let sum2=Utils.accAdd(Utils.delcommafy(row.transSubsidies),Utils.delcommafy(row.eatSubsidies)); //交通补贴+伙食补贴
			  let sum3=Utils.accAdd(sum1,Utils.delcommafy(row.otherAmount)); //城市间交通费+住宿费用+其他费用金额
			  let sum4=Utils.accAdd(sum3,sum2); //城市间交通费+住宿费用+其他费用金额+交通补贴+伙食补贴
			  this.$set(this.allData.detailList[index],'subtotal',Utils.fmtMoney(sum4,2));
			  this.amountSumTotal()
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
					sum=Utils.accAdd(sum,Utils.delcommafy(this.allData.detailList[i].subtotal)*1)
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
			//接站切换
			pickUpStationChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id;
				this.$set(this.allData.detailList[detailseIndex],'pickUpStation',this.isoryesValue[index]); 
				this.$set(this.allData.detailList[detailseIndex],'pickUpStationIndex',index); 
			},
			//送站切换
			takeOffStationChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id;
				this.$set(this.allData.detailList[detailseIndex],'takeOffStation',this.isoryesValue[index]); 
				this.$set(this.allData.detailList[detailseIndex],'takeOffStationIndex',index); 
			},
			//出差申请人修改
			businessmanChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id;
				this.$set(this.allData.detailList[detailseIndex],'businessmanid',this.businessmanValue[index]);
				this.$set(this.allData.detailList[detailseIndex],'businessmanname',this.businessmanLabel[index]); 
				this.$set(this.allData.detailList[detailseIndex],'businessmanIndex',index); 
				this.$set(this.allData.detailList[detailseIndex],'rankId',this.businessmanRankId[index]);
				if(this.allData.detailList[detailseIndex].endAdress && this.allData.detailList[detailseIndex].rankId && this.allData.detailList[detailseIndex].startTime){
					this.getSubsidy(this.allData.detailList[detailseIndex].endAdress,this.allData.detailList[detailseIndex].rankId,this.allData.detailList[detailseIndex].startTime,detailseIndex)
				}
				this.getDateList(index);
			},
			//到达地点
			endAdressChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id;
				this.$set(this.allData.detailList[detailseIndex],'endAdress',this.endAdressValue[index]); //部门
				this.$set(this.allData.detailList[detailseIndex],'endAdressIndex',index); //级别
				if(this.allData.detailList[detailseIndex].endAdress && this.allData.detailList[detailseIndex].rankId && this.allData.detailList[detailseIndex].startTime){
					this.getSubsidy(
					this.allData.detailList[detailseIndex].endAdress,this.allData.detailList[detailseIndex].rankId,this.allData.detailList[detailseIndex].startTime,detailseIndex)
				}
			},
			//交通工具
			transportChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id;
				this.$set(this.allData.detailList[detailseIndex],'transport',this.transportValue[index]); //出发交通工具
				this.$set(this.allData.detailList[detailseIndex],'transportIndex',index); //出发交通工具
			},
			//开始时间
			startTimeChange:function(e){
				let index=e.target.id; 
				this.$set(this.allData.detailList[index],'startTime',e.target.value);
				let starths=new Date(e.target.value).getTime();
				let endhs=0;
				if(this.allData.detailList[index].endTime){
					endhs=new Date(this.allData.detailList[index].endTime).getTime();
				}
				if(endhs>0){
					if(starths>endhs){
						this.$set(this.allData.detailList[index],'endTime','');
						uni.showToast({title: '结束时间需大于开始时间',duration:2000,icon:'none',});
					}
					this.timeChange(this.allData.detailList[index],index)
				}
				if(this.allData.detailList[index].endAdress && this.allData.detailList[index].rankId && this.allData.detailList[index].startTime){
				  this.getSubsidy(this.allData.detailList[index].endAdress,this.allData.detailList[index].rankId,this.allData.detailList[index].startTime,index)
				}
			},
			//结束时间修改
			endTimeChange:function(e){
				let index=e.target.id; 
				let endhs=new Date(e.target.value).getTime();
				let starths=0;
				if(this.allData.detailList[index].startTime){
					starths=new Date(this.allData.detailList[index].startTime).getTime();
				}
				if(starths>endhs){
					this.$set(this.allData.detailList[index],'endTime','');
					uni.showToast({title: '结束时间需大于开始时间',duration:2000,icon:'none',});
				}else{
					this.$set(this.allData.detailList[index],'endTime',e.target.value);
				}
				this.timeChange(this.allData.detailList[index],index);
			},
			//时间修改(计算出差天数)
			timeChange:function(row,index){
			  if(row.startTime && row.endTime){
				let days=Utils.DateDiff(row.startTime,row.endTime)*1+1;
				this.$set(this.allData.detailList[index],'busiDays',days);
				this.$set(this.allData.detailList[index],'subsidiesDays',days);
				this.getBtie(row,index)
				let vdays=Utils.accAdd(row.vacationDays*1,row.visitDays*1);
				if(vdays>row.busiDays*1){
				  row.vacationDays=0;
				  row.visitDays=0;
				}
				this.getDateList();
			  }
			},
			//计算出差天数
			getDateList:function(type){
				if(type==undefined || type==null){
					type=0
				}
				let datePromise=new Promise((resolve,reject)=>{
					var datas =this.allData.detailList;
					if(datas.length==0){
						this.dateArray={};
						resolve(this.dateArray)
					}else if(datas.length==1){
						this.dateArray={};
						if(datas[0].startTime && datas[0].endTime){
							let nametext=datas[0].businessmanid; //出差申请人
							let keyname = ""; //定义属性名
							let datastring=Utils.getAll(datas[0].startTime,datas[0].endTime);
							this.$set(this.allData.detailList[0],"busiDays",datastring.length);  //出差天数
							this.$set(this.allData.detailList[0],"subsidiesDays",datastring.length);  //补贴天数
							let staySubsidies=Utils.numMulti(this.allData.detailList[0].busiDays*1,this.allData.detailList[0].staysubsidy*1); //住宿费用
							this.$set(this.allData.detailList[0],"staySubsidies",Utils.fmtMoney(staySubsidies,2));  //住宿费用
							let transSubsidies=Utils.numMulti(this.allData.detailList[0].subsidiesDays*1,this.allData.detailList[0].trafficsubsidy*1); //交通补贴  
							this.$set(this.allData.detailList[0],"transSubsidies",Utils.fmtMoney(transSubsidies,2));  //交通补贴
							let eatSubsidies=Utils.numMulti(this.allData.detailList[0].subsidiesDays*1,this.allData.detailList[0].mealsubsidy*1); //伙食补贴  
							this.$set(this.allData.detailList[0],"eatSubsidies",Utils.fmtMoney(eatSubsidies,2));  //伙食补贴
							if(nametext==='' || nametext==null || nametext==undefined){
								keyname='---'
							}else{
								keyname=nametext;
							}
							this.dateArray[keyname]=datastring;
							this.amountSumTotal()
						}
						resolve(this.dateArray)
					}else{
						this.dateArray={};
						for(var i=0;i<datas.length;i++){
							let nametext=datas[i].businessmanid; //出差申请人
							let keyname = ""; //定义属性名
							if(i<type){
								if(datas[i].startTime && datas[i].endTime){
									let datastring=Utils.getAll(datas[i].startTime,datas[i].endTime);
									if(nametext==='' || nametext==null || nametext==undefined){
										keyname='---';
									}else{
										keyname=nametext;
									}
									if(this.dateArray[keyname]=='' || this.dateArray[keyname]==undefined || this.dateArray[keyname]==null){
										this.dateArray[keyname]=[]
									}
									this.dateArray[keyname]=this.dateArray[keyname].concat(datastring);
								}
							}else if(i>=type){
								let newArray=[]; //存放可以出差的日期
								if(datas[i].startTime && datas[i].endTime){
									let datastring=Utils.getAll(datas[i].startTime,datas[i].endTime);
									if(nametext==='' || nametext==null || nametext==undefined){
										keyname='---';
									}else{
										keyname=nametext;
									}
									if(this.dateArray[keyname]=='' || this.dateArray[keyname]==undefined || this.dateArray[keyname]==null){
										this.dateArray[keyname]=[];
									}
									let dataArray=[];
									for(var t=0;t<datastring.length;t++){
										if(datastring[t]){
											if(this.dateArray[keyname].indexOf(datastring[t])==-1){
												newArray.push(datastring[t]);
												this.dateArray[keyname].push(datastring[t])
											}
										}
									}
									this.$set(this.allData.detailList[i],"busiDays",newArray.length);  //出差天数
									this.$set(this.allData.detailList[i],"subsidiesDays",newArray.length);  //补贴天数
									let staySubsidies=Utils.numMulti(this.allData.detailList[i].busiDays*1,this.allData.detailList[i].staysubsidy*1); //住宿费用
									this.$set(this.allData.detailList[i],"staySubsidies",Utils.fmtMoney(staySubsidies,2));  //住宿费用
									let transSubsidies=Utils.numMulti(this.allData.detailList[i].subsidiesDays*1,this.allData.detailList[i].trafficsubsidy*1); //交通补贴  
									this.$set(this.allData.detailList[i],"transSubsidies",Utils.fmtMoney(transSubsidies,2));  //交通补贴
									let eatSubsidies=Utils.numMulti(this.allData.detailList[i].subsidiesDays*1,this.allData.detailList[i].mealsubsidy*1); //伙食补贴  
									this.$set(this.allData.detailList[i],"eatSubsidies",Utils.fmtMoney(eatSubsidies,2));  //伙食补贴
									this.amountSumTotal()
								}
							}
						}
					}
					
				})
				return datePromise;
			},
			//出差天数修改
			busiDaysChange:function(value,index,row){ 
				let valuetext=Utils.yzNumber(value);
				if(row.startTime && row.endTime){
					let days=Utils.DateDiff(row.startTime,row.endTime)*1+1;
					if(valuetext>days){
						uni.showToast({title: '出差天数不得大于终止日期-起始日期+1',duration: 2000,icon:'none',});
						this.$set(this.allData.detailList[index],'busiDays',days);
						this.$set(this.allData.detailList[index],'subsidiesDays',days);
					}else{
						this.$set(this.allData.detailList[index],'busiDays',valuetext);
						this.$set(this.allData.detailList[index],'subsidiesDays',valuetext);
					}
				}else{
					uni.showToast({title: '请填写起始时间和终止时间',duration: 2000,icon:'none',});
					this.$set(this.allData.detailList[index],'busiDays','');
					this.$set(this.allData.detailList[index],'subsidiesDays','');
				}
				this.getBtie(row,index)
				let vdays=Utils.accAdd(row.vacationDays*1,row.visitDays*1);
				if(vdays>row.busiDays*1){
					row.vacationDays=0;
					row.visitDays=0;
				}
			},
			//补贴天数修改
			subsidiesDaysChange:function(value,index,row){
			  if(row.busiDays==='' || row.busiDays==null || row.busiDays==undefined){
				uni.showToast({title: '请填写出差天数',duration: 2000,icon:'none',});
				this.$set(this.allData.detailList[index],'subsidiesDays','');
				this.$set(this.allData.detailList[index],'eatSubsidies',''); //伙食补贴
				this.$set(this.allData.detailList[index],'transSubsidies',''); //交通补贴
				this.$set(this.allData.detailList[index],'staySubsidies',''); //住宿费用
			  }else{
				if(row.busiDays<value){
				  uni.showToast({title: '补贴天数不可大于出差天数',duration: 2000,icon:'none',});
				  this.$set(this.allData.detailList[index],'subsidiesDays','');
				  this.$set(this.allData.detailList[index],'eatSubsidies',''); //伙食补贴
				  this.$set(this.allData.detailList[index],'transSubsidies',''); //交通补贴
				  this.$set(this.allData.detailList[index],'staySubsidies',''); //住宿费用
				}else{
				  this.getBtie(row,index)
				}
			  }
			},
			//获取标准
			//id:到达地点
			getSubsidy:function(id,rankId,month,index){
			  let _this=this;
			  var axpromis=new Promise((resolve, rej)=>{
				let params={
					id:id,
					rankid:rankId,
					arrivetime:month,
				}
				_this.$http.GET(`/datas/travelsubsidystandard/getBusySeason`,params).then((res) => {
				  let datacode=res.data;
				  if(datacode.code==0){
					if(datacode.data.length>0){
					  this.$set(this.allData.detailList[index],'mealsubsidy',datacode.data[0].mealsubsidy); //伙食费标准
					  this.$set(this.allData.detailList[index],'staysubsidy',datacode.data[0].staysubsidy); //住宿费标准
					  this.$set(this.allData.detailList[index],'trafficsubsidy',datacode.data[0].trafficsubsidy); //交通费标准
					  if(this.allData.detailList[index].subsidiesDays!='' || this.allData.detailList[index].subsidiesDays!=undefined 
					  || this.allData.detailList[index].subsidiesDays!=null){
						let eatSubsidiestext=Utils.numMulti(this.allData.detailList[index].mealsubsidy,this.allData.detailList[index].subsidiesDays); //伙食补贴
						let transSubsidiestext=Utils.numMulti(this.allData.detailList[index].trafficsubsidy,this.allData.detailList[index].subsidiesDays); //交通补贴
						let staySubsidiestext=Utils.numMulti(this.allData.detailList[index].staysubsidy,this.allData.detailList[index].busiDays); //住宿费用
						this.$set(this.allData.detailList[index],'eatSubsidies',Utils.fmtMoney(eatSubsidiestext,2)); //伙食补贴
						this.$set(this.allData.detailList[index],'transSubsidies',Utils.fmtMoney(transSubsidiestext,2)); //交通补贴
						this.$set(this.allData.detailList[index],'staySubsidies',Utils.fmtMoney(staySubsidiestext,2)); //住宿费用
					  }
					}else{
					  this.$set(this.allData.detailList[index],'mealsubsidy',''); //伙食费标准
					  this.$set(this.allData.detailList[index],'staysubsidy',''); //住宿费标准
					  this.$set(this.allData.detailList[index],'trafficsubsidy',''); //交通费标准
					  this.$set(this.allData.detailList[index],'eatSubsidies',''); //伙食补贴
					  this.$set(this.allData.detailList[index],'transSubsidies',''); //交通补贴
					  this.$set(this.allData.detailList[index],'staySubsidies',''); //住宿费用
					}
					this.jsSubtotal(this.allData.detailList[index],index);
					resolve(datacode.data)
				  }
				})
			  });
			  return axpromis
			},
			//计算补贴金额
			getBtie:function(row,index){
			  let axpromis=new Promise((resolve, rej)=>{
				if(row.mealsubsidy!='' || row.mealsubsidy!=null || row.mealsubsidy!=undefined){
				  if(row.staysubsidy!='' || row.staysubsidy!=null || row.staysubsidy!=undefined){
					if(row.trafficsubsidy!='' || row.trafficsubsidy!=null || row.trafficsubsidy!=undefined){
					  let eatSubsidiestext=Utils.numMulti(this.allData.detailList[index].mealsubsidy,this.allData.detailList[index].subsidiesDays); //伙食补贴
					  let transSubsidiestext=Utils.numMulti(this.allData.detailList[index].trafficsubsidy,this.allData.detailList[index].subsidiesDays); //交通补贴
					  let staySubsidiestext=Utils.numMulti(this.allData.detailList[index].staysubsidy,this.allData.detailList[index].busiDays); //住宿费用
					  this.$set(this.allData.detailList[index],'eatSubsidies',Utils.fmtMoney(eatSubsidiestext,2)); //伙食补贴
					  this.$set(this.allData.detailList[index],'transSubsidies',Utils.fmtMoney(transSubsidiestext,2)); //交通补贴
					  this.$set(this.allData.detailList[index],'staySubsidies',Utils.fmtMoney(staySubsidiestext,2)); //住宿费用
					  this.amountSumTotal();
					  let moneyArray=[];
					  moneyArray.push(eatSubsidiestext)
					  moneyArray.push(transSubsidiestext)
					  moneyArray.push(staySubsidiestext)
					  this.jsSubtotal(row,index)
					  resolve(moneyArray)
					}
				  }
				}
			  })
			  return axpromis
			},
			//休假天数、探亲天数修改 vacationDays:休假天数； visitDays：探亲天数
			vacationAndVisitChange:function(row,index,name){
			  let days=row.busiDays; //出差天数
			  if(days>0){
				let text=Utils.yzNumber(row[name]);
				if(text==='' || text==undefined || text==null){
				  row[name]=0;
				}else{
				  row[name]=text;
				}
				let vdays=Utils.accAdd(row.vacationDays*1,row.visitDays*1);
				if(vdays>days){
				  uni.showToast({title: '休假天数+探亲天数不可大于出差天数',duration: 2000,icon:'none',});
				  row.vacationDays=0;
				  row.visitDays=0;
				}
			  }else{
				uni.showToast({title: '请填写出差天数',duration: 2000,icon:'none',});
				row.vacationDays=0;
				row.visitDays=0;
			  }
			},
			//计算当前行的小计
			jsSubtotal:function(row,index){
			  let sum1=Utils.accAdd(Utils.delcommafy(row.cityTransamount),Utils.delcommafy(row.staySubsidies)); //城市间交通费+住宿费用
			  let sum2=Utils.accAdd(Utils.delcommafy(row.transSubsidies),Utils.delcommafy(row.eatSubsidies)); //交通补贴+伙食补贴
			  let sum3=Utils.accAdd(sum1,Utils.delcommafy(row.otherAmount)); //城市间交通费+住宿费用+其他费用金额
			  let sum4=Utils.accAdd(sum3,sum2); //城市间交通费+住宿费用+其他费用金额+交通补贴+伙食补贴
			  this.$set(this.allData.detailList[index],'subtotal',Utils.fmtMoney(sum4,2));
			  this.amountSumTotal()
			},
			// 金额失去焦点格式化金额
			moneyFormatter:function(value,index, name) {
				let _this = this;
				let tableData = [];
				tableData = this.allData.detailList;
				let row=this.allData.detailList[index];
				let moneyState=Utils.fmtMoney(row[name],2)
				if(moneyState=='NaN'){
					uni.showToast({title: '请输入正确金额',duration: 2000,icon:'none',});
					_this.$set(tableData[index], name,'');
				}else{
				if (row[name] === "" || row[name] == undefined || row[name] == null) {
				  _this.$set(tableData[index], name, '');
				} else {
					if(name=='staySubsidies'){ //住宿费用
						if(row.staysubsidy==='' || row.staysubsidy==undefined || row.staysubsidy==null){
						  uni.showToast({title: '请先获取住宿费标准',duration: 2000,icon:'none',});
						  _this.$set(tableData[index], name, '');
						  this.jsSubtotal(row,index)
						  this.amountSumTotal()
						  return false
						}else{
							let maxStaySubsidies=Utils.numMulti(row.busiDays*1,row.staysubsidy); //最大住宿费用
							if(Utils.delcommafy(moneyState)>maxStaySubsidies){
								uni.showToast({title: '住宿费用不可大于【出差天数*住宿费标准】',duration: 2000,icon:'none',});
								_this.$set(tableData[index],name,Utils.fmtMoney(maxStaySubsidies,2));
								this.jsSubtotal(row,index)
								this.amountSumTotal()
								return false
							}
						}
					}
					if(name=='transSubsidies'){ //交通补贴
						if(row.trafficsubsidy==='' || row.trafficsubsidy==undefined || row.trafficsubsidy==null){
						  uni.showToast({title: '请先获取交通费标准',duration: 2000,icon:'none',});
						  _this.$set(tableData[index], name, '');
						  this.jsSubtotal(row,index)
						  this.amountSumTotal()
						  return false
						}else{
						  let maxRransSubsidies=Utils.numMulti(row.subsidiesDays*1,row.trafficsubsidy); //最大交通补贴
						  if(Utils.delcommafy(moneyState)>maxRransSubsidies){
							uni.showToast({title: '交通补贴不可大于【补贴天数*交通费标准】',duration: 2000,icon:'none',});
							_this.$set(tableData[index],name,Utils.fmtMoney(maxRransSubsidies,2));
							this.jsSubtotal(row,index)
							this.amountSumTotal()
							return false
						  }
						}
					}
					if(name=='eatSubsidies'){ //伙食补贴
						if(row.mealsubsidy==='' || row.mealsubsidy==undefined || row.mealsubsidy==null){
						  uni.showToast({title: '请先获取伙食费标准',duration: 2000,icon:'none',});
						  _this.$set(tableData[index], name, '');
						  this.jsSubtotal(row,index)
						  this.amountSumTotal()
						  return false
						}else{
						  let maxEatSubsidies=Utils.numMulti(row.subsidiesDays*1,row.mealsubsidy); //伙食补贴
						  if(Utils.delcommafy(moneyState)>maxEatSubsidies){
							uni.showToast({title: '伙食补贴不可大于【补贴天数*伙食费标准】',duration: 2000,icon:'none',});
							_this.$set(tableData[index],name,Utils.fmtMoney(maxEatSubsidies,2));
							this.jsSubtotal(row,index)
							this.amountSumTotal()
							return false
						  }
						}
						}
					  _this.$set(tableData[index],name,moneyState);
					}
				}
				this.jsSubtotal(row,index)
				this.amountSumTotal()
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
					//城市交通费
					if (tableDatas.detailList[i].cityTransamount === '' || tableDatas.detailList[i].cityTransamount == null 
					|| tableDatas.detailList[i].cityTransamount == undefined) {
						tableDatas.detailList[i].cityTransamount = '';
					} else {
						tableDatas.detailList[i].cityTransamount = Utils.delcommafy(tableDatas.detailList[i].cityTransamount); 
					}
					//住宿费用
					if (tableDatas.detailList[i].staySubsidies === '' || tableDatas.detailList[i].staySubsidies == null 
					|| tableDatas.detailList[i].staySubsidies == undefined) {
						tableDatas.detailList[i].staySubsidies = '';
					} else {
						tableDatas.detailList[i].staySubsidies = Utils.delcommafy(tableDatas.detailList[i].staySubsidies); 
					}
					//交通补贴
					if (tableDatas.detailList[i].transSubsidies === '' || tableDatas.detailList[i].transSubsidies == null 
					|| tableDatas.detailList[i].transSubsidies == undefined) {
						tableDatas.detailList[i].transSubsidies = '';
					} else {
						tableDatas.detailList[i].transSubsidies = Utils.delcommafy(tableDatas.detailList[i].transSubsidies); 
					}
					//伙食补贴
					if (tableDatas.detailList[i].eatSubsidies === '' || tableDatas.detailList[i].eatSubsidies == null 
					|| tableDatas.detailList[i].eatSubsidies == undefined) {
						tableDatas.detailList[i].eatSubsidies = '';
					} else {
						tableDatas.detailList[i].eatSubsidies = Utils.delcommafy(tableDatas.detailList[i].eatSubsidies); 
					}
					//其他费用金额
					if (tableDatas.detailList[i].otherAmount === '' || tableDatas.detailList[i].otherAmount == null 
					|| tableDatas.detailList[i].otherAmount == undefined) {
						tableDatas.detailList[i].otherAmount = '';
					} else {
						tableDatas.detailList[i].otherAmount = Utils.delcommafy(tableDatas.detailList[i].otherAmount); 
					}
					//小计
					if (tableDatas.detailList[i].subtotal === '' || tableDatas.detailList[i].subtotal == null 
					|| tableDatas.detailList[i].subtotal == undefined) {
						tableDatas.detailList[i].subtotal = '';
					} else {
						tableDatas.detailList[i].subtotal = Utils.delcommafy(tableDatas.detailList[i].subtotal); 
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
