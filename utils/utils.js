export default class Utils{
	// 节流throttle代码（时间戳+定时器）：
	static throttle(func, delay){   
		let timer = null;     
		let startTime = Date.now();     
		return function() {             
			let curTime = Date.now();             
			let remaining = delay - (curTime - startTime);             
			let context = this;             
			let args = arguments;             
			clearTimeout(timer);              
			if (remaining <= 0) {                    
				func.apply(context, args);                    
				startTime = Date.now();              
			} else {                    
				timer = setTimeout(func, remaining);              
			}      
		}
	}
	// 防抖
	static debounce(fn,wait) {		
	    let timeout = null;    
	    return function() {        
	        if(timeout !== null)   clearTimeout(timeout);        
	        timeout = setTimeout(fn, wait);    
	    }
	}
	//js保留两位小数，自动补充零
	static returnFloat(value){
		var value=Math.round(parseFloat(value)*100)/100;
		var xsd=value.toString().split(".");
		if(xsd.length==1){
			value=value.toString()+".00";
			return value;
		}
		if(xsd.length>1){
			if(xsd[1].length<2){
				value=value.toString()+"0";
			}
			return value;
		}
	};
	//千位分隔符
	static fmtMoney(num, fixed, on) {
		if (num === "" || num == undefined || num === null) {
		  return ""
		}
		let d = Number(num);
		if (on) {
		  if (d < 0) {
			d = 0;
		  }
		}
		return d.toFixed(fixed).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
	 };
	  //去除千分位
	  static delcommafy(num) {
		 if (num == null || num == undefined || num == "") {
				num = 0
		 }
		 num = num.toString();
		 num = num.replace(/[ ]/g, ""); //去除空格
		 num = num.replace(/,/gi, '');
		 return Number(num);
	 };
	  //小数相加避免出现多位
	  static accAdd(arg1, arg2) {
	     if (arg1 == undefined || arg1 == null || arg1 == "null" || arg1 == "") {
	       arg1 = 0;
	     }
	     if (arg2 == undefined || arg2 == null || arg2 == "null" || arg2 == "") {
	       arg2 = 0;
	     }
	     var r1, r2, m, c;
	     try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
	     try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
	     c = Math.abs(r1 - r2);
	     m = Math.pow(10, Math.max(r1, r2))
	     if (c > 0) {
	       var cm = Math.pow(10, c);
	       if (r1 > r2) {
	         arg1 = Number(arg1.toString().replace(".", ""));
	         arg2 = Number(arg2.toString().replace(".", "")) * cm;
	       }
	       else {
	         arg1 = Number(arg1.toString().replace(".", "")) * cm;
	         arg2 = Number(arg2.toString().replace(".", ""));
	       }
	     }
	     else {
	       arg1 = Number(arg1.toString().replace(".", ""));
	       arg2 = Number(arg2.toString().replace(".", ""));
	     }
	     return (arg1 + arg2) / m
	   };
	   //小数相乘避免出现多位
	   static numMulti(num1, num2) {
		   if(num1 == undefined || num1 == null || num1 == "null" || num1 == "" || num1==NaN){
			 num1 = 0;
			}
			if(num2 == undefined || num2 == null || num2 == "null" || num2 == "" || num2==NaN){
			 num2 = 0;
			}
		   var baseNum = 0;
		   try {
			baseNum += num1.toString().split(".")[1].length;
		   } catch (e) {
		   }
		   try {
			baseNum += num2.toString().split(".")[1].length;
		   } catch (e) {
		   }
		   return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
		  };
		//小数相减避免出现多位
		static numSub(num1, num2) {
		    if(num1 == undefined || num1 == null || num1 == "null" || num1 == "" || num1==NaN){
		      num1 = 0;
		     }
		     if(num2 == undefined || num2 == null || num2 == "null" || num2 == "" || num2==NaN){
		      num2 = 0;
		     }
		     var baseNum, baseNum1, baseNum2;
		     var precision;// 精度
		     try {
		      baseNum1 = num1.toString().split(".")[1].length;
		     } catch (e) {
		      baseNum1 = 0;
		     }
		     try {
		      baseNum2 = num2.toString().split(".")[1].length;
		     } catch (e) {
		      baseNum2 = 0;
		     }
		     baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
		     precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
		     return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
		};
		//对象数组深度克隆
		static deepClone(obj) {
		   var result;
		   var oClass = {}.toString.call(obj).slice(8, -1);
		   if (oClass === "Object") {
			 result = {};
		   } else if (oClass === "Array") {
			 result = [];
		   } else {
			 return obj;
		   }
		   for (var key in obj) {
			 var copy = obj[key];
			 var typeCopy = {}.toString.call(copy).slice(8, -1)
			 if (typeCopy == "Object") {
			   result[key] = this.deepClone(copy); //递归调用
			 } else if (typeCopy == "Array") {
			   result[key] = this.deepClone(copy);
			 } else {
			   result[key] = obj[key];
			 }
		   }
		   return result;
		 };
		//获取字典的数据  needArray状态索引值，可以直接获取需要的状态
		static getDictData(dict_name, needArray) {
			let promisefun=new Promise((resolve,rej)=>{
				var datas = [];
				// var data = JSON.parse(localStorage.Dictionary).data[dict_name];
				let dictData={};
				uni.getStorage({
					key: 'Dictionary',
					success: function (res) {
					 dictData=res.data;
					 var data = dictData[dict_name];
					 if (data != null) {
					   data = eval('(' + data + ')');
					 }
					 if (!needArray) {
					   for (var key in data) {
						datas.push({
						  value: key,
						  label: data[key]
						});
					   }
					 } else {
					   needArray.forEach(function (val, i) {
						for (var key in data) {
						  if (val == key) {
							datas.push({
							  value: key,
							  label: data[key]
							});
						  }
						}
					   })
					 }
					 resolve(datas)
					}
				});
			})
			return promisefun
		};
		//数据字典转分离label和value,渲染使用数组索引为0的项
		static getTitle(dict_name) {
			let getDict=new Promise((resolve,rej)=>{
				this.getDictData(dict_name).then((res)=>{
					var arr=res;
					let labelArr = [];
					let valueArr = [];
					let objArr = [];
					for(let item of arr) {
					 labelArr.push(item.label);
					 valueArr.push(item.value);
					}
					objArr.push(labelArr);
					objArr.push(valueArr);
					resolve(objArr);
				});
			})
			return getDict
		   
		};
		//字典标题转换成值 
		static getDictValue(dict_name, title, defaultt) {
			let getDict=new Promise((resolve,rej)=>{
				let dictData={};
				uni.getStorage({
					key: 'Dictionary',
					success: function (res) {
					 dictData=res.data;
					 var data = dictData[dict_name];
					 if (data != null) {
					   data = eval('(' + data + ')');
					 }
					 for (var key in data) {
					   if (title == data[key]) {
						  resolve(key)
					   }
					 }
							
					 if (typeof (defaultt) !== 'undifined') {
						  resolve(defaultt)
					 }
					}
				});
			})
			return getDict
		};
		//字典值转换成标题 
		static getDictTitle(dict_name, value, defaultv) {
			let getDicttt=new Promise((resolve,rej)=>{
				if (value === "") {
				  return ""
				} 
				let dictData={};
				uni.getStorage({
					key: 'Dictionary',
					success: (res)=> {
						dictData=res.data;
						var data = dictData[dict_name]; 
						 if (data != null) {
						   data = eval('(' + data + ')');
						 }
						 for (var key in data) {
						   if (value == key) {
							   resolve(data[key])
							   continue
						   }
						 }
						 if (typeof (defaultv) !== 'undifined') {
							 resolve(defaultv)
						 }
						 return value == null ? '' : value;
					}
				});	
			})
			return getDicttt
		};
		//明细提交必填控制
		//musts 条件控制 0 非必填 1必填
		static mustFun(that) {
			let msg=''
			const querys = uni.createSelectorQuery().in(that);
			querys.selectAll('.must').boundingClientRect(data => {
				let len=data.length;
				for(let i=len;i>0;i--){
					if(data[i-1].dataset.value==undefined || data[i-1].dataset.value==='' || data[i-1].dataset.value==null){
						// uni.showToast({title: '请填写' + data[i-1].dataset.must,duration: 2000,icon:'none',});
						msg=data[i-1].dataset.must
					}
				}
			}).exec();
			return msg;
		};
		//   获取当前月及前六个月
		static getNowDate() {
		    let s = []
		    for (var m = 6; m > 0; m--) {
		      if (parseInt(m) > 0) {
		        //m是 往前推的总月份
		        var myDate = new Date();
		        // var mytime = myDate.format("yyyy-MM-dd"); //获取当前日期
		        var year = myDate.getFullYear(); //获取当前年
		        var month = myDate.getMonth() + 2; //获取当前月
		        var lowData = ""; //当前年月日往前推m个月后获取到的年月日
		        var ylow = parseInt(parseInt(m) / 12); //往前推的总月份换成对应的年数取整
		        var mlow = parseInt(m) % 12; //往前推的月数
		        if (ylow > 0) {
		          year -= ylow; //年要再减一
		        } else {
		          year = year; //年取当前年份
		        }
		        if (mlow > month || mlow == month) {
		          //往前推的月份大于或等于当前月份，12减去往前推的月份加上现在的月份
		          year = year - 1;
		          month = 12 - mlow + month;
		          lowData = year + "-" + month;
		        } else {
		          //往前推的月份小于当前月份
		          month -= mlow;
		          if (month < 10) {
		            lowData = year + "0" + month;
		          } else {
		            lowData = year + "" + month;
		          }
		        }
		        s.unshift(lowData);
		      } else { }
		    }
		    return s
		};
		//上报周期
		static getDate() {
		    let s = []
		    for (var m = 6; m > 0; m--) {
		      if (parseInt(m) > 0) {
		        //m是 往前推的总月份
		        var myDate = new Date();
		        // var mytime = myDate.format("yyyy-MM-dd"); //获取当前日期
		        var year = myDate.getFullYear(); //获取当前年
		        var month = myDate.getMonth() + 3; //获取当前月
		        var lowData = ""; //当前年月日往前推m个月后获取到的年月日
		        var ylow = parseInt(parseInt(m) / 12); //往前推的总月份换成对应的年数取整
		        var mlow = parseInt(m) % 12; //往前推的月数
		        if (ylow > 0) {
		          year -= ylow; //年要再减一
		        } else {
		          year = year; //年取当前年份
		        }
		        if (mlow > month || mlow == month) {
		          //往前推的月份大于或等于当前月份，12减去往前推的月份加上现在的月份
		          year = year - 1;
		          month = 12 - mlow + month;
		          if (month < 10) {
		            lowData = year + "0" + month;
		          } else {
		            lowData = year + "" + month;
		          }
		        } else {
		          //往前推的月份小于当前月份
		          month -= mlow;
		          if (month < 10) {
		            lowData = year + "0" + month;
		          } else {
		            lowData = year + "" + month;
		          }
		        }
		        s.unshift(lowData);
		      } else { }
		    }
		    return s
		};
		static attachNumChange(value) {
		    let r = /^\+?[1-9][0-9]*$/;
		    if (r.test(value)) {
		      return value
		    } else {
		      value = '';
			  uni.showToast({
			  	title: '请填写一个正整数',
			  	duration:2000,
			  	icon:'none',
			  });
		      return value;
		    }
		};
		//计算天数差的函数，通用
		static DateDiff(sDate1, sDate2) { //sDate1和sDate2是2017-9-25格式
			var aDate, oDate1, oDate2, iDays
			oDate1 = new Date(sDate1).getTime() //转换为9-25-2017格式
			oDate2 = new Date(sDate2).getTime()
			iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数
			return iDays
		};
		static getAll(stime,etime){
		    //初始化日期列表，数组
		    var diffdate = new Array();
		    var i=0;
		    //开始日期小于等于结束日期,并循环
		    while(stime<=etime){
		        diffdate[i] = stime;
		        //获取开始日期时间戳
		        var stime_ts = new Date(stime).getTime();
		        //增加一天时间戳后的日期
		        var next_date = stime_ts + (24*60*60*1000);
		        //拼接年月日，这里的月份会返回（0-11），所以要+1
		        var next_dates_y = new Date(next_date).getFullYear()+'-';
		        var next_dates_m = (new Date(next_date).getMonth()+1 < 10)?'0'+(new Date(next_date).getMonth()+1)+'-':(new Date(next_date).getMonth()+1)+'-';
		        var next_dates_d = (new Date(next_date).getDate() < 10)?'0'+new Date(next_date).getDate():new Date(next_date).getDate();
		
		        stime = next_dates_y+next_dates_m+next_dates_d;
		        //增加数组key
		        i++;
		    }
		    return diffdate
		};
		//限制input只能输入数字
		static yzNumber(value) {
		     var text =value;
		     text = text.replace(/[^\d.-]/g, ""); //清除“数字”和“.”以外的字符
		     text = text.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
		     text = text.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
		     text = text.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
		     if (text.indexOf(".") < 0 && text != "") {
		         text = parseFloat(value);
		     }
		     return text
		}
}
