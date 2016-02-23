var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST user Key */
router.post('/', function(req, res) {
	if (!req.body) {
		return res.sendStatus(400)
	}else{
		res.cookie('token', response.headers.__wcfcontext, { expires: new Date(Date.now() + 900000), httpOnly: true });
		res.cookie('ID', body.Customer.CustomerID, { expires: new Date(Date.now() + 900000), httpOnly: true });
		res.send()
	};
});

module.exports = router;
