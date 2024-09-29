const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const utils = require('./modules/utils.js');
const lang = require('./lang/en.js');

class ServerApp {
    constructor(port) {
        this.port = port;
        this.filePath = path.join(__dirname, 'file.txt');
        this.server = http.createServer(this.handleRequest.bind(this));
    }

    // Method to handle requests based on pathname
    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        switch (pathname) {
            case '/COMP4537/labs/3/getDate/':
                this.handleGetDate(req, res, parsedUrl.query);
                break;
            case '/COMP4537/labs/3/writeFile/':
                this.handleWriteFile(req, res, parsedUrl.query);
                break;
            case `/COMP4537/labs/3/readFile/${path.basename(this.filePath)}`:
                this.handleReadFile(req, res);
                break;
            default:
                this.handleNotFound(req, res);
                break;
        }
    }

    // Method to greet the user by name and return the current date
    handleGetDate(req, res, query) {
        const name = query.name || 'Guest';
        const message = `<p style="color:blue;">${utils.getDate(name, lang.greeting)}</p>`;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(message);
    }

    // Method to append text to the file
    handleWriteFile(req, res, query) {
        const text = query.text;

        if (!text) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Error: No text to append');
        }

        fs.appendFile(this.filePath, text + '\n', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error: Could not append text to file');
            }
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(`Successfully appended "${text}" to the file.`);
        });
    }

    // Method to read and display the file content
    handleReadFile(req, res) {
        fs.readFile(this.filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    return res.end(`404 Error: File not found`);
                }
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error: Could not read file');
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    }

    // Method to handle 404 errors
    handleNotFound(req, res) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Error: Endpoint not found');
    }

    // Start the server
    start() {
        this.server.listen(this.port, () => {
            console.log(`Server running at http://localhost:${this.port}/`);
        });
    }
}

// Initialize and start the server
const app = new ServerApp(3000);
app.start();
