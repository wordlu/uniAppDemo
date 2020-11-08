<template>
	<view class="container">
		<!-- 顶部轮播图 -->
		<view class="swiperBox">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" indicator-active-color="#5293fb" indicator-color="rgba(4, 4, 4, .3)	">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<view class="swiper-item" >
						<image :src="item" mode="widthFix"></image>
					</view>
				</swiper-item>
				
			</swiper>			
		</view>
		<view class="mainBox">
			<!-- 常用功能 -->
			<!-- <view class="commonBox">
				<view class="titleBox">
					<view class="">
						<image src="../../static/img/nav_icon.png" mode="widthFix" class="iconImg"></image>
						<text class="title">常用功能</text>
					</view>
				</view>
				<view class="itemBox">
					<view class="item" @click="goApproval">
						<view class="item_img">
							<image src="../../static/img/audit.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>票据扫描</text>
						</view>
					</view>
					<view class="item" @click="goInvoiceManage">
						<view class="item_img">
							<image src="../../static/img/bill.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>我的票夹</text>
						</view>
					</view>
					
					<view class="item" @click="goFileUpload">
						<view class="item_img">
							<image src="../../static/img/FJSC.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>我的单据</text>
						</view>
					</view>
				</view>
			</view> -->
			<!-- 审批任务 -->
			<view class="commonBox">
				<view class="titleBox">
					<view class="">
						<image src="../../static/img/nav_icon.png" mode="widthFix" class="iconImg"></image>
						<text class="title">审批任务</text>
					</view>
				</view>
				<view class="itemBox">
					<!-- 审批 -->
					<view class="item" @click="goApproval(1)">
						<view class="item_img">
							<image src="../../static/img/audit.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>待审批</text>
						</view>
					</view>
					
					<view class="item" @click="goApproval(2)">
						<view class="item_img">
							<image src="../../static/img/bill.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>已审批</text>
						</view>
					</view>
					
					<view class="item" @click="goApproval(3)">
						<view class="item_img">
							<image src="../../static/img/FJSC.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>已退回</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 单据填报 -->
			<view class="applySubmitBox">
				<view class="titleBox">
					<view class="">
						<image src="../../static/img/nav_icon.png" mode="widthFix" class="iconImg"></image>
						<text class="title">单据填报</text>
					</view>
					<view class="more" @click="goBillPage(0)">
						<text>全部&gt</text> 
					</view>
				</view>
				<view class="itemBox">
					<view class="item" @click="goBillPage(1)">
						<view class="item_img">
							<image src="../../static/img/QK.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>费用报销</text>
						</view>
					</view>
					<view class="item" @click="goBillPage(2)">
						<view class="item_img">
							<image src="../../static/img/QK.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>业务申请</text>
						</view>
					</view>
					<view class="item" @click="goBillPage(3)">
						<view class="item_img">
							<image src="../../static/img/FY.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>请款单据</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 业务向导 -->
			<!-- <view class="guideBox">
				<view class="titleBox">
					<view class="">
						<image src="../../static/img/nav_icon.png" mode="widthFix" class="iconImg"></image>
						<text class="title">业务向导</text>
					</view>
				</view>
				<view class="itemBox">
					<view class="item" @click="goBxState">
						<view class="item_img">
							<image src="../../static/img/BXSM.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>报销说明</text>
						</view>
					</view>
					<view class="item" @click="popBoxOpen">
						<view class="item_img">
							<image src="../../static/img/XZXD.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>向导</text>
						</view>
					</view>
					<view class="item" @click="developing">
						<view class="item_img">
							<image src="../../static/img/WDXD.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>我的向导</text>
						</view>
					</view>
				</view>
			</view> -->
			
			<!-- 商旅向导 -->
			<!-- style="display: none;" -->
			<view class="guideBox" >
				<view class="titleBox">
					<view class="">
						<image src="../../static/img/nav_icon.png" mode="widthFix" class="iconImg"></image>
						<text class="title">商旅向导</text>
					</view>
					<view class="more" @click="goTradeMore">
						<text>更多&gt</text> 
					</view>
				</view>
				<view class="itemBox" >
					<view class="item" v-for="(item,index) in tradeList" :key="index" @click="goTradeLink(item.link)">
						<view class="item_img">
							<image :src="item.imgUrl" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>{{item.title}}</text>
						</view>
					</view>
					
				</view>
			</view>
			
			<!-- 报表查询-->
			<!-- <view class="applySubmitBox" v-if="isBaoBiaoShow">
				<view class="titleBox" >
					<view class="">
						<image src="../../static/img/nav_icon.png" mode="widthFix" class="iconImg"></image>
						<text class="title">报表查询</text>
					</view>
				</view>
				<view class="itemBox" >
					<view class="item"  @click="goDepartBudget"  v-if="isBMYSShow">
						<view class="item_img">
							<image src="../../static/img/BMYS.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>部门预算</text>
						</view>
					</view>
					<view class="item"   @click="goSubjectBudget"  v-if="isYSKMShow">
						<view class="item_img">
							<image src="../../static/img/KMYS.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>科目预算</text>
						</view>
					</view>
					<view class="item" @click="goProjectBudget"  v-if="isKJXMShow">
						<view class="item_img">
							<image src="../../static/img/DJSP.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>科教项目预算</text>
						</view>
					</view>					
				</view>
			</view> -->
			
			<!-- 应用-->
			<view class="applySubmitBox">
				<view class="titleBox">
					<view class="">
						<image src="../../static/img/nav_icon.png" mode="widthFix" class="iconImg"></image>
						<text class="title">应用</text>
					</view>
				</view>
				<view class="itemBox">
					<view class="item" @click="goAsset">
						<view class="item_img">
							<image src="../../static/img/ZCPD.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>资产盘点</text>
						</view>
					</view>
					<view class="item" @click="goBxState">
						<view class="item_img">
							<image src="../../static/img/BXSM.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>报销说明</text>
						</view>
					</view>
					<view class="item" @click="goBxState" style="visibility:hidden">
						<!-- <view class="item_img">
							<image src="../../static/img/BXSM.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>报销说明</text>
						</view> -->
					</view>
					<!-- <view class="item" @click="developing">
						<view class="item_img">
							<image src="../../static/img/FJGL.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>附件管理</text>
						</view>
					</view>
					<view class="item" @click="goSalary">
						<view class="item_img">
							<image src="../../static/img/XZCX.png" mode="widthFix" class="iconItem"></image>
						</view>
						<view class="item_title">
							<text>薪资查询</text>
						</view>
					</view> -->
					<!--正式打包 8.18start -->
					<!-- <view class="item" style="background-color: #f7f3f7;"></view>
					<view class="item" style="background-color: #f7f3f7;"></view> -->
					<!--正式打包 8.18end -->	
				</view>
			</view>
			<!-- 回到顶部 -->
			<view class="topBox" id="topBox" @tap="goTop" v-if="topShow">
				<view class="">
					<image src="../../static/img/top.png" mode="widthFix" class="topImg"></image>
				</view>
				<view class="">
					<text>回到顶部</text>
				</view>
			</view>
			<!-- 底部弹出层 -->
			<!-- <lb-picker ref="popup"
			  v-model="currentVal"
			  mode="selector"
			  :list="businessTypeList"			  
			  @confirm="handleConfirm"
			  @cancel="handleCancel">				
			</lb-picker> -->
			
			
		</view>
		<!-- 部门弹框 -->
		<budgetDepartmentIframe v-if='departState' @closeIframe="closeIframe"  :departRows='departRows' @iframeContent='iframefunddepart'></budgetDepartmentIframe>
	</view>
</template>

<script>
//引入pop组件	
// import LbPicker from '@/components/lb-picker'
// import uniPopup from '@/components/uni-popup/uni-popup.vue'
// import budgetDepartmentIframe from "../../components/components_self/write_reimburse/qk/note_budgetDepartment.vue" //部门弹框

// import StorageUtil from "../../utils/storageUtils.js"

export default {
	components:{
		// uniPopup,
		// LbPicker,
		// budgetDepartmentIframe
	},
	data() {
		return {
			topShow:false,//回到顶部是否显示，默认不显示swiper1
			swiperList:["../../static/img/swiper1-1.png","../../static/img/swiper2.png","../../static/img/swiper3.png"],//banner图地址
			businessTypeList:["科教经费收入","举办会议费","国内差旅费","国际差旅费"],//picker列表
			currentVal:"外埠差旅",
			index:0,//被选中的picker下标
			// businessType:"",
			//向导url跳转地址
			// guideUrlList:[
			// 	"/pages/guide/project_guide/index",
			// 	"/pages/guide/meeting_guide/index",
			// 	"/pages/guide/inner_reception/index",
			// 	"/pages/guide/visitor_reception/index",
			// ],
			//商旅接口列表
			tradeList:[
				{
					imgUrl:"../../static/img/ZCPT.png",
					title:"政采平台",
					link:"https://app.gpticket.org/login.action;jsessionid=0DB23B51A608305413FD38EF87E96354#",
				},
				{
					imgUrl:"../../static/img/DD.png",
					title:"滴滴",
					link:"https://common.diditaxi.com.cn/general/webEntry?wx=truebizid=257channel=70365"
				},
				{
					imgUrl:"../../static/img/XC.png",
					title:"携程",
					link:"https://m.ctrip.com/html5/flight/swift/index?sourceid=2132&allianceid=275062&sid=820853&openapp=5"
				},
			],
			/* muwenyuan */
			//报销填报-报销
			pageTypeIndex:null,
			pageTypes:['支出凭证',"差旅报销","因公出国(境)"],
			/* muwenyuan-end */
			//瑾瑜 start
			// wodelu 是否显示报表
			isBaoBiaoShow:true,
			isYSKMShow:true,
			isBMYSShow:true,
			isKJXMShow:true,
			// isYJFShow:true,
			//瑾瑜 end
			//部门弹框穆文元
			departState:false,
			departRows:'',
			currentDepartName:'', //当前部门
			currentDepartCode:'', //当前部门
			currentDepartId:'', //当前部门
			gotopage:'',
		};
	},
	onLoad:function() {
		//报表查询的显示控制
		this.baoBiaoShowControl()
	},
	onNavigationBarButtonTap: function() {  
		uni.navigateTo({
		    url: '../remind/index',
			success: res => {},
			fail: (err) => {console.log(err)},
			complete: (data) => {}
		});  
	},
	onPageScroll:function(obj){
		//监听页面滚动
		if(obj.scrollTop >=300){
			//当页面滚到大于300时，显示“回到顶部”
			// this.topShow = true;
			//后期改为可拖拽
			this.topShow = false;
		}else{
			//当页面滚到小于300时，隐藏“回到顶部”
			this.topShow = false;
		}
	},
	onShow:function(){
		//监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面
		// this.showDepartIframe()
	},
	methods: {
		//报表查询的显示控制
		baoBiaoShowControl(){
			let _this = this;
			// this.$http.GET("/admin/menu/modules",{}).then(res =>{
			// 	let BaoBiaoNeed = false;
			// 	let YSKMNeed = false; let BMYSNeed = false; let KJXMNeed = false; let YJFNeed = false;
			// 	for (let i=0;i<res.data.data.length;i++){
			// 		if (res.data.data[i]['id']==='0131e744b3a14240b10c1780e8100002'){
			// 			BaoBiaoNeed = true;
			// 			break;
			// 		}
			// 	}
			// 	if (BaoBiaoNeed){
			// 		let arr = (JSON.parse(res.data.footer))['0131e744b3a14240b10c1780e8100002'];
			// 		// console.log('有报表功能=',arr);
			// 		arr.map((value,index)=>{
			// 			if (value['id']==='e27ac38fe7ea4ff2aeaac408c4100005') //科目预算
			// 				YSKMNeed = true;
			// 			if (value['id']==='b3a5c5febb6c41c883dd297cab600006') //部门预算
			// 				BMYSNeed = true;
			// 			if (value['id']==='d4895fcee2a4409bb4ddc19d87b00007') //科教项目预算
			// 				KJXMNeed = true;
			// 			if (value['id']==='d7f2eef36ff04681bd5725b685200007')
			// 				YJFNeed = true;
			// 		})
			// 	}
			// 	_this.isBaoBiaoShow = BaoBiaoNeed;
			// 	_this.isYSKMShow = YSKMNeed;
			// 	_this.isBMYSShow = BMYSNeed;
			// 	_this.isKJXMShow = KJXMNeed;
			// 	// this.isYJFShow = YJFNeed;
			// 	_this.$forceUpdate()
			// })
		},
		//刷新页面
		refresh: function() {
			let _this = this;
			this.$http.GET("/admin/menu/modules",{}).then((res)=>{
				let BaoBiaoNeed = false;
				let YSKMNeed = false; let BMYSNeed = false; let KJXMNeed = false; let YJFNeed = false;
				for (let i=0;i<res.data.data.length;i++){
					if (res.data.data[i]['id']==='0131e744b3a14240b10c1780e8100002'){
						BaoBiaoNeed = true;
						break;
					}
				}
				if (BaoBiaoNeed){
					let arr = (JSON.parse(res.data.footer))['0131e744b3a14240b10c1780e8100002'];
					console.log('有报表功能=',arr);
					arr.map((value,index)=>{
						if (value['id']==='e27ac38fe7ea4ff2aeaac408c4100005') //科目预算
							YSKMNeed = true;
						if (value['id']==='b3a5c5febb6c41c883dd297cab600006') //部门预算
							BMYSNeed = true;
						if (value['id']==='d4895fcee2a4409bb4ddc19d87b00007') //科教项目预算
							KJXMNeed = true;
						if (value['id']==='d7f2eef36ff04681bd5725b685200007')
							YJFNeed = true;
					})
				}
				_this.isBaoBiaoShow = BaoBiaoNeed;
				_this.isYSKMShow = YSKMNeed;
				_this.isBMYSShow = BMYSNeed;
				_this.isKJXMShow = KJXMNeed;
				// this.isYJFShow = YJFNeed;
				_this.$forceUpdate()
			})
		},
		//向导--报销说明
		goBxState(){
			// uni.navigateTo({
			// 	url:"/pages/guide/bx_state/index",
			// })
			let url = 'https://mp.weixin.qq.com/s?src=11&timestamp=1598245090&ver=2541&signature=9-mK1mN-vkw5Xb2wGmQqBKQaa7SvbwnI-wnG7YC6FoNmk-T2D9H2Wx8G8IBisBLnqL58Ku8AzTX7PlTAHAX71y2OCD9aHH6acFihsgdKVkGVlToUZKU1rxlU-4K4EquE&new=1';
			plus.runtime.openURL(url, function(res) {
			   //打开失败的回调
			   // console.log(res);  
			   uni.showToast({
				title:"链接打开失败，请联网或授权后再试",
				icon:"none"
			   })
			});  
		},
		//商旅平台链接
		goTradeLink(url){
			//打开第三方链接
		   plus.runtime.openURL(url, function(res) {  
			   //打开失败的回调
			   // console.log(res);  
			   uni.showToast({
			   	title:"链接打开失败，请联网或授权后再试",
				icon:"none"
			   })
		   });  
		},
		//单据填报-更多
		goBillMore() {
			uni.navigateTo({
				url:"/pages/reim/index"
			})
		},
		//商旅--更多
		goTradeMore(){
			uni.navigateTo({
				url:"/pages/trade/tradeMore"
			})
		},
		//打开弹出层
		popBoxOpen:function(){
			this.$refs.popup.show()
		},
		//picker选择值变化时
		// handleChange (item) {
		// 	console.log('change::', item.value)
		// },
		//picker点击确定
		handleConfirm (item) {
			// this.businessType=item.value
			// console.log('item.index::', item.index)
			let index = 0
			if(item.index[0]==0)index = 0
			else index = item.index
			// 调转对应的地址
			uni.navigateTo({
				url:this.guideUrlList[index],						
			})		
			// console.log('this.businessType::', this.businessType)
		},
		//picker点击取消
		handleCancel (item) {
			// console.log('cancel::', item.value)
			uni.showToast({
				title:"只有选择业务类型，才能访问对应的向导哦~",
				icon:"none"
			})
		},
	
		//功能尚在开发中
		developing:function(){
			uni.showToast({
				title:"功能尚在开发中，敬请期待~",
				icon:"none"
			})
		},
		goTop: function(e) {
			//回到顶部
			uni.pageScrollTo({
				duration:100,
				scrollTop:0,
				success:function(){
					//接口调用成功的回调函数
					uni.showToast({
						title: '成功回到顶部~',
						duration: 1000,
					})
				}
			})
		},
		//审批任务
		goApproval:function(i){
			uni.navigateTo({
				url:"/pages/approval/index??approvalingFlag="+i,
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		
		//去常用功能-发票管理页面
		goInvoiceManage:function(){
			uni.navigateTo({
				url:"/pages/function/invoice_manage/index",
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		//去常用功能-附件上传页面
		goFileUpload:function(){
			uni.navigateTo({
				url:"/pages/function/file_upload/index",
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		
		//多部门弹框穆文元
		// showDepartIframe(str, row) {
		// 	var departNumber=new Promise((resolve, rej)=>{
		// 		//获取当前经办人的角色编码
		// 		let re = /.*[\u4e00-\u9fa5]+.*$/;
		// 		function checkAdult(d) {
		// 			return !re.test(d);
		// 		}
		// 		let userInfo = StorageUtil.get("userInfo").roleName;
		// 		let dicrArray =JSON.parse(StorageUtil.get("Dictionary").dict_role_code_name);
		// 		let currentCode=[],currentCodestring='';
		// 		let userInfoArray=[];
		// 		if(userInfo){
		// 			let arr=userInfo.split(',');
		// 			for(let key in dicrArray){
		// 				for(let t=0;t<arr.length;t++){
		// 					if(dicrArray[key]==arr[t]){
		// 						currentCode.push(key)
		// 					}
		// 				}
		// 			}
		// 		}
		// 		currentCodestring=currentCode.join(',');
		// 		this.departRows=currentCodestring;
		// 		this.$http.GET("/datas/user/selectData",{roleCode:currentCodestring}).then((res) => {
		// 			if (res.data.code == 0) {
		// 				resolve(res.data.data)
		// 			}
		// 		});
		// 	})
		// 	return departNumber
		// },
		//关闭弹框
		closeIframe:function(){
			this.departState=false; //关闭部门
		},
		iframefunddepart:function(data){
			this.currentDepartName=data.projectName;//当前部门
			this.currentDepartCode=data.projectCode;//当前部门
			this.currentDepartId=data.projectId;//当前部门
			if(this.gotopage=='借款'){
				uni.navigateTo({
					url:`/pages/write_reimburse/borrrow/index?DepartName=${this.currentDepartName}&DepartCode=${this.currentDepartName}&DepartId=${this.currentDepartId}`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			}
			if(this.gotopage=='差旅报销'){
				uni.navigateTo({
					url:`/pages/write_reimburse/bx_apply/bx-traval/index?DepartName=${this.currentDepartName}&DepartCode=${this.currentDepartCode}&DepartId=${this.currentDepartId}`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			}
			if(this.gotopage=='支出凭证'){
				uni.navigateTo({
					url:`/pages/write_reimburse/bx_apply/bx-cost/index?DepartName=${this.currentDepartName}&DepartCode=${this.currentDepartCode}&DepartId=${this.currentDepartId}`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			}
			this.closeIframe();
		},
		
		//去报销填报--我的报销
		goMyBaoXiao:function(){
			uni.navigateTo({
				url:"/pages/write_reimburse/my_reim/index",
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		//进入单据填报页面
		goBillPage: function(i) {
			uni.navigateTo({
				url:`/pages/reim/index?billPage=`+i,
				animationType: 'pop-in',
				animationDuration: 200,
			})
		},
		/* muwenyuan--beihai */
		//公务接待申请单
		goReceptionApply:function(){
			this.gotopage='公务接待申请单';
			uni.navigateTo({
				url:`/pages/reim/receptionApply/receptionApply?isWrite=true`,
				animationType: 'pop-in',
				animationDuration: 200,
			})
		},
		//业务招待报销单
		goReceptionExpense:function(){
			this.gotopage='业务招待报销单';
			uni.navigateTo({
				url:`/pages/reim/receptionExpense/receptionExpense?isWrite=true`,
				animationType: 'pop-in',
				animationDuration: 200,
			})
		},
		/* muwenyuan */
		goReimRequiser:function() {
			this.gotopage='请款单';
			uni.navigateTo({
				url:`/pages/reim/reimRequiser/reimRequiser?isWrite=true`,
				animationType: 'pop-in',
				animationDuration: 200,
			})
		},
		
		goBaoXiao:function(e){
			let index=e.target.value; //选中的是那个单据   pageTypes:['支出凭证',"差旅报销","因公出国(境)"]
			let pagetext=this.pageTypes[index];
			//差旅报销
			if(index==1){
				this.gotopage='差旅报销';
				this.showDepartIframe().then((data)=>{
				  if (data.length == 1 || data.length == 0) {
					  this.currentDepartName=data[0].projectName;//当前部门
					  this.currentDepartCode=data[0].projectCode;//当前部门
					  this.currentDepartId=data[0].projectId;//当前部门
					  uni.navigateTo({
					  	url:`/pages/write_reimburse/bx_apply/bx-traval/index?DepartName=${this.currentDepartName}&DepartCode=${this.currentDepartCode}&DepartId=${this.currentDepartId}`,
					  	animationType: 'pop-in',
					  	animationDuration: 200
					  })
				  }else{
					 this.departState=true;
				  }
				})
			};
			//支出凭证
			if(index==0){
				this.gotopage='支出凭证';
				this.showDepartIframe().then((data)=>{
				  if (data.length == 1 || data.length == 0) {
					  this.currentDepartName=data[0].projectName;//当前部门
					  this.currentDepartCode=data[0].projectCode;//当前部门
					  this.currentDepartId=data[0].projectId;//当前部门
					  uni.navigateTo({
					  	url:`/pages/write_reimburse/bx_apply/bx-cost/index?DepartName=${this.currentDepartName}&DepartCode=${this.currentDepartCode}&DepartId=${this.currentDepartId}`,
					  	animationType: 'pop-in',
					  	animationDuration: 200
					  })
				  }else{
					 this.departState=true;
				  }
				})
				
			}
		},
		
		//报表查询
		//报表查询-部门预算
		goDepartBudget:function(){
			uni.navigateTo({
				url:"/pages/report_forms/depart/index",
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		//报表查询-科目预算
		goSubjectBudget:function(){
			uni.navigateTo({
				url:"/pages/report_forms/subject/index",
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		//报表查询-项目预算
		goProjectBudget:function(){
			uni.navigateTo({
				url:"/pages/report_forms/project/index",
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		//去资产盘点页
		goAsset(){
			uni.navigateTo({
				url:"/pages/asset/index",
				animationType: 'pop-in',
				animationDuration: 200
			})
		},
		//去薪资查询
		goSalary(){
			uni.navigateTo({
				url:"/pages/salary/index",
				animationType: 'pop-in',
				animationDuration: 200
			})
		}
	},
	
}
</script>

<style scoped>
	/* @import url("/static/css/reset.css"); */
	.container {
		padding-bottom: 20px;
		font-size: 14px;
		line-height: 24px;
		background-color: #f7f3f7;
	}
	/* 固定定位有bug,加上后显示不出来 */
	/* .swiperBox{
		position: fixed;
		top: 0;
	} */
	.swiper-item image{
		width: 100vw;
	}

	.iconImg{
		width: 60rpx;
		vertical-align:middle;
	}
	.iconItem{
		width: 100rpx;
		height: 100rpx;
	}
	.titleBox{
		/* 两端对齐 */
		display: flex;
		justify-content: space-between;
		margin: 60rpx 0 ;
		line-height: 60rpx;
	}
	.titleBox .title{
		margin-left: 20rpx;
		vertical-align:middle;
		font-size: 18px;
	}
		
	.titleBox .more{
		margin-right: 40rpx;
		font-size: 18px;
	}	
	.itemBox{
		display: flex;
		justify-content: space-around;
		align-items: center;
		
	}
	.itemBox .item{
		display: flex;
		width: 210rpx;
		height: 240rpx;
		background-color: #fff;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	/* 回到顶部 */
	.topBox{
		position: fixed;
		right: 10px;
		bottom: 40px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 130rpx;
		height: 130rpx;
		background-color: #fffaff;
		z-index: 9999;
	}	
	.topBox .topImg{
		margin-top: 20rpx;
		width: 60rpx;
	}
		
	.topBox text{
		font-size: 12px;
		line-height: 16px;
		padding-bottom: 20rpx;
	}
	.popup{
		z-index: 9999;
	}
</style>
