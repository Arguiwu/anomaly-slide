(function(window) {
	var NYdrag = function(id, options) {
		this.main = document.getElementById(id);
		this.settings = options;
		this.value= this.settings.default;
		this.obj =  this.main.querySelector('.ny-slider-btn');
		this.range = this.main.querySelector('.ny-slider-range');
		this.itembox = this.main.querySelector('.ny-slider-item-box');
		this.disX = this.main.clientX - 8;
	};
	NYdrag.prototype.init = function() {
		var me = this;
		var settings = me.settings;
		this.obj.onmousedown = function(e) {
			var e = e || window.event;
			me.mousedown(e);
			return false;
		};
		var itemHTML = '';
		var numberHTML = '';
		var len = settings.value.length;
		for(var i = 0; i < len; i++) {
			var width = settings.width[i] || (len+1) / 10;
			var value = settings.value[i];
			var unit = settings.unit;
			itemHTML += '<div class="ny-slider-item" style="width: ' + width + '%;"><span class="slider-item-number">'+ value + unit +'</span></div>';
			numberHTML += '<div class="ny-slider-range-item" style="width: ' + width + '%;"><span class="range-item-number">'+ value + unit +'</span></div>';
		}
		this.range.querySelector('.ny-slider-range-current').innerHTML = numberHTML;
		this.itembox.innerHTML = itemHTML;
		this.moveto(settings.default);
	};
	NYdrag.prototype.mousedown = function(e) {
		var me = this;
		this.disX = e.clientX - this.obj.offsetLeft;
		document.onmousemove = function(e) {
			var e = e || window.event;
			me.mousemove(e);
		};
		document.onmouseup = function() {
			me.mouseup();
		}
	};
	NYdrag.prototype.mousemove = function(e, clickWidth) {
		var me = this;
		var maxWidth = me.settings.maxwidth;
		var differX = clickWidth || e.clientX - me.disX;
		var minDiffer = me.settings.min / me.settings.max * maxWidth;
		var maxDiffer = maxWidth;
		if( differX >= minDiffer && differX <= maxDiffer ) {
			setTimeout(function() {
				me.obj.style.left = differX + 'px';
				me.range.style.width = differX + 'px';
				var index = me.sector(me.settings.value, me.value);
				var value;

				var sectorDiff = index == 0 ? me.settings.value[0] : (me.settings.value[index] - me.settings.value[index - 1]);
				if(index == 0) {
					value = Math.floor(differX / (maxWidth * me.settings.width[index] / 100) * sectorDiff);
				}else {
					var beforeWidth = 0;
					for(var i = 1; i <= index; i++) {
						beforeWidth += parseInt(me.settings.width[index -i] * maxWidth / 100);
					}
					value = me.settings.value[index-1] + Math.floor((differX - beforeWidth) / (maxWidth * me.settings.width[index] / 100) * sectorDiff);
				}
				if(value < me.settings.min) {
					value = me.settings.min;
				}else if(value > me.settings.max) {
					value = me.settings.max;
				}
				me.value = value;
				me.settings.callback(value);
			},10);
		}
	};
	NYdrag.prototype.add = function() {
		var me = this;
		var value = me.value;
		if(value < me.settings.max) {
			me.value = value + me.settings.step;
			me.moveto(value + me.settings.step);
		}
	};
	NYdrag.prototype.less = function() {
		var me = this;
		var value = me.value;
		if(value > me.settings.min) {
			me.value = value - me.settings.step;
			me.moveto(value - me.settings.step);
		}
	};
	NYdrag.prototype.moveto = function(num) {
		var me = this;
		me.value = num;
		var maxWidth = me.settings.maxwidth;
		var width = 0;
		var index = me.sector(me.settings.value, num);
		var sectorDiff = index == 0 ? me.settings.value[0] : (me.settings.value[index] - me.settings.value[index - 1]);
		if(index === 0) {
			width = num / me.settings.value[0] * maxWidth * me.settings.width[0] / 100;
		}else {
			for(var i = 1; i <= index; i++) {
				width += parseInt(me.settings.width[index -i] * maxWidth / 100);
			}
			width += (num - me.settings.value[index-1]) / sectorDiff * maxWidth * (me.settings.width[index] / 100);
		}
		me.obj.style.left = width + 'px';
		me.range.style.width = width + 'px';
		me.settings.callback(num);
	};
	NYdrag.prototype.mouseup = function() {
		document.onmousemove = null;
		document.onmouseup = null;
	}
	NYdrag.prototype.sector = function(array, value) {
		for(var i = 0; i < array.length; i++) {
			if(value >= this.settings.min && value <= array[0]) {
				return 0;
			}else if(value <= array[i] && value > array[i-1]) {
				return i;
			}
		}
	};

	if (!document.querySelectorAll) {
	    document.querySelectorAll = function (selectors) {
	        var style = document.createElement('style'), elements = [], element;
	        document.documentElement.firstChild.appendChild(style);
	        document._qsa = [];

	        style.styleSheet.cssText = selectors + '{x-qsa:expression(document._qsa && document._qsa.push(this))}';
	        window.scrollBy(0, 0);
	        style.parentNode.removeChild(style);

	        while (document._qsa.length) {
	            element = document._qsa.shift();
	            element.style.removeAttribute('x-qsa');
	            elements.push(element);
	        }
	        document._qsa = null;
	        return elements;
	    };
	}

	if (!document.querySelector) {
	    document.querySelector = function (selectors) {
	        var elements = document.querySelectorAll(selectors);
	        return (elements.length) ? elements[0] : null;
	    };
	}
	// 用于在IE6和IE7浏览器中，支持Element.querySelectorAll方法
	var qsaWorker = (function () {
	    var idAllocator = 10000;

	    function qsaWorkerShim(element, selector) {
	        var needsID = element.id === "";
	        if (needsID) {
	            ++idAllocator;
	            element.id = "__qsa" + idAllocator;
	        }
	        try {
	            return document.querySelectorAll("#" + element.id + " " + selector);
	        }
	        finally {
	            if (needsID) {
	                element.id = "";
	            }
	        }
	    }

	    function qsaWorkerWrap(element, selector) {
	        return element.querySelectorAll(selector);
	    }

	    // Return the one this browser wants to use
	    return document.createElement('div').querySelectorAll ? qsaWorkerWrap : qsaWorkerShim;
	})();
	window.NYdrag = NYdrag;

})(window);