const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const utils = require('./modules/utils.js');
const lang = require('./lang/en.js');

const filePath = path.join(__dirname, 'file.txt');

// Create the server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 1. Greet User by Name
    if (pathname === '/COMP4537/labs/3/getDate/') {
        const name = parsedUrl.query.name || 'Guest';
        const message = `<p style="color:blue;">${utils.getDate(name, lang.greeting)}</p>`;

        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(message);

    // 2. Append text to the file
    } else if (pathname === '/COMP4537/labs/3/writeFile/') {
        const text = parsedUrl.query.text;

        if (!text) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Error: No text to append');
        }

        fs.appendFile(filePath, text + '\n', (err) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error: Could not append text to file');
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            return res.end(`Successfully appended "${text}" to the file.`);
        });

    // 3. Read and display the file content
    } else if (pathname.startsWith('/COMP4537/labs/3/readFile/')) {
        const requestedFile = pathname.split('/').pop();

        if (requestedFile !== 'file.txt') {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            return res.end(`404 Error: File ${requestedFile} not found`);
        }

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    return res.end(`404 Error: File ${requestedFile} not found`);
                }

                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error: Could not read file');
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            return res.end(data);
        });

    // 4. Handle unknown routes
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Error: Endpoint not found');
    }
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
});