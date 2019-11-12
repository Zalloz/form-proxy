require('newrelic');
const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

setInterval(() => {
    console.log('Ping!')
}, 25000)

const publicDirectory = path.join(__dirname, 'public');
const port = process.env.PORT || 80;

http.createServer(function (req, res) {
    if (req.method === 'GET') {
        if (req.url === '/') {
            let contentType = 'text/html';
            let extension = path.extname(req.url);
            if (extension === '.js') {
                contentType = 'text/javascript';
                hostJsOrCss();
            } else if (extension === '.css') {
                contentType = 'text/css';
                hostJsOrCss();
            } else {
                //
                //Mike first, me second
                Promise.all([axios.get('http://ec2-3-133-91-213.us-east-2.compute.amazonaws.com'), axios.get('http://ec2-3-17-68-94.us-east-2.compute.amazonaws.com/')])
                    .then(reactHtmlStrings => {
                        res.writeHead(200, {
                            'Content-Type': contentType,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "X-Requested-With"
                        });
                        const html = `
                            <!DOCTYPE html>
                            <html lang="en">
    
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <meta http-equiv="X-UA-Compatible" content="ie=edge">
                                <!-- <link href="http://localhost:8081/style.css" type="text/css" rel="stylesheet" /> -->
                                <title>Zalloz</title>
                            </head>
    
                            <body>
                                <div id="photos">${reactHtmlStrings[0].data}</div>
                                <div id="form-service">${reactHtmlStrings[1].data}</div>
                            </body>
    
                            </html>
                        `;
                        res.end(html, 'utf-8');
                    })
                    .catch(err => {
                        //
                        // console.log(err)
                    });
                //
            };
            function hostJsOrCss() {
                fs.readFile(req.url === '/' ? publicDirectory + '/index.html' : publicDirectory + req.url, (err, content) => {
                    res.writeHead(200, {
                        'Content-Type': contentType,
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "X-Requested-With"
                    });
                    res.end(content, 'utf-8');
                    return;
                });
            };
        } else if (req.url === `/loaderio-4226f44d88ed75d78799ce47575da37f/`) {
            res.end('loaderio-4226f44d88ed75d78799ce47575da37f', 'utf-8');
            // let verifyPath = path.join(__dirname, `loaderio-4226f44d88ed75d78799ce47575da37f/`);
            // fs.readFile(verifyPath, (err, verifyFile) => {
            //     return;
            // });
        };
    } else {
        res.end('Error!');
        return;
    };
}).listen(port, function () {
    console.log('Server started on port', port);
});