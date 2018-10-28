const fs = require('fs')

const Json2CsvParser = require('json2csv').Parser

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

const json2csvParser =new Json2CsvParser({fields})
const path = require('path')

function requireAll() {
    return new Promise((resolve, reject) => {
        fs.readdir('./', (err, fileList) => {
            var total = []
            fileList.forEach(file => {
                if(/comments.*\.json/.test(file)){
                    const filename = path.resolve(__dirname, file)
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

requireAll().then(total => {
    const comments_csv = json2csvParser.parse(total)
    fs.writeFile(
        './comments.csv',
        comments_csv,
        {
            encoding: 'utf8',

        },
        function(err, data) {
            if(err) console.error(err)
        })
});


// const csv =json2csvParser.parse(require('./comments.json'))

// console.log(csv)

