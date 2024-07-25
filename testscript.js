const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const killPortProcess = (port) => {
    try {
        // Find the process IDs (PIDs) using netstat
        const result = execSync(`netstat -ano | findstr :${port}`).toString();
        const lines = result.split('\n');
        
        // Extract PIDs and kill the processes
        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length > 4) {
                const pid = parts[4];
                if (pid) {
                    execSync(`taskkill /F /PID ${pid}`);
                    console.log(`Killed process with PID ${pid} on port ${port}`);
                }
            }
        });
    } catch (error) {
        console.error(`No processes found on port ${port} or failed to kill processes: ${error}`);
    }
};
async function main() {
    while(true){
        let server;

        try {
            const ports = [4280, 7071, 3000];

            // Check and kill processes on each port
            ports.forEach(port => killPortProcess(port));
            // Generate website and test script
            await execSync("node C:\\Users\\t-azhiyanov\\static-web-apps-cli-sifat\\dist\\cli\\bin.js generate C:\\Users\\t-azhiyanov\\sdnff33\\sdbbl\\wwjw\\Stateful1\\workflow.json");

            // Start the local server
            execSync("npm run build", { cwd: "C:\\Users\\t-azhiyanov\\sdnff33\\static-web-app", stdio: 'inherit' });
            server = spawn("swa", ["start", "--api-location", "/Users/t-azhiyanov/sdnff33/sdbbl/wwjw"], {
                cwd: "C:\\Users\\t-azhiyanov\\sdnff33\\static-web-app",
                shell: true
            });
            //wait for swa to start
            await sleep(30000);
            
            // Run the test script
            execSync('node test_script.js', { cwd: "C:\\Users\\t-azhiyanov\\sdnff33\\static-web-app\\tests", stdio: 'inherit' });

            // Log success
            fs.appendFileSync('passing_test_results.txt', `Test passed for website generated at ${new Date().toISOString()}\n`);
            copyFileContent("C:\\Users\\t-azhiyanov\\testclisifat\\logs.txt", "passing_test_results.txt");
        } catch (error) {
            // Log failure
            console.error('Test failed:', error);
            copyFileContent("C:\\Users\\t-azhiyanov\\testclisifat\\logs.txt", "failing_test_results.txt");
        }
    }
}

main();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function copyFileContent(source, destination) {
    try {
        // Read the content from the source file
        const data = fs.readFileSync(source, 'utf8');
        
        // Write the content to the destination file
        fs.appendFileSync(destination, data);
        
        console.log(`Content from ${source} has been copied to ${destination}`);
    } catch (error) {
        console.error(`Error while copying content: ${error}`);
    }
}

