		//rem屏幕自适应	
		(function(win,doc){
			var rem = 100 * doc.documentElement.clientWidth / 1920;
			doc.documentElement.style.fontSize = rem + 'px';
			win.onresize = function () {
				rem = 100 * doc.documentElement.clientWidth / 1920;
				doc.documentElement.style.fontSize = rem + 'px';
			};
		})(window,document); 
		
		//rem屏幕自适应-高级	
		    function refreshRem() {
			var doc = window.document;
			var docEl = doc.documentElement;
			var dpr = 0;
			var scale = 0;
			if (!dpr && !scale) {
				var isAndroid = window.navigator.appVersion.match(/android/gi);
				var isIPhone = window.navigator.appVersion.match(/iphone/gi);
				var isIpad =window.navigator.appVersion.match(/ipad/gi);
				var devicePixelRatio = window.devicePixelRatio;
				if (isIPhone) {
				// iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
				if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
					dpr = 3;
				} else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
					dpr = 2;
				} else {
					dpr = 1;
				}
				} else if (isIpad) {
					dpr = 4;
				} else {            
					dpr = 1;// 其他设备下，仍旧使用1倍的方案
				}
				scale = 1 / dpr;
			}
			docEl.setAttribute('data-dpr', dpr);
			var width = docEl.getBoundingClientRect().width;
			if (width / dpr > 600) {
			  width = 600 * dpr;
			}
			var rem = width / 10;
			docEl.style.fontSize = rem + 'px';
		}
		