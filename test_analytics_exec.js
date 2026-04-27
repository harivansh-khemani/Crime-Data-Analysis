const { spawn } = require('child_process');
const path = require('path');

const runTest = (script) => {
    console.log(`Running test for ${script}...`);
    const pythonProcess = spawn('python', [path.resolve(__dirname, 'ml-models', script)]);
    
    let resultData = '';
    let errorData = '';

    if (script === 'analysis.py') {
        // Feed sample data for analysis.py
        pythonProcess.stdin.write(JSON.stringify([{ lat: 28.6139, lng: 77.2090, date: '2024-01-01', type: 'Theft' }]));
        pythonProcess.stdin.end();
    }

    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      console.log(`${script} exited with code ${code}`);
      if (errorData) console.log(`Stderr: ${errorData}`);
      console.log(`Stdout: ${resultData}`);
    });
};

runTest('analysis.py');
setTimeout(() => runTest('spark_analysis.py'), 5000);
