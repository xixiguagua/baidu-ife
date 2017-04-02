
var page = require('webpage').create();
var system = require('system');
var keyword = '';
var t = Date.now();
var url = '';
var datalist = [];
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
		} else {
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
