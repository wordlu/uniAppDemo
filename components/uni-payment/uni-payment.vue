<!-- 穆文元 -->
<template>
	<!-- 支付信息 -->
	<view class="peojectName">
		<view  v-for="(item,index) in detailList" class='detailList_list'>
			<view class='detailList_title'>
				<view class="listtitle_left">
					<view v-if='item.payMethodIndex==="" || item.payMethodIndex==undefined || item.payMethodIndex==null'>支付信息{{index+1}}</view>
					<view v-else>支付信息{{index+1}}:{{payMethodLabel[item.payMethodIndex]}}</view>
				</view>
				<view class="listtitle_right">
					<text v-if='item.paymentSum'>￥{{item.paymentSum}}</text>
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
					<view class="smallItemBoxTitle">支付信息</view>
					<view class="smallItemBoxContent">
						<view class="itemBox">
							<text class="leftMsg">支付方式</text>
							<view class="rightMsg">
								<picker :value="item.payMethodIndex" :range="payMethodLabel" :disabled='!isWrite'  @change="payMethodSelectMethod" :id='index'>
									<view class="uni-input">{{payMethodLabel[item.payMethodIndex]}}</view>
								</picker>
							</view>
						</view>
						<view class="itemBox">
							<text class="leftMsg">付款类别</text>
							<view class="rightMsg">
								<picker :value="item.paymethodChildIndex" :range="item.paymethodChildLabel" :disabled='!isWrite' :id='index'  @change="paymethodChildSelect">
									<view class="uni-input" v-if='item.paymethodChildLabel && item.paymethodChildLabel.length>0'>
										{{item.paymethodChildLabel[item.paymethodChildIndex]}}
									</view> 
									<view class="uni-input" v-else style="width: 100%;height: 100%;"></view> 
								</picker>
							</view>
						</view>
						<view class="itemBox">
							<text class="leftMsg">收款人/单位</text>
							<input class="uni-input rightMsg" name="input" v-model="item.payeename" disabled/>
							<text style="margin-right: 3px;font-size: 24px;" v-if='isWrite'  @click="selectPage(index)">&gt;</text>
						</view>
						<view class="itemBox">
							<text class="leftMsg">具体开户行名称</text>
							<input class="uni-input rightMsg" name="input" v-model="item.bankname" :disabled='!isWrite'/>
						</view>
						<view class="itemBox">
							<text class="leftMsg">银行账号</text>
							<input class="uni-input rightMsg" name="input" v-model="item.banknumber" :disabled='!isWrite'/>
						</view>
						<view class="itemBox">
							<text class="leftMsg">金额</text>
							<input class="uni-input rightMsg" name="input" v-model="item.paymentSum" @focus="moneys(item.paymentSum,index,'paymentSum')"
							 @blur="moneyFormatter(item.paymentSum,index,'paymentSum')" :disabled='!isWrite'/>
						</view>
						<view class="itemBox">
							<text class="leftMsg">公务卡刷卡日期</text>
							<picker mode="date" v-model="item.swipeCardDate" :id="index" :disabled='!isWrite'  @change="swipeCardDateChange">
								<view class="uni-input">{{item.swipeCardDate}}</view>
							</picker>
						</view>
						<view class="itemBox">
							<text class="leftMsg">支付代码</text>
							<input class="uni-input rightMsg" name="input" v-model="item.payCode" disabled/>
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
		<!-- 收款人/单位 -->
		<uni-people v-if='peopleState'  @closeIframe="closeIframe" @iframeContent='iframePeopleContent'></uni-people>
	</view>
</template>

<script>
	import Utils from "../../utils/utils.js"
	export default{
		props:['billTypep','connectdata','isWritep','first'],
		data() {
			return {
				detailList:[], //单据明细
				isWrite:true, //控制是否可以编辑
				payMethodLabel:[], //支付方式
				payMethodValue:[], //支付方式
				requiserState:false,
				clickIndex:0,
				watchFirst:1,
				payMethodTypeData:[],
				peopleState:false, //收款人/单位
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
							this.$set(this.detailList[i],"payMethodIndex",'');
							//支付金额
							if (this.detailList[i].paymentSum === '' || this.detailList[i].paymentSum == null || this.detailList[i].paymentSum == undefined) {
								this.detailList[i].paymentSum = '';
							} else {
								this.detailList[i].paymentSum = Utils.fmtMoney(this.detailList[i].paymentSum, 2); 
							}
							//------------------
							this.$set(this.detailList[i],'payMethodIndex','');
							this.$set(this.detailList[i],'paymethodChildLabel',[])
							this.$set(this.detailList[i],'paymethodChildValue',[])
							this.$set(this.detailList[i],'paymethodChildIndex','')
							//支付方式
							if(this.detailList[i].payMethod){
								let payMethodindex=this.payMethodValue.indexOf(this.detailList[i].payMethod);
								this.$set(this.detailList[i],'payMethodIndex',payMethodindex);
								let typeObj=[]; //支付方式集合
								let payType=[];
								if(this.payMethodTypeData){
									if(this.payMethodTypeData[this.detailList[i].payMethod].length>0){
										payType=this.payMethodTypeData[this.detailList[i].payMethod].split('-'); //获取付款类别集合
									}	
								}
								if(payType.length>0){
									for(var j=0;j<payType.length;j++){
									  typeObj[j]=[];
									  typeObj[j]=payType[j].split(',')
									}
									this.$set(this.detailList[i],'paymethodChildLabel',[])
									this.$set(this.detailList[i],'paymethodChildValue',[])
									let labelArray=[];
									let valueArray=[]
									for(var t=0;t<payType.length;t++){
										labelArray.push(typeObj[t][0]);
										valueArray.push(typeObj[t][0]);
									}
									this.$set(this.detailList[i],'paymethodChildLabel',labelArray);
									this.$set(this.detailList[i],'paymethodChildValue',valueArray);
									if(this.detailList[i].paymethodChild){
										let paymethodChildIndex=valueArray.indexOf(this.detailList[i].paymethodChild);
										this.$set(this.detailList[i],'paymethodChildIndex',paymethodChildIndex);
									}else{
										this.$set(this.detailList[i],'paymethodChildIndex','');
									}
								}else{
									this.$set(this.detailList[i],'paymethodChildIndex','');
								}
							}else{
								this.$set(this.detailList[i],'payMethodIndex','');
								this.$set(this.detailList[i],'paymethodChildLabel',[])
								this.$set(this.detailList[i],'paymethodChildValue',[])
								this.$set(this.detailList[i],'paymethodChildIndex','')
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
			this.payMethodType().then((res)=>{
				if(this.detailList.length>0){
					for(let i=0;i<this.detailList.length;i++){
						this.$set(this.detailList[i],'payMethodIndex','');
						this.$set(this.detailList[i],'paymethodChildLabel',[])
						this.$set(this.detailList[i],'paymethodChildValue',[])
						this.$set(this.detailList[i],'paymethodChildIndex','')
						//支付方式
						if(this.detailList[i].payMethod){
							let payMethodindex=this.payMethodValue.indexOf(this.detailList[i].payMethod);
							this.$set(this.detailList[i],'payMethodIndex',payMethodindex);
							let typeObj=[]; //支付方式集合
							let payType=this.payMethodTypeData[this.detailList[i].payMethod].split('-'); //获取付款类别集合
							if(payType.length>0){
								for(var j=0;j<payType.length;j++){
								  typeObj[j]=[];
								  typeObj[j]=payType[j].split(',')
								}
								this.$set(this.detailList[i],'paymethodChildLabel',[])
								this.$set(this.detailList[i],'paymethodChildValue',[])
								let labelArray=[];
								let valueArray=[]
								for(var t=0;t<payType.length;t++){
									labelArray.push(typeObj[t][0]);
									valueArray.push(typeObj[t][0]);
								}
								this.$set(this.detailList[i],'paymethodChildLabel',labelArray);
								this.$set(this.detailList[i],'paymethodChildValue',valueArray);
								if(this.detailList[i].paymethodChild){
									let paymethodChildIndex=valueArray.indexOf(this.detailList[i].paymethodChild);
									this.$set(this.detailList[i],'paymethodChildIndex',paymethodChildIndex);
								}else{
									this.$set(this.detailList[i],'paymethodChildIndex','');
								}
							}else{
								this.$set(this.detailList[i],'paymethodChildIndex','');
							}
						}else{
							this.$set(this.detailList[i],'payMethodIndex','');
							this.$set(this.detailList[i],'paymethodChildLabel',[])
							this.$set(this.detailList[i],'paymethodChildValue',[])
							this.$set(this.detailList[i],'paymethodChildIndex','')
						}
					}
					this.$forceUpdate()
				}
			})
		},
		methods:{
			//增加明细
			addDetailList:function(){
			 	let text={
			 		"bankid": "", //银行id
					"bankname": "", //具体开户行
					"banknumber": "", //收款人/单位银行账号
					"check": "", //
					"id": "", //
					"isAudit": "", //
					"mainId": "", //主表id
					"memo": "", //备注
					"payCode": "", //支付代码
					"payMethod": "", //支付方式
					"payeeid": "", //收款人/单位ID
					"payeename": "", //收款人/单位
					"paymentSum": "", //支付金额
					"paymethodChild": "", //付款类别
					"swipeCardDate": "",//公务刷卡日期
					"paymethodChildLabel":[], //付款类别下拉值
					"paymethodChildValue":[], //付款类别下拉值
					'paymethodChildIndex':'', //付款类别下拉索引值
					"cardEdit":'true', //控制具体开户行名称是否可以输入 true为可输入；false不可输入
					"cardmust":'0', //银行卡信息是否必填 1为必填；0为非必填
					"travelId":'',
					"payMethodIndex":'',
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
			//获取支付方式和付款类别的对照关系
			payMethodType:function(){
			  var axpromis=new Promise((resolve, rej)=>{
				this.$http.GET('/reimburse/reimBusiverifyBusi/getZFDict').then((res) => {
				  if(res.data.code==0){
					this.payMethodTypeData=Utils.deepClone(res.data.data)
					let dataObj=res.data.data;
					let dataObjKey=Object.keys(dataObj)
					this.payMethodLabel=dataObjKey //支付方式
					this.payMethodValue=dataObjKey //支付方式
					resolve()
				  }
				})
			  });
			  return axpromis
			},
			//支付方式
			payMethodSelectMethod:function(e){
				let index=e.target.id;
				this.$set(this.detailList[index],'payMethodIndex',e.target.value);
				this.$set(this.detailList[index],'payMethod',this.payMethodValue[this.payMethodIndex]);
				let typeObj=[]; //支付方式集合
				let payType=this.payMethodTypeData[this.payMethodValue[this.detailList[index].payMethodIndex]].split('-'); //获取付款类别集合
				if(payType.length>0){
					for(var i=0;i<payType.length;i++){
					  typeObj[i]=[];
					  typeObj[i]=payType[i].split(',')
					}
				}
				if(payType.length>0){
					let labelArray=[];
					let valueArray=[]
					for(var t=0;t<payType.length;t++){
						labelArray.push(typeObj[t][0]);
						valueArray.push(typeObj[t][0]);
					}
					this.$set(this.detailList[index],'paymethodChildLabel',labelArray);
					this.$set(this.detailList[index],'paymethodChildValue',valueArray);
					this.$set(this.detailList[index],'paymethodChildIndex','');
				}
			},
			//付款类别修改
			paymethodChildSelect:function(e){
				let index=e.target.id;
				this.$set(this.detailList[index],'paymethodChildIndex',e.target.value);
				this.$set(this.detailList[index],'paymethodChild',this.paymethodChildValue[this.paymethodChildIndex]);
			},
			//计算合计支付金额
			amountSumTotalmethod:function(){
			  if(this.detailList.length>0){ 
				let sum=0;
				for(var i=0;i<this.detailList.length;i++){
				  sum=Utils.accAdd(sum,Utils.delcommafy(this.detailList[i].paymentSum)*1)
				}
				this.$emit('paymentSumTotals',sum);
			  }else{
				this.paymentSumTotal='';
				this.$emit('paymentSumTotals',sum);
			  }
			},
			//选择收款人/单位
			selectPage:function(index){
				this.clickIndex=index
				this.peopleState=true;
			},
			//收款人/单位返回的内容
			iframePeopleContent:function(data){
				this.$set(this.detailList[this.clickIndex],'payeeid',data.payeeid);
				this.$set(this.detailList[this.clickIndex],'payeename',data.payeename);
				this.$set(this.detailList[this.clickIndex],'bankname',data.bankname);
				this.$set(this.detailList[this.clickIndex],'banknumber',data.banknumber);
				this.$parent.watchPeople='1';
				this.peopleState=false;
			},
			//公务卡刷卡日期修改
			swipeCardDateChange:function(e){
				let index=e.target.id;
				this.$set(this.detailList[index],'swipeCardDate',e.target.value);
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
				this.peopleState=false; //收款人/单位
			},
		}
	}
</script>
<style scoped>
	
</style>
