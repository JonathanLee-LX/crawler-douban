var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.setHeader('Content-Type', 'text/html');
  res.sendfile(`./routes/index.html`);
});

router.post('/', (req, res, next) => {
  res.status(200).send(req.params)
})

module.exports = router;