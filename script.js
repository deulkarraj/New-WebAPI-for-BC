const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resultParagraph = document.getElementById('result');
let transcript = 'Operation Unsuccessful';

let recognition;

startButton.addEventListener('click', startRecognition);
stopButton.addEventListener('click', stopRecognition);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function startRecognition() {
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            resultParagraph.textContent = 'Listening...';
        };

        recognition.onresult = (event) => {
            transcript = event.results[event.results.length - 1][0].transcript;
            resultParagraph.textContent = transcript;
        };

        recognition.onerror = (event) => {
            console.error('Error occurred:', event.error);
            resultParagraph.textContent = `Error: ${event.error}`;
        };

        recognition.start();
    } else {
        console.error('SpeechRecognition API is not supported in this browser.');
        resultParagraph.textContent = 'Speech recognition not supported in this browser';
    }
}

async function stopRecognition() {
    if (recognition) {
        recognition.stop();
        try {
            await sendDataToBusinessCentral(transcript);
            resultParagraph.textContent = 'Data sent successfully!';
        } catch (error) {
            console.error('Error sending data:', error);
            resultParagraph.textContent = `Error sending data: ${error.message}`;
        }
    }
}

async function getAccessToken() {
    try {
        const tokenEndpoint = 'https://login.microsoftonline.com/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/oauth2/v2.0/token';
        const formData = new URLSearchParams({
            client_id: 'ba95a7b7-2c93-43c6-9ba4-7370a6b9a4b6',
            client_secret: 'aTO8Q~elnCZYRRI.uFtD3DDLeM9GlzdO_POjWbKK',
            scope: 'https://api.businesscentral.dynamics.com/.default',
            grant_type: 'client_credentials'
        });

        const response = await axios.post(tokenEndpoint, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error);
        throw new Error('Failed to get access token');
    }
}

async function sendDataToBusinessCentral(data) {
    try {
        const token = await getAccessToken();
        const endpoint = 'https://api.businesscentral.dynamics.com/v2.0/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/Development/WS/CRONUS%20USA%2C%20Inc./Page/AudioToTextAPI';

        // const data = {
        //     "TranscribedText": 'transcription is successful'
        // };
        
        const response = await axios.patch(endpoint, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.status === 200) {
            console.log('Data sent successfully!');
            return response.data;
        } else {
            throw new Error(`Failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error('Error sending data to Business Central:', error);
        throw new Error('Failed to send data to Business Central');
    }
}
