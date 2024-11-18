// index.js

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
            await sendDataToBusinessCentral();
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
        
        // Create form data
        const formData = new URLSearchParams();
        formData.append('client_id', 'ba95a7b7-2c93-43c6-9ba4-7370a6b9a4b6');
        formData.append('client_secret', 'aTO8Q~elnCZYRRI.uFtD3DDLeM9GlzdO_POjWbKK');
        formData.append('scope', 'https://api.businesscentral.dynamics.com/.default');
        formData.append('grant_type', 'client_credentials');

        console.log('Request body:', formData.toString()); // Debug log

        const response = await axios.post(tokenEndpoint, formData.toString(), {
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });

        console.log('Token response status:', response.status); // Debug log
        console.log('Token response headers:', response.headers); // Debug log
        
        if (!response.data.access_token) {
            throw new Error('No access token in response');
        }

        return response.data.access_token;
    } catch (error) {
        console.error('Detailed error:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
        });
        
        throw new Error(`Failed to get access token: ${error.response?.data?.error_description || error.message}`);
    }
}



// async function getAccessToken() {
//     try {
//         const tokenEndpoint = 'https://login.microsoftonline.com/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/oauth2/v2.0/token';

//         const formData = new URLSearchParams();
//         formData.append('client_id', 'ba95a7b7-2c93-43c6-9ba4-7370a6b9a4b6');
//         formData.append('client_secret', 'aTO8Q~elnCZYRRI.uFtD3DDLeM9GlzdO_POjWbKK');
//         formData.append('scope', 'api://ba95a7b7-2c93-43c6-9ba4-7370a6b9a4b6/read&write');
//         formData.append('grant_type', 'client_credentials');
//         // const formData = new URLSearchParams({
//         //     client_id: 'ba95a7b7-2c93-43c6-9ba4-7370a6b9a4b6',
//         //     client_secret: 'aTO8Q~elnCZYRRI.uFtD3DDLeM9GlzdO_POjWbKK',
//         //     scope: 'https://api.businesscentral.dynamics.com/.default',
//         //     grant_type: 'client_credentials'
//         // });

//         const response = await axios.post(tokenEndpoint, formData.toString(), {
//             headers: { 
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 'Accept': 'application/json'
//              }
//         });

//         return response.data.access_token;
//     } catch (error) {
//         console.error('Error getting access token:', error);
//         throw new Error('Failed to get access token');
//     }
// }

async function sendDataToBusinessCentral() {
    try {
        const token = await getAccessToken();
        const ID = 'CRONUS%20USA%2C%20Inc.';
        
        const endpoint = 'https://api.businesscentral.dynamics.com/v2.0/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/Development/ODataV4/Company('+ ID +')/AudioToTextAPI';

        const data = {
            TranscribedText: 'transcription is successful'
        };
        
        const response = await axios.patch(endpoint, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                // 'Access-Control-Allow-Origin': 'http://localhost:5500'
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
