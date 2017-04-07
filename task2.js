var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var keyword = system.args[1];
var device = system.args[2];
var datalist = [];
var t = Date.now();
var url = 'http://www.baidu.com/s?wd='+keyword;

if(fs.exists('device.json')) {
	var file = fs.open('device.json','r');
	var content = '';
	var config = null;
	while (!file.atEnd()) {
		content += file.readLine();
	}
	config = JSON.parse(content);
	for(var i = 0;i < 4; i++){
		if(device === config[i].name){
			device = config[i];
		}
	}
	page.settings.userAgent = device.ua;
	page.viewportsSize = {
		width:device.width,
		height:device.height
	};
}

phantom.outputEncoding = 'gb2312';

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

if(system.args.length ===1 ) {
	console.log('please input keyword');
	phantom.exit();
} else {
	keyword = system.args[1];
	url = 'https://www.baidu.com/s?wd='+keyword;
	page.open(url,function(status){
		if(status != 'success') {
			console.log('fail load');
			phantom.exit();
		} else if (page.loadingProgress >=100){
			page.includeJs("http://cdn.bootcss.com/jquery/3.2.0/jquery.min.js",function(){				
			datalist = page.evaluate(function(){
			var data = [];	
				$('.c-container').each(function(index,ele){
					data[index] = {
						title: $(ele).find('.t').text() || '',
						info: $(ele).find('.c-abstract').text() || '',
						link: $(ele).find('.c-showurl').text() || '',
						pic: $(ele).find('.general_image_pic img').attr('src') || ''
					};
				});
				return data;
			});
			result = {
				code: 1,
				msg: '成功',
				keyword: keyword,
				time: Date.now() - t,
				datalist: datalist
			};
			console.log(JSON.stringify(result));
			page.render(keyword+'.png');
			phantom.exit();
			});
		}
	});
}
