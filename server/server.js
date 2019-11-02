const http = require('http');
const fs = require('fs');
const path = require('path');

const publicDirectory = path.join(__dirname, 'public')

http.createServer(function (req, res) {
    if (req.method === 'GET') {
        if (req.url === '/') {
            fs.readFile(req.url === '/' ? publicDirectory + '/index.html' : publicDirectory + req.url, (err, content) => {
                let contentType = 'text/html';
                let extension = path.extname(req.url)
                if (extension === '.js') {
                    contentType = 'text/javascript'
                }
                res.writeHead(200, {
                    'Content-Type': contentType,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "X-Requested-With"
                })
                res.end(content, 'utf-8');
            })
        }
    } else {
        res.write('Error!');
        res.end();
    }
}).listen(8080, function () {
    // console.log('Server started on port 8080');
});