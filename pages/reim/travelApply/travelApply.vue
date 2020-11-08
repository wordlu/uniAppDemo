<template>
	<!-- 出差申请单 -->
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
								<text class="leftMsg">其他事项说明</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.transportcostmemo" :disabled='!isWrite'/>
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
			<!-- 出差明细 -->
			<view  v-show="active==1">
				<view  v-for="(item,index) in allData.detailList" class='detailList_list'>
					<view class='detailList_title'>
						<view class="listtitle_left">
							<view>明细{{index+1}}</view>
						</view>
						<view class="listtitle_right">
							<text style="font-size: 24px;color: #5A96F7;font-weight: bold;width: 31px;display: flex;align-items: center;justify-content: center;" 
							@click="iscontent(index)" :animation="item.animationData"><span>></span></text>
						</view>
					</view>
					<view class='smallItemBox' v-show='item.open'>
						<view class="delateBox" @click="delateItem(index)" v-if='isWrite'>
							<image src="../../../static/img/delate_icon.png" mode="" class="delIcon"></image>
						</view>
						<view class='list_conten' style="width: 100%;">
							<view class="smallItemBoxTitle">出差明细</view>
							<view class="smallItemBoxContent">
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">部门<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.departIndex" :range="departLabel" :disabled='!isWrite'  @change="departChange" :id='index' 
										:data-value='item.departId' data-must='部门' class='must'>
											<view class="uni-input">{{departLabel[item.departIndex]}}</view>
										</picker>
									</view>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">出差申请人<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.businessmanIndex" :range="item.businessmanLabel" :disabled='!isWrite'  @change="businessmanChange" :id='index' 
										:data-value='item.businessmanid' data-must='出差申请人' class='must'>
											<view class="uni-input" v-if='item.businessmanLabel && item.businessmanLabel.length>0'>{{item.businessmanLabel[item.businessmanIndex]}}</view>
											<view class="uni-input" v-else style="display: block;width: 100%;height: 100%;"></view>
										</picker>
									</view>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">职级</text>
									<input class="uni-input rightMsg" name="input" v-model="item.rankName" disabled/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">开始时间<i class='mustIcon'>*</i></text>
									<picker mode="date" v-model="item.startTime" @change="startTimeChange" :id="index"  :data-value='item.startTime' data-must='开始时间' 
									:disabled='!isWrite' class='must'>
										<view class="uni-input">{{item.startTime}}</view>
									</picker>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">结束时间<i class='mustIcon'>*</i></text>
									<picker mode="date" v-model="item.endTime" :id="index"  @change="endTimeChange" :data-value='item.endTime' data-must='结束时间' class='must'
									:disabled='!isWrite'>
										<view class="uni-input">{{item.endTime}}</view>
									</picker>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">天数<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.days" :disabled='!isWrite' :data-value='item.days' data-must='天数' />
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">出差地点(省份-城市)<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.startAdressIndex" :range="startAdressLabel" :disabled='!isWrite'  @change="startAdressChange" :id='index' 
										:data-value='item.startAdress' data-must='出差地点(省份-城市)' class='must'>
											<view class="uni-input">{{startAdressLabel[item.startAdressIndex]}}</view>
										</picker>
									</view>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">出差地点(具体地址)<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.address" :disabled='!isWrite' :data-value='item.address' data-must='出差地点(具体地址)' />
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">住宿标准<i class='mustIcon'>*</i></text>
									<input class="uni-input rightMsg must" name="input" v-model="item.staysubsidy" @focus="moneys(item.staysubsidy,index,'staysubsidy')"
									 @blur="moneyFormatter(item.staysubsidy,index,'staysubsidy')" :disabled='!isWrite' :data-value='item.staysubsidy' data-must='住宿标准'/>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">出发交通工具<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.departureTransportIndex" :range="transportLabel" :disabled='!isWrite'  @change="departureTransportChange" :id='index' 
										:data-value='item.departureTransport' data-must='出发交通工具' class='must'>
											<view class="uni-input">{{transportLabel[item.departureTransportIndex]}}</view>
										</picker>
									</view>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">返回交通工具<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.backTransportIndex" :range="transportLabel" :disabled='!isWrite'  @change="backTransportChange" :id='index' 
										:data-value='item.backTransport' data-must='返回交通工具' class='must'>
											<view class="uni-input">{{transportLabel[item.backTransportIndex]}}</view>
										</picker>
									</view>
								</view>
								<view class="itemBox">
									<text class="leftMsg" style="width: 140px;">是否住宿<i class='mustIcon'>*</i></text>
									<view class="rightMsg">
										<picker :value="item.isAccommodationIndex" :range="isAccommodationLabel" :disabled='!isWrite'  @change="isAccommodationChange" :id='index' 
										:data-value='item.isAccommodation' data-must='是否住宿' class='must'>
											<view class="uni-input">{{isAccommodationLabel[item.isAccommodationIndex]}}</view>
										</picker>
									</view>
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
				billType:'CC',
				urlType:'/reimburse/reimBusiverifyBusi',
				tabArr: ['基本信息', '出差明细', '附件'], //导航切换
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
				departLabel:[], //部门
				departValue:[], //部门
				departCode:[], //部门
				startAdressLabel:[], //出差地点(省份-城市)
				startAdressValue:[], //出差地点(省份-城市)
				transportLabel:[], //出发/返回交通工具
				transportValue:[], //出发/返回交通工具
				isAccommodationLabel:[], //是否
				isAccommodationValue:[], //是否
				businessmanLabel:[], //出差人
				businessmanValue:[], //出差人
				rankLabel:[],
				rankValue:[],
				operatorRankid: '',
				busiverifyNames: '', //当前登陆人信息
				operatortitle: '',
				operatorId: '',
				operatorRank: '',
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
				//部门
				Utils.getTitle('dict_depart').then((res)=>{
					this.departLabel=res[0];
					this.departValue=res[1];
				})
				//出差地点
				Utils.getTitle('dict_travelsubsidy_list').then((res)=>{
					this.startAdressLabel=res[0];
					this.startAdressValue=res[1];
				})
				//出发交通工具
				Utils.getTitle('dict_transport').then((res)=>{
					this.transportLabel=res[0];
					this.transportValue=res[1];
				})
				//是否
				Utils.getTitle('dict_yes_no').then((res)=>{
					this.isAccommodationLabel=res[0];
					this.isAccommodationValue=res[1];
				})
				//职级
				Utils.getTitle('dict_rank_list').then((res)=>{
					this.rankLabel=res[0];
					this.rankValue=res[1];
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
					//id:'75f11f4a1fd04b9c8c43a1e7fe600006'
				}
				this.$http.GET(`${this.urlType}/get`,params).then((res)=>{
					if(res.data.code==0){
						this.allData=res.data.data;
						this.fileList=this.allData.attachmentList;
						this.busiverifyNames = res.data.data.busiverifyNames; //当前登陆人信息
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
						if(this.allData.detailList.length==0){
							if(this.busiverifyNames != '') {
								let rankId =this.busiverifyNames.match(/-(\S*)/)[1];
								let rankIndex=this.rankValue[rankId];
								this.operatorRank =this.rankLabel[rankIndex];
							}
							this.addDetailList()
						}else{
							for(let i=0;i<this.allData.detailList.length;i++){
								//住宿标准
								if (this.allData.detailList[i].staysubsidy === '' || this.allData.detailList[i].staysubsidy == null || this.allData.detailList[i].staysubsidy == undefined) {
									this.allData.detailList[i].staysubsidy = '';
								} else {
									this.allData.detailList[i].staysubsidy = Utils.fmtMoney(this.allData.detailList[i].staysubsidy, 2); 
								}
								//部门
								if(this.allData.detailList[i].departId){
									let index=this.departValue.indexOf(this.allData.detailList[i].departId);
									this.$set(this.allData.detailList[i],'departIndex',index);
								}else{
									this.departIndex=''; 
								}
								//出差地点(省份-城市)
								if(this.allData.detailList[i].startAdress){
									let index=this.startAdressValue.indexOf(this.allData.detailList[i].startAdress);
									this.$set(this.allData.detailList[i],'startAdressIndex',index); 
								}else{
									this.startAdressIndex=''; 
								}
								//出发交通工具
								if(this.allData.detailList[i].departureTransport){
									let index=this.transportValue.indexOf(this.allData.detailList[i].departureTransport);
									this.$set(this.allData.detailList[i],'departureTransportIndex',index);
								}else{
									this.departureTransportIndex=''; 
								}
								//返回交通工具
								if(this.allData.detailList[i].backTransport){
									let index=this.transportValue.indexOf(this.allData.detailList[i].backTransport);
									this.$set(this.allData.detailList[i],'backTransportIndex',index);
								}else{
									this.backTransportIndex=''; 
								}
								//是否住宿
								if(this.allData.detailList[i].isAccommodation){
									let index=this.isAccommodationValue.indexOf(this.allData.detailList[i].isAccommodation);
									this.$set(this.allData.detailList[i],'isAccommodationIndex',index);
								}else{
									this.isAccommodationIndex=''; 
								}
								//出差人下拉
								if(this.allData.detailList[i].departId){
									this.departToBusinessman()
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
			//增加明细
			addDetailList:function(){
				if(this.busiverifyNames != '') {
					this.operatorId = this.busiverifyNames.match(/(\S*):/)[1];//截取':'前面内容作为人员id
					this.operatorRankid = this.busiverifyNames.match(/-(\S*)/)[1];//截取'-'后面内容作为职级id
					let rankIndex=this.rankValue.indexOf(this.operatorRankid);
					this.operatorRank =this.rankLabel[rankIndex];
				}
				let index=this.departValue.indexOf(this.allData.departId); //部门
			 	let text={
					"address": "",//具体地址", 
					"backTransport": "6",//(string)返回交通工具", 
					"backTransportIndex":this.transportValue.indexOf('6'),
					"businessmanid": this.operatorId,//(string)出差申请人id", 
					"businessmanIndex":this.businessmanValue.indexOf(this.operatorId),
					"businessmanname":this.businessmanLabel[this.businessmanValue.indexOf(this.operatorId)], //截取':'前面内容作为人员id,//(string)出差申请人", 
					"days": "",//(integer)天数", 
					"departureTransport": "6",//(string)出发交通工具", 
					"departureTransportIndex":this.transportValue.indexOf('6'),
					"endTime": "",//(string)终止时间", 
					"id": "",//(string)", 
					"isAccommodation": "1",//(string)是否住宿", 
					"isAccommodationIndex":this.isAccommodationValue.indexOf('1'),
					"isAudit": "",//(string)", 
					"mainId": "",//(string)主表id", 
					"startAdress": "",//(string)出差地点", 
					"startTime": "",//(string)起始时间", 
					"staysubsidy": "",//(string)住宿标准",
					"departId": this.allData.departId, //部门id
					"departName": this.departLabel[index], //部门
					"departIndex":index,
					"rankId": this.operatorRankid,//职级id
					"departCode": this.allData.departCode, //部门code
					"rankName": this.operatorRank, //职级名称
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
				//出差人下拉
				if(text.departId){
					this.departToBusinessman()
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
			//部门切换
			departChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id
				this.$set(this.allData.detailList[detailseIndex],'rankId',''); //清空职级id
				this.$set(this.allData.detailList[detailseIndex],'rankName',''); //清空职级名称 
				this.$set(this.allData.detailList[detailseIndex],'businessmanname',''); //清空出差申请人  
				this.$set(this.allData.detailList[detailseIndex],'businessmanid',''); //清空出差申请人  
				this.$set(this.allData.detailList[detailseIndex],'businessmanIndex',''); //清空出差申请人  
				this.$set(this.allData.detailList[detailseIndex],'staysubsidy',''); // 清空住宿标准 
				this.$set(this.allData.detailList[detailseIndex],'startAdress',''); //清空住宿标准;
				this.$set(this.allData.detailList[detailseIndex],'departId',this.departValue[index]); //部门
				this.$set(this.allData.detailList[detailseIndex],'departName',this.departLabel[index]); //部门
				this.$set(this.allData.detailList[detailseIndex],'departIndex',index); ////部门
				//经办部门
				Utils.getDictValue('dict_depart_code_list',this.departLabel[index]).then((res)=>{
					 this.$set(this.allData.detailList[detailseIndex],'departCode',res); //部门
					 this.departToBusinessman()
				});
				this.getDateList()
			},
			//出差申请人修改
			businessmanChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id;
				this.$set(this.allData.detailList[detailseIndex],'businessmanid',this.allData.detailList[detailseIndex].businessmanValue[index]); //部门
				this.$set(this.allData.detailList[detailseIndex],'businessmanname',this.allData.detailList[detailseIndex].businessmanLabel[index]); //部门
				this.$set(this.allData.detailList[detailseIndex],'businessmanIndex',index); //级别
				this.getDateList();
			},
			//出差地点（省份-城市）
			startAdressChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id;
				this.$set(this.allData.detailList[detailseIndex],'startAdress',this.startAdressValue[index]); //部门
				this.$set(this.allData.detailList[detailseIndex],'startAdressIndex',index); //级别
				//this.travelPlace(this.allData.detailList[detailseIndex],index)
			},
			//出发交通工具
			departureTransportChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id;
				this.$set(this.allData.detailList[detailseIndex],'departureTransport',this.transportValue[index]); //出发交通工具
				this.$set(this.allData.detailList[detailseIndex],'departureTransportIndex',index); //出发交通工具
			},
			//返回交通工具
			backTransportChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id;
				this.$set(this.allData.detailList[detailseIndex],'backTransport',this.transportValue[index]); //返回交通工具
				this.$set(this.allData.detailList[detailseIndex],'backTransportIndex',index); //返回交通工具
			},
			//是否住宿
			isAccommodationChange:function(e){
				let index=e.target.value; //选择的第几个值
				let detailseIndex=e.target.id;
				this.$set(this.allData.detailList[detailseIndex],'isAccommodation',this.isAccommodationValue[index]); //返回交通工具
				this.$set(this.allData.detailList[detailseIndex],'isAccommodationIndex',index); //返回交通工具
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
				 this.getDateList();
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
				this.getDateList();
			},
			//选中部门带出出差申请人
			departToBusinessman:function() {
			  let _this = this;
			  let businessmanLabel = [];
			  let businessmanValue = [];
			  let departCode = '';
			  //拼接departcode参数
			  for(let i=0;i<this.allData.detailList.length;i++){
				  if(i == 0) {
				    departCode = this.allData.detailList[i].departCode;
				  } else {
				    departCode += "," +this.allData.detailList[i].departCode
				  }
			  }
			  //请求列表所有对应的数据
			  this.$http.GET('/datas/staff/busiselect?departCode=' +  departCode).then(res => {
				if(res.data.code==0){
				  var datas = res.data.data;
				  datas.forEach(function(data,index) {
					businessmanLabel = [];
					businessmanValue = [];
					_this.rankArr = [];
					for(let item in data) {
						businessmanValue.push(item)
						businessmanLabel.push(data[item].match(/(\S*)-/)[1])
					}
					_this.$set(_this.allData.detailList[index], "businessmanValue", businessmanValue);
					_this.$set(_this.allData.detailList[index], "businessmanLabel", businessmanLabel);
					if(_this.allData.detailList[index].businessmanid){
						let busIndex=businessmanValue.indexOf(_this.allData.detailList[index].businessmanid);
						_this.$set(_this.allData.detailList[index], "businessmanIndex", busIndex);
					}
				  });          
				}
				this.$forceUpdate(); //强制重新渲染页面
			  }).catch(err => {
				return err;
			  });
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
							this.$set(this.allData.detailList[0],"days",datastring.length);  //出差天数
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
									this.$set(this.allData.detailList[i],"days",newArray.length);  //出差天数
								}
							}
						}
					}
				})
				return datePromise;
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
				//出差明细
				for (let i = 0; i < tableDatas.detailList.length; i++) {
					//住宿标准
					if (tableDatas.detailList[i].staysubsidy === "" || tableDatas.detailList[i].staysubsidy == null
					) {
					  tableDatas.detailList[i].staysubsidy = "";
					} else {
					  tableDatas.detailList[i].staysubsidy = Utils.delcommafy(tableDatas.detailList[i].staysubsidy);
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
			//住宿标准：根据出差地点和出差人员级别自动带出住宿标准，带出规则：基础档案-差旅补助标准档案，可修改
			travelPlace:function(row, index) {
			  let _this = this;
			  // this.$http.post('/datas/travelsubsidystandard/page?name='+ row.startAdress + '&rankid='+ row.rankId).then((res) => {
				_this.$http.GET(`datas/travelsubsidystandard/getBusySeason?id=${row.startAdress}&rankid=${row.rankId}&arrivetime=${row.startTime}`)
				.then((res) => {
				if(res.data && res.data.data[0]) {
					this.$set(this.allData.detailList[index],'staysubsidy',res.data.data[0].staysubsidy)
				} else {
					this.$set(this.allData.detailList[index],'staysubsidy',0)
				}
			  })
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
