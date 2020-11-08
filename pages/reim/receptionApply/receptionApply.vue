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
								<view class='itemBoxTextareaTitle'>公务内容<i class='mustIcon'>*</i></view>
								<textarea placeholder="请输入公务内容" v-model="allData.content" class="itemBoxTextarea must" :disabled='!isWrite'
								:data-value='allData.content' data-must='公务内容'/>
							</view>
						</view>
					</view> 
				</view>
			</view>
			<!-- 公务接待明细 -->
			<view  v-show="active==1">
				<view  v-for="(item,index) in allData.detailList" class='detailList_list'>
					<view class='detailList_title'>
						<view class="listtitle_left">
							<view>明细{{index+1}}</view>
						</view>
						<view class="listtitle_right">
							<text v-if='item.estimatedTotalCost'>￥{{item.estimatedTotalCost}}</text>
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
							<view class="smallItemBoxTitle">人员基本信息</view>
							<view class="smallItemBoxContent">
								<view class="itemBox">
									<text class="leftMsg">接待对象<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.username" :disabled='!isWrite' :data-value='item.username' data-must='接待对象'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg">开始时间<i class='mustIcon'>*</i></text>
									<picker mode="date" v-model="item.startTime" @change="startTimeChange" :id="index"  :data-value='item.startTime' data-must='开始时间' 
									:disabled='!isWrite' class='must'>
										<view class="uni-input">{{item.startTime}}</view>
									</picker>
								</view>
								<view class="itemBox">
									<text class="leftMsg">结束时间<i class='mustIcon'>*</i></text>
									<picker mode="date" v-model="item.endTime" :id="index"  @change="endTimeChange" :data-value='item.endTime' data-must='结束时间' class='must'
									:disabled='!isWrite'>
										<view class="uni-input">{{item.endTime}}</view>
									</picker>
								</view>
								<view class="itemBox">
									<text class="leftMsg">负责接待部门<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.receptionDepartIndex" :range="receptionDepartLabel" :disabled='!isWrite'  @change="receptionDepartChange" 
										:id='index' :data-value='item.receptionDepartIndex' data-must='负责接待部门' class='must'>
											<view class="uni-input">{{receptionDepartLabel[item.receptionDepartIndex]}}</view>
										</picker>
									</view>
								</view>
								<view class="itemBox">
									<text class="leftMsg">招待人数<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.peoplenum" :disabled='!isWrite'
									@blur="peoplechange(item.peoplenum,index,'peoplenum')" :data-value='item.peoplenum' data-must='招待人数'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg">陪同人数<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.accompaniedNumber" :disabled='!isWrite' must='陪同人数' 
									@blur="peoplechange(item.accompaniedNumber,index,'accompaniedNumber')" :data-value='item.accompaniedNumber' data-must='陪同人数'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg">就餐人数</text>
									<input class="uni-input rightMsg" name="input" v-model="item.eatingnum" disabled/>
								</view>
								<view class="itemBox">
									<text class="leftMsg">就餐标准<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.eatStandard" @focus="moneys(item.eatStandard,index,'eatStandard')"
									 @blur="moneyFormatter(item.eatStandard,index,'eatStandard')" :disabled='!isWrite' :data-value='item.eatStandard' data-must='就餐标准'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg">预计费用总额</text>
									<input class="uni-input rightMsg" name="input" v-model="item.estimatedTotalCost" disabled/>
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
			<!-- 附件 -->
			<view  v-show="active==2">
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
				<button type="primary" class="tabCenterBtn" @click="save(1)" v-if='active==(tabArr.length*1-1)'>提交</button>
			</view>
		</view>
	</view>
</template>

<script>
	import Utils from "../../../utils/utils.js"
	export default{
		 data(){
			 return{
				billType:'GWJD',
				urlType:'/reimburse/reimReceptionApply',
				tabArr: ['基本信息', '公务接待明细', '附件'], //导航切换
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
				receptionDepartLabel:[], //负责接待部门
				receptionDepartValue:[], //负责接待部门
				//添加动画
				animationData: {},
				fileList:[],//附件列表
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
		 components:{
			 
		 },
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
					//id:'f0bfc6d5ef1e4605863ebf6738b00002'
				}
				this.$http.GET(`${this.urlType}/get`,params).then((res)=>{
					if(res.data.code==0){
						this.allData=res.data.data;
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
								//预计费用总额
								if (this.allData.detailList[i].estimatedTotalCost === "" || this.allData.detailList[i].estimatedTotalCost == null
								) {
								  this.allData.detailList[i].estimatedTotalCost = "";
								} else {
								  this.allData.detailList[i].estimatedTotalCost = Utils.fmtMoney(this.allData.detailList[i].estimatedTotalCost, 2); 
								}
								//负责接待部门
								if(this.allData.detailList[i].receptionDepart){
									let index=this.receptionDepartValue.indexOf(this.allData.detailList[i].receptionDepart);
									this.$set(this.allData.detailList[i],'receptionDepartIndex',index); //级别
								}else{
									this.receptionDepartIndex=0; 
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
				let index=this.receptionDepartValue.indexOf(this.allData.departId);
			 	let text={
			 		"accompaniedNumber": "",// 陪同人数
					"check": "", //
					"eatStandard": "", //就餐标准
					"eatingnum": "", //就餐人数
					"endTime": "", //结束时间
					"estimatedTotalCost": "", //预计费用总额
					"id": "", //
					"isAudit": "", //
					"mainId": "", //主表id
					"peoplenum": "", //招待人数
					"receptionDepart":this.allData.departId, //接待部门
					"startTime": "", //开始时间
					"username": "",//接待对象
					"memo":"", //备注
					"receptionDepartIndex":index,
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
				if(name=='eatStandard'){ //如果是就餐标准，计算总额
				  this.estimatedTotal(index)
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
				//附件
				cloneArray.attachmentList =this.$refs.attachmentData.attachData;
				tableDatas =Utils.deepClone(cloneArray);
				  //公务接待申请单详情
				  for (let i = 0; i < tableDatas.detailList.length; i++) {
					//就餐标准
					if (tableDatas.detailList[i].eatStandard === "" || tableDatas.detailList[i].eatStandard == null
					) {
					  tableDatas.detailList[i].eatStandard = "";
					} else {
					  tableDatas.detailList[i].eatStandard = Utils.delcommafy(tableDatas.detailList[i].eatStandard);
					}
					//预计费用总额
					if (tableDatas.detailList[i].estimatedTotalCost === "" || tableDatas.detailList[i].estimatedTotalCost == null
					) {
					  tableDatas.detailList[i].estimatedTotalCost = "";
					} else {
					  tableDatas.detailList[i].estimatedTotalCost = Utils.delcommafy(tableDatas.detailList[i].estimatedTotalCost);
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
