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
								<text class="leftMsg">申报日期</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.billDate" disabled/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">经办人</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.operatorName" disabled/>
							</view>
							<view class="itemBox">
								<text class="leftMsg">经办人部门</text>
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
								<text class="leftMsg">币种<i class='mustIcon'>*</i></text>
								<view class="rightMsg">
									<picker @change="currencyChange" :value="currencyIndex" :range="currencyLabel" :disabled='!isWrite'>
										<view class="uni-input">{{currencyLabel[currencyIndex]}}</view>
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
								<text class="leftMsg">提供材料</text>
								<input class="uni-input rightMsg" name="input" v-model="allData.provideInformation" :disabled='!isWrite'/>
							</view>					
							<view class="itemBox">
								<text class="leftMsg">说明<i class='mustIcon'>*</i></text>
								<input class="uni-input rightMsg must" data-must='说明' :data-value="allData.reason" name="input" v-model="allData.reason" :disabled='!isWrite'/>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 附件 -->
			<view  v-show="active==1">
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
				billType:'SQSQ',
				urlType:'/reimburse/reimPriorApproval',
				tabArr: ['基本信息','附件'], //导航切换
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
				projectNameLabel:[], //项目名称
				projectNameValue:[], //项目名称
				projectNameIndex:0, // 项目名称索引
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
			//项目名称
			Utils.getTitle('dict_project_code_list').then((res)=>{
			 	this.projectNameLabel=res[0]; 
			 	this.projectNameValue=res[1]; 
			})			
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
					id:this.pageId
					// id:'14abf84752054728b3a4c845a5e00008'
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
						//项目名称
						if(this.allData.projectName){
							let index=this.projectNameLabel.indexOf(this.allData.projectName);
							this.projectNameIndex=index;
						}else{
							this.projectNameIndex=0; 
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
			//项目名称修改
			projectNameChange:function(e){
				this.projectNameIndex=e.target.value;
				this.allData.projectName=this.projectNameLabel[this.projectNameIndex];
				this.allData.projectCode=this.projectNameValue[this.projectNameIndex];
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
