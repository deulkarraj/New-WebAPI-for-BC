const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resultParagraph = document.getElementById('result');

let recognition;

startButton.addEventListener('click', startRecognition);
stopButton.addEventListener('click', stopRecognition);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function startRecognition() {
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US'; // Set the language for recognition

        recognition.onstart = () => {
            resultParagraph.textContent = 'Listening...';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript;
            // sendToAzureSpeechService(transcript);
            resultParagraph.textContent = transcript; // Display the transcript directly
        };

        recognition.onerror = (event) => {
            console.error('Error occurred:', event.error);
        };

        recognition.start();
    } else {
        console.error('SpeechRecognition API is not supported in this browser.');
    }
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
    }
}

// function sendToAzureSpeechService(transcript) {
//     const apiKey = '30ed5e6dfb2e4239ad2ede908e996d1a'; // Replace with your actual key
//     const region = 'eastus'; // Replace with your actual region

//     const url = `https://eastus.stt.speech.microsoft.com/speech/v3.0/recognize?language=en-US`;
//     const headers = {
//         'Ocp-Apim-Subscription-Key': apiKey,
//         'Content-type': 'application/json'
//     };

//     const body = {
//         "audio": {
//             "content": transcript,
//             "format": "text/plain"
//         }
//     };

//     console.log('JSON data before sending:', body);

//     fetch(url, {
//         method: 'POST',
//         headers: headers,
//         body: JSON.stringify(body)
//     })
//     .then(response => response.json())
//     .then(data => {
//         const recognizedText = data.results[0].alternatives[0].transcript;
//         resultParagraph.textContent = recognizedText;
//     })
//     .catch(error => {
//         console.error('Error sending to Azure Speech Service:', error);
//     });
// }