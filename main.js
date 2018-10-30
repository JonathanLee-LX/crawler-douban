var http = require('http'),
    https = require('https'),
    cheerio = require('cheerio'),
    path = require('path'),
    fs = require('fs');
    toCSV = require('./toCSV')

var opt = {
    hostname: 'movie.douban.com',
    path: '/top250',
    port: 80
};

var page = 1
function spiderComments(url, index) {
    return new Promise((resolve, reject) => {
        https.get(`${url}?start=${index}`, function (res) {
            var html = '';
            var pageSize = 20;
            var comments = [];
            res.setEncoding('utf-8');
            res.on('data', function (chunk) {
                html += chunk;
            });
            res.on('end', function () {
                var $ = cheerio.load(html);
                var title = $('#content h1').text().trim()
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
                saveData(`./comments/${title}/`, `${page}.json`, comments);
                page++
                resolve(title)
            });
        }).on('error', function (err) {
            console.log(err);
            reject()
        });
    })
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
 * @param { string } filename 保存数据的文件夹
 * @param { array } movies 电影信息数组
*/
function saveData(dir, filename, movies) {
    if (!isExistDir(dir)) {
        mkdir(dir)
        console.log(`成功创建${dir}`)
    }
    const absPath = path.resolve(dir, filename)
    const content = JSON.stringify(movies, null, ' ')
    fs.writeFile(absPath, content, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('Data saved');
    });
}

/**
 *判断dir是否有效
 *
 * @param {*} dir目录路径
 * @returns 目录是否有效
 */
function isExistDir(dir) {
    try {
        fs.accessSync(dir)
    } catch (error) {
        console.log(`${dir}不是有效的路径`)
        return false
    }
    return true
}

function mkdir(dir) {
    try {
        fs.mkdirSync(dir)
    } catch (error) {
        return false
    }
    return true
}

// spiderMovie()
spiderComments()

async function doSpiderComments(url, total) {
    var rest = total
    var pageSize = 20
    var start = 0
    var dir
    while(rest) {
        try {
            dir = await spiderComments(url, start)
            rest -= pageSize
            start += pageSize
        } catch (error) {
            console('failed...')
        }
    }
    toCSV(dir)
}

// doSpiderComments(40)

module.exports = doSpiderComments