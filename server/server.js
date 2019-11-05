const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios')

const publicDirectory = path.join(__dirname, 'public')

http.createServer(function (req, res) {
    if (req.method === 'GET') {
        if (req.url === '/') {
            let contentType = 'text/html';
            let extension = path.extname(req.url)
            if (extension === '.js') {
                contentType = 'text/javascript'
                hostJsOrCss()
            } else if (extension === '.css') {
                contentType = 'text/css'
                hostJsOrCss()
            } else {
                axios.get('http://localhost:8081/').then(reactFormHtmlString => {
                    reactFormHtmlString = reactFormHtmlString.data
                    axios.get('http://localhost:8082/').then(reactPhotosHtmlString => {
                        reactPhotosHtmlString = reactPhotosHtmlString.data
                        res.writeHead(200, {
                            'Content-Type': contentType,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "X-Requested-With"
                        })
                        const html = `
                            <!DOCTYPE html>
                            <html lang="en">
    
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                                <link href="http://localhost:8081/style.css" type="text/css" rel="stylesheet" />
                                <title>Zalloz</title>
                            </head>
    
                            <body>
                                <div id="photos">${reactPhotosHtmlString}</div>
                                <div id="form-service">${reactFormHtmlString}</div>
                            </body>
    
                            </html>
                        `
                        res.end(html, 'utf-8')
                    })
                })
            }
            function hostJsOrCss() {
                fs.readFile(req.url === '/' ? publicDirectory + '/index.html' : publicDirectory + req.url, (err, content) => {
                    res.writeHead(200, {
                        'Content-Type': contentType,
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "X-Requested-With"
                    })
                    res.end(content, 'utf-8');
                })
            }
        }
    } else {
        res.write('Error!');
        res.end();
    }
}).listen(8080, function () {
    // console.log('Server started on port 8080');
});