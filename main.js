var http = require('http'),
    https = require('https'),
    cheerio = require('cheerio'),
    path = require('path'),
    fs = require('fs');

var opt = {
    hostname: 'movie.douban.com',
    path: '/top250',
    port: 80
};

function spiderMovie(index) {
    // https.get('https://movie.douban.com/top250?start=' + index, function (res) {
    https.get('https://movie.douban.com/subject/1292052/reviews', function (res) {
        var pageSize = 25;
        var html = '';
        var movies = [];
        var comments = [];
        res.setEncoding('utf-8');
        res.on('data', function (chunk) {
            html += chunk;
        });
        res.on('end', function () {
            var $ = cheerio.load(html);
            // $('.item').each(function () {
            //     var picUrl = $('.pic img', this).attr('src');
            //     var movie = {
            //         title: $('.title', this).text(),
            //         star: $('.info .star .rating_num', this).text(),
            //         link: $('a', this).attr('href'),
            //         picUrl: picUrl,
            //         desc: $('.quote .inq', this).text().trim(),
            //         creator: $('.info .bd p', this).text().trim(),
            //     };
            //     if (movie) {
            //         movies.push(movie);
            //     }
            //     downloadImg('./img/', movie.picUrl);
            // });
            // console.log(html)
            $('.review-item').each(function() {
                var comment = {
                    username: $('.main-hd .name', this).text().trim(),
                    time: $('.main-meta', this).text().trim(),
                    content: $('.review-short .short-content', this).text().trim(),
                    up: $('.main-bd .up span', this).text().trim(),
                    down: $('.main-bd .down span', this).text().trim(),
                    rate: $('.main-bd .main-title-rating', this).attr('title')
                }
                console.log($('.main-hd .name', this).text())
                if(comment){
                    comments.push(comment)
                }
            })
            // saveData('./data' + (index / pageSize) + '.json', movies);
            saveData('./comments.json', comments);
        });
    }).on('error', function (err) {
        console.log(err);
    });
}

function spiderComments(index) {
        https.get(`https://movie.douban.com/subject/1292052/reviews?start=${index}`, function (res) {
            var html = '';
            var pageSize = 20;
            var comments = [];
            res.setEncoding('utf-8');
            res.on('data', function (chunk) {
                html += chunk;
            });
            res.on('end', function () {
                var $ = cheerio.load(html);
                $('.review-item').each(function () {
                    var comment = {
                        username: $('.main-hd .name', this).text().trim(),
                        time: $('.main-meta', this).text().trim(),
                        content: $('.review-short .short-content', this).text().trim(),
                        up: $('.main-bd .up span', this).text().trim(),
                        down: $('.main-bd .down span', this).text().trim(),
                        rate: $('.main-bd .main-title-rating', this).attr('title')
                    }
                    if (comment) {
                        comments.push(comment)
                    }
                })
                saveData(`./comments${index/pageSize}.json`, comments);
            });
        }).on('error', function (err) {
            console.log(err);
        });
}

/*下载图片
* @param { string } imgDir 存放图片的文件夹 * @param { string } url 图片的URL地址
*/
function downloadImg(imgDir, url) {
    https.get(url, function (res) {
        var data = '';
        res.setEncoding('binary');
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            fs.writeFile(imgDir + path.basename(url), data, 'binary', function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log('Image downloaded: ', path.basename(url));
            });
        });
    }).on('error', function (err) {
        console.log(err);
    });
}

/* 保存数据到本地 *
 * @param { string } path 保存数据的文件夹
 * @param { array } movies 电影信息数组
*/
function saveData(path, movies) {
    console.log(movies);
    fs.writeFile(path, JSON.stringify(movies, null, ' '), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('Data saved');
    });
}

// spiderMovie()
spiderComments()

function* doSpiderComments(total) {
    var start = 0;
    console.log(start + '---------------------------');

    while(start < total) {
        yield start
        spiderComments(start);
        start += 20;
    }
}

for(var x of doSpiderComments(1000)) {
    console.log(x);
}

// function doSpider(x) {
//     var start = 0;
//     console.log(start + ' -------------------------------');
//     while (start < x) {
//         spiderMovie(start);
//         start += 25;
//     }
// }

// doSpider(250)

// for (var x of doSpider(250)) {
//     console.log(x);
// }