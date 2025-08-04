@echo off
echo Starting Kids Fun Finder HTML Server...
echo.
echo This will serve the HTML file at http://localhost:8080/
echo This resolves CORS issues when testing the HTML directly.
echo.
echo Make sure the backend server is also running on port 3001!
echo.
node serve-html.js
pause