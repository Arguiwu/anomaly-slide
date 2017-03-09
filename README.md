## 不规则拖动条

### 使用
```
	var settings = {
		step: 5,							//数值间隔
		defaultVal: 5,						//默认值
		min: 5,								//最小值
		max: 300,							//最大值
		value: [10, 50, 300],				//分区间
		width: [50, 25,25],					//每个区间占比
		unit: 'M',							//显示单位
		maxwidth: 500,						//整个拖动条长度
		callback: function(value) {			//数值变化后的回调
			document.getElementById('text').value = value;
		},
		onceCall: function(value) {			//拖动松开鼠标后的回调
			
		}
	};
	var nydrag = new NYdrag('NYslider', settings);	//创建
	nydrag.init();									//初始化

	nydrag.add();									//数值加一次间隔
	nydrag.less();									//数值减一次间隔
	nydrag.moveto(value);							//拖动条赋值
```

###### ...待优化