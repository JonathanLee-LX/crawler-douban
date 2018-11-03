const fs = require('fs')

const Json2CsvParser = require('json2csv').Parser

const chalk = require('chalk')

const fields = [
    {
        label: '用户名',
        value: 'username',
    },
    {
        label: '时间',
        value: 'time',
    },
    {
        label: '评论',
        value: 'content',
    },
    {
        label: '赞同',
        value: 'up',
    },
    {
        label: '反对',
        value: 'down',
    },
]

const short_fields = [
    {
        label: '用户名',
        value: 'username',
    },
    {
        label: '时间',
        value: 'time',
    },
    {
        label: '评论',
        value: 'content',
    },
    {
        label: '赞同',
        value: 'up',
    },
    {
        label: '推荐指数',
        value: 'rate',
    },
]

const json2csvParser =new Json2CsvParser({fields})
const short_json2csvParser =new Json2CsvParser({
    fields: short_fields
})
const path = require('path')

function requireAll(dir) {
    return new Promise((resolve, reject) => {
        fs.readdir(`./comments/${dir}/`, (err, fileList) => {
            var total = []
            fileList.forEach(file => {
                if(/\.json/.test(file)){
                    const filename = path.resolve(__dirname, `./comments/${dir}/`, file)
                    const data = require(filename)
                    data.forEach(item => {
                        total.push(item)
                    })
                }
            })
            resolve(total)
        })
    })
}

function shortToCSV(dir) {
    requireAll(dir).then(total => {
        const comments_csv = short_json2csvParser.parse(total)
        fs.writeFile(
            `./csv/${dir}.csv`,
            comments_csv,
            'utf8',
            function(err, data) {
                if(err) console.error(err)
                console.log('保存csv文件成功！')
                addBOM(`./csv/${dir}.csv`);
            })
    });
}

function toCSV(dir) {
    requireAll(dir).then(total => {
        const comments_csv = json2csvParser.parse(total)
        fs.writeFile(
            `./csv/${dir}.csv`,
            comments_csv,
            'utf8',
            function(err, data) {
                if(err) console.error(err)
                console.log('保存csv文件成功！')
                addBOM(`./csv/${dir}.csv`);
            })
    });
}

function addBOM(pathname) {
    let str = fs.readFileSync(pathname, 'utf8');
    str = '\ufeff' + str;
    fs.writeFile(pathname, str, (err, data) => {
        if(err) console.err('添加BOM头失败');
        console.log(chalk.green('添加BOM头，保存成功！'))
    })
}


module.exports = {
    toCSV,
    shortToCSV
}

