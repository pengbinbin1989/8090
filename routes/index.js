var express = require('express');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var userAgent = req.headers['user-agent'];
    console.log(userAgent);
    res.render('index', { 
    	'head':{
    		title: '8090\' living life',
    		link: [
    			{href:'/format.css'},
    			{href:'/home/index.css'}
    		],
    	}
    });
});


/* getWeather by latlng */
    router.post('/', function(req, res, next) {
        req.body.latlng ? getCityName(req.body.latlng,res,0) : getCityName(req.body.IP,res,1);
    });
    var def = {
        getCityNameUrl_:'http://maps.google.cn/maps/api/geocode/json?language=EN&latlng=',
        getCityNameByIPUrl_:'http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=',
        getWeather_:"http://apis.baidu.com/apistore/weatherservice/weather?citypinyin=",
        getWeatherOptions:{
            url:null,
            headers:{ apikey:'fd6b4fe2716d5647dc09b9ac034a1de1' }
        }
    };
    function getCityName(_url, res, status){
        if (status == 0) {
            request(def.getCityNameUrl_ + _url, function(error, request, body) {
                if (!error && request.statusCode == 200) {
                    typeof(body) == "string" ? body = JSON.parse(body) : void(0);
                    var address = body.results[0].formatted_address;
                    var re = /(\,\s)[\w\W][^\,]*(?=\sshi\,|\sShi\,)/;
                    var addr = re.exec(address);
                    if (addr == null) {
                        addr = address.replace(/\s/g,"").split(",");
                        getWeather(addr[addr.length - 1],res);
                    }else{
                        var cityName = addr[0].replace(", ","");
                        getWeather(cityName,res);
                    }
                };
            });
        }else if (status == 1) {
            def.getWeatherOptions.url = def.getCityNameByIPUrl_ + _url;
            request(def.getWeatherOptions, function(error, request, body) {
                if (!error && request.statusCode == 200) {
                    typeof(body) == "string" ? body = JSON.parse(body) : void(0);
                    def.getWeather_ = 'http://apis.baidu.com/apistore/weatherservice/cityname?cityname=';
                    getWeather(encodeURI(body.retData.city), res);
                }
            });
        } 
    };
        function getWeather(cityName, res){
            def.getWeatherOptions.url = def.getWeather_ + cityName;
            request(def.getWeatherOptions, function(error, request, body) {
                if (!error && request.statusCode == 200) {console.log();res.end(body);}
            });
        };
/* getWeather by latlng */

module.exports = router;
