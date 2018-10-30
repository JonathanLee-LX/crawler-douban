var express = require('express');
var doSpiderComments = require('../main.js');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.setHeader('Content-Type', 'text/html');
  res.sendfile(`./routes/index.html`);
});

router.post('/', async (req, res, next) => {
  try {
    await doSpiderComments(req.body.link, req.body.total)
    res.status(200).send({
      data: '爬取成功！'
    })
  } catch (error) {
    console.error(error)
  }
})

module.exports = router;