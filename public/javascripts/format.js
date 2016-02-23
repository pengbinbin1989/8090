(function(){
	var root = this;
	var store = function(obj) {
		var store = function(obj) {
			return store.fn(obj);
		};
		store.fn = store.prototype = {
			'ajax': function(option) {
				var Ajax_msg;
				var Jsonhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
				Jsonhttp.onreadystatechange = function () {
					if (Jsonhttp.readyState == 4 && Jsonhttp.status == 200) {
						Ajax_msg = Jsonhttp.responseText;
					}
				}
				Jsonhttp.open(option.style, option.url, option.Boole);
				option.data ? Jsonhttp.setRequestHeader("Content-type", "application/json") : void(0);
				option.data ? Jsonhttp.send(JSON.stringify(option.data)) : void(0);
				Jsonhttp = null;
				return Ajax_msg;
			},
		};
		return store.fn;
	};
	root.store = store;
}).call(this);