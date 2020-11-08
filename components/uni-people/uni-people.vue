<template>
	<!-- 收款人/单位 -->
	<view class="peojectName">
		<view class="header_top">
			<view class="headerTopLeft" @click="close">
				<image src="../../static/img/back_icon.png" mode="" class='banc-icon'></image>
			</view>
			<view class="serchBoxRight">
				<!-- 搜索框 -->
				<uni-search-bar2 :searchHolder="searchPlaceholder" @searchVal="getData" ref='searchchild'></uni-search-bar2>
			</view>
		</view>
		<view class="tabBox">
			<view v-for="(item,index) in arr" :key="index" :class='{"tabActive":active==index}' class='tabList' @click="changTab(index)">{{item}}</view>
		</view>
		<view class="peojectContent">
			<view v-show="active==0">
				<mescroll-uni @init='mescrollInit' @down="downCallback" @up="upCallback" :up="upOption" class="message" :top='255'
				 v-if='isList'>
					<view class="billMsgBox" v-for='(item,index) in pageDataLeft' :key="index">
						<radio :value="index+''" :checked="index === current" @click="radioClick(index)" style="margin-left: 6px;" />
						<view class='contentright'>
							<view class="peojectList">
								<text class='left'>单位编码：</text>
								<text class='right'>{{item.code}}</text>
							</view>
							<view class="peojectList">
								<text class='left'>单位名称：</text>
								<text class='right'>{{item.name}}</text>
							</view>
							<view class="peojectList">
								<text class='left'>开户行：</text>
								<text class='right'>{{item.bank}}</text>
							</view>
							<view class="peojectList">
								<text class='left'>银行账户：</text>
								<text class='right'>{{item.account}}</text>
							</view>
							<view class="peojectList">
								<text class='left'>单位地址：</text>
								<text class='right'>{{item.address}}</text>
							</view>
						</view>
					</view>
				</mescroll-uni>
				<view class="noData" v-else>暂无数据</view>
			</view>
			<view v-show="active==1">
				<mescroll-uni top="100" @init='mescrollInit' @down="downCallback" @up="upCallback" :up="upOption" class="message"
				 :top='255' v-if='isList'>
					<view class="billMsgBox" v-for='(item,index) in pageDataRight' :key="index">
						<radio :value="index+''" :checked="index === current" @click="radioClick(index)" style="margin-left: 6px;" />
						<view class='contentright'>
							<view class="peojectList">
								<text class='left' style="width: 42px;">工号：</text>
								<text class='right'>{{item.code}}</text>
							</view>
							<view class="peojectList">
								<text class='left' style="width: 42px;">姓名：</text>
								<text class='right'>{{item.name}}</text>
							</view>
							<view class="peojectList">
								<text class='left' style="width: 42px;">部门：</text>
								<text class='right'>{{item.departName}}</text>
							</view>
						</view>
					</view>
				</mescroll-uni>
				<view class="noData" v-else>暂无数据</view>
			</view>
		</view>
	</view>

</template>

<script>
	import MescrollUni from '../uni-mescroll-master/mescroll-uni/components/mescroll-uni/mescroll-uni.vue'; //插件上拉加载下拉刷新
	import Utils from "../../utils/utils.js"
	export default {
		props: ['peopleNameState', 'projectsearchData'],
		data() {
			return {
				searchPlaceholder: '可搜索编码',
				isList: true, //控制显示暂无数据
				current: '', //当前选中的行
				pageDataLeft: [], //数据集合
				pageDataRight: [], //数据集合
				//下拉到最底部的信息
				upOption: {
					textNoMore: '我是有底线的 >_<',
					auto: false
				},
				isShowNoMore: false, //显示无更多数据
				currentpage: 1, //当前分页
				limit: 10, //每页显示的条数
				totalpageLeft: 0,
				totalpageRight: 0,
				currentText: '单位',
				workUnit: true,
				people: true,
				active: 0, //当前tab索引值
				arr: ['合作单位信息', '人员信息'], //tab上的数据
				/*---------对方单位-------------------*/
				searchValue: {
					code: "", //单位编码
					name: "", //单位名称
					bankName: "", //开户行名称
					bankNum: "" //银行账号
				},
				workUnitDatas: [], //对方单位数据
				workUnitChecked: [], //对方单位表单选中的数据
				pagetotal: 0, //数据数量
				/*---------人员档案-------------------*/
				peoplesearchValue: {
					code: "", //工号
					name: "", //姓名
					departName: "", //部门
					bankNum: "" //银行账号
				},
				peopleDatas: [], //对方单位数据
				peopleChecked: [], //对方单位表单选中的数据
				searchCode: '',
			};
		},
		components: {
			MescrollUni,
			Utils,
			//search
		},
		mounted: function() {},
		methods: {
			//切换tab
			changTab: function(index) {
				this.active = index
				this.searchCode = ''
				this.$refs.searchchild.searchVal = '';
				this.currentpage = 1;
				this.getData();
				if(this.currentText == '单位') {
					this.currentText = '人员';
					this.searchPlaceholder='可搜索工号'
					this.$refs.searchchild.placeholder='可搜索工号'
				} else {
					this.currentText = '单位';
					this.searchPlaceholder='可搜索编码'
					this.$refs.searchchild.placeholder='可搜索编码'
				}
			},
			// mescroll组件初始化的回调
			mescrollInit: function(mescroll) {
				this.getData()
			},
			//获取第一页数据
			getData: function(code) {
				let _this = this;
				let paramsLeft = {}
				let paramsRight = {}
				if (code === '' || code == null || code == undefined) {
					code = ''
					this.searchCode = '';
				} else {
					this.currentpage = 1;
					this.searchCode = code;
				}
				paramsLeft = {
					isStop:'1', //正常
					code: this.searchCode,
					page: this.currentpage,
					limit: this.limit,
				}
				paramsRight = {
					code: this.searchCode,
					page: this.currentpage,
					limit: this.limit,
				}
				//对方单位档案-left；人员档案-right
				//对方单位
				this.$http.GET("/datas/partnerUnit/page", paramsLeft).then((res) => {
					if (res.data.code == 0) {
						_this.pageDataLeft = res.data.data;
						if (res.data.data.length > 0) {
							_this.totalpageLeft = Math.ceil(res.data.count / _this.limit); //计算有几页
						} else {
							_this.totalpageLeft = 0;
						}
					}
				})
				//人员
				this.$http.GET("/datas/staff/page", paramsRight).then((res) => {
					if (res.data.code == 0) {
						_this.pageDataRight = res.data.data;
						if (res.data.data.length > 0) {
							_this.totalpageRight = Math.ceil(res.data.count / _this.limit); //计算有几页
						} else {
							_this.totalpageRight = 0;
						}
					}
				})
			},
			// 下拉回调
			downCallback: function(mescroll) {
				setTimeout(() => {
					mescroll.endErr()
				}, 1000)
			},
			// 上拉回调
			upCallback: function(mescroll) {
				let _this = this;
				let totalpage = 0;
				if(this.currentText == '单位') {
					totalpage = this.totalpageLeft;
				} else {
					totalpage = this.totalpageRight;
				}
				setTimeout(() => {
					if (totalpage > this.currentpage) {
						this.currentpage++
						let paramsLeft = {}
						let paramsRight = {}
						paramsLeft = {
							isStop:'1', //正常
							code: this.searchCode,
							page: this.currentpage,
							limit: this.limit,
						}
						paramsRight = {
							code: this.searchCode,
							page: this.currentpage,
							limit: this.limit,
						}
						//对方单位
						this.$http.GET("/datas/partnerUnit/page", paramsLeft).then((res) => {
							if (res.data.code == 0) {
								if (res.data.data.length > 0) {
									for (var i = 0; i < res.data.data.length; i++) {
										// if (_this.pageDataLeft[i].bankList && _this.pageDataLeft[i].bankList.length > 0) {
										// 	_this.$set(_this.pageDataLeft[i], "bankName", _this.pageDataLeft[i].bankList[0].bankName);
										// 	_this.$set(_this.pageDataLeft[i], "bankNum", _this.pageDataLeft[i].bankList[0].bankNum);
										// }
										_this.pageDataLeft.push(res.data.data[i]);
									}
									_this.totalpageLeft = Math.ceil(res.data.count / _this.limit); //计算有几页
								} else {
									_this.totalpageLeft = 0;
								}
							}
						})
						//人员
						this.$http.GET("/datas/staff/page", paramsRight).then((res) => {
							if (res.data.code == 0) {
								if (res.data.data.length > 0) {
									for (var i = 0; i < res.data.data.length; i++) {
										if (_this.pageDataRight[i].bankList && _this.pageDataRight[i].bankList.length > 0) {
											_this.$set(_this.pageDataRight[i], "bankName", _this.pageDataRight[i].bankList[0].bankName);
											_this.$set(_this.pageDataRight[i], "bankNum", _this.pageDataRight[i].bankList[0].bankNum);
										}
										_this.pageDataRight.push(res.data.data[i]);
									}
									_this.totalpageRight = Math.ceil(res.data.count / _this.limit); //计算有几页
								} else {
									_this.totalpageRight = 0;
								}
							}
						})
						this.isShowNoMore = false;
						mescroll.endUpScroll(this.isShowNoMore);
					} else {
						this.isShowNoMore = true;
						mescroll.endUpScroll(this.isShowNoMore);
					}
				}, 1000)
			},
			//选中操作
			radioClick: function(value) {
				if (this.current === value) {
					this.current = ''
				} else {
					this.current = value
				}
				let checkData = {};
				if (this.active == 0) {
					checkData = this.pageDataLeft[value]; //选中的单位数据
				} else {
					checkData = this.pageDataRight[value]; //选中的单位数据
				}
				let backData = {
					payeeid:checkData.id, 
					payeename: checkData.name, 
					bankname: checkData.bank,  
					banknumber: checkData.account, 
					watchPeople: 1, 
				}
				this.$emit('iframeContent', backData);
			},
			//关闭
			close() {
				this.$emit('closeIframe');
			}
		}
	}
</script>

<style scoped>
.header_top {width: 100%;height: 70px;background-color: rgb(90, 154, 247);position: fixed;left: 0;top: 0;right: 0;z-index: 999;display: flex;flex-direction: row;}
.headerTopLeft {position: absolute;left: 0;top: 20px;width: 44px;height: 44px;}
.serchBoxRight {flex: 1;margin-left: 50px;margin-right: 20px;display: flex;align-items: center;box-sizing: border-box;padding-top: 16px;width: 0px;}
.banc-icon {width: 100%;height: 100%;}
.tabBox>view {width: 50%;}
.tabActive {color: #5a9af7;border-bottom: 2px solid #5A9AF7;}
.uni-scroll-view {margin-top: 20px !important;}
.tabBox{top:70px}
.serchBox {height: 60px;display: flex;flex-direction: row;width: 100%;background: rgb(90, 154, 247);box-sizing: border-box;padding: 0px 3px;align-items: center;}
.serchBoxLeft {font-size: 27px;color: #FFFFFF;width: 38px;height: 30px;text-align: center;line-height: 30px;}
.peojectName {display: flex;flex-direction: column;position: fixed;left: 0px;top: 0px;right: 0px;bottom: 0px;background: #f2f2f2;z-index: 1000;}
.peojectContent {padding: 0 2%;width: 100%;box-sizing: border-box;}
.billMsgBox {display: flex;justify-content: center;align-items: center;flex-direction: row;padding:10px 0;background: #FFFFFF;border-bottom: 1px solid #cecbce;border-radius: 5px;margin-bottom: 20rpx;width: 96%;position: relative;margin: 0 auto 10px;}
.checkleft {width: 26px;margin-left: 8px;}
.contentright {flex: 1;width: auto;}
.peojectList {display: flex;flex-direction: row;text-align: left;font-size: 12px;width: 100%;box-sizing: border-box;padding: 0px 4px 0px 0px;line-height: 26px;}
.peojectList .left {width:64px;text-align: right;}
.peojectList .right {flex: 1;width: 0px;word-wrap: break-word;word-break: normal;}
.noData {width: 100%;height: 20px;text-align: center;line-height: 20px;margin-top: 100px;color: #ababab;font-size: 18px;}
</style>
