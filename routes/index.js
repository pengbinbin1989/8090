var express = require('express');
var request = require('request');
var cityWeatherCode = require('cityWeatherCode').China.province;
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


/* getWeather by cityCode */
/*
 * 获取设备IP、经纬度
 * 获取可查询地点的城市代码
 * 获取相关信息
*/
    router.post('/', function(req, res, next) {
        req.body.latlng ? getCityName(req.body.latlng,res,0) : getCityCode(req.body.province, req.body.cityName, req.body.district, req.body.address, res);
    });
    var def = {
        getCityNameUrl_:'http://api.map.baidu.com/geocoder?output=json&location=',
        getWeather_:"http://apis.baidu.com/apistore/weatherservice/cityname?cityname=",
        getWeatherOptions:{
            url:null,
            headers:{ apikey:'fd6b4fe2716d5647dc09b9ac034a1de1' }
        }
    };
    function getCityName(_url, res, status){
        request(def.getCityNameUrl_ + _url, function(error, request, body) {
            if (!error && request.statusCode == 200) {
                typeof(body) == "string" ? body = JSON.parse(body) : void(0);
                if (body.status == "OK") {
                    getCityCode(body.result.addressComponent.province, body.result.addressComponent.city, body.result.addressComponent.district, body.result.formatted_address, res)
                };
            };
        });
    };

    function getCityCode(province, cityName, district, address, res){
        for (var i = 0; i < cityWeatherCode.length; i++) {
            if (province.indexOf(cityWeatherCode[i].name) >= 0) {
                var city = cityWeatherCode[i].city;
                if (city.length) {
                    for (var j = 0; j < city.length; j++) {
                        if (cityName.indexOf(city[j].name) >= 0) {
                            var county = city[j].county;
                            for (var k = 0; k < county.length; k++) {
                                if (district.indexOf(county[k].name) >= 0) {
                                    res.send(JSON.stringify({"address": address ,"cityCode": county[k].code}));
                                    res.end();
                                    break;
                                }else if (k === county.length - 1) {
                                    var newCounty = county;
                                    for (var q = 0; q < district.length; q++) {
                                        (function(q){
                                            newCounty = re(newCounty,district[q]);
                                        })(q);
                                        if (newCounty.length === 1) {break};
                                    };
                                    res.send(JSON.stringify({"address": address ,"cityCode": newCounty[0].code}));
                                    res.end();
                                    function re(newarr,req) {
                                        var new_ = [];
                                        for (var l = 0; l < newarr.length; l++) {
                                            if (newarr[l].name.indexOf(req) >= 0) {
                                                new_.push(newarr[l]);
                                            }
                                        };
                                        if (new_.length === 0) {new_ = newarr;}
                                        return new_;
                                    }
                                }
                            }
                            break;
                        }
                    }
                }else{
                    var county = city.county;
                    res.send(JSON.stringify({"address": address ,"cityCode": county[0].code}));
                    res.end();
                }
                break;
            }
        }
    };
/* getWeather by latlng */

module.exports = router;
