const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    serveStatFile(res, "public/index.html", "text/html");
  } else if (req.url === "/questions") {
    fs.readFile(path.join(__dirname, "questions.json"), "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to load questions" }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(data);
      }
    });
  } else {
    serveStatFile(res, `public${req.url}`, getcontentType(req.url));
  }
});

function serveStatFile(res, filePath, contentType) {
  fs.readFile(path.join(__dirname, filePath), (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 - File Not Found");
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
}

function getcontentType(url) {
  const ext = path.extname(url);
  switch (ext) {
    case ".css":
      return "text/css";
    case ".js":
      return "application/javascript";
    case ".json":
      return "application/json";
    default:
      return "text/html";
  }
}

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
