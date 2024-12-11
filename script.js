// // index.js
// Step 1: Configure MSAL.js

// const msalConfig = {
//     auth: {
//         clientId: 'ba95a7b7-2c93-43c6-9ba4-7370a6b9a4b6', // Replace with your app's client ID
//         authority: 'https://login.microsoftonline.com/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54', // Replace with your tenant ID or common
//         redirectUri: 'https://deulkarraj.github.io/New-WebAPI-for-BC/'     
//     }
// };

// // Step 2: Create an instance of PublicClientApplication
// const msalInstance = new msal.PublicClientApplication(msalConfig);

// // Step 3: Define login request
// const loginRequest = {
//     scopes: ['https://api.businesscentral.dynamics.com/.default'] // Replace with your API scope
// };

// // Step 4: Add authentication and token retrieval logic
// async function authenticateAndGetToken() {
//     try {
//         // Check if the user is already logged in
//         const accounts = msalInstance.getAllAccounts();
//         let accessToken = '';

//         if (accounts.length > 0) {
//             // Attempt to acquire token silently
//             const silentRequest = {
//                 account: accounts[0],
//                 scopes: loginRequest.scopes
//             };
//             const silentResult = await msalInstance.acquireTokenSilent(silentRequest);
//             accessToken = silentResult.accessToken;
//         } else {
//             // Prompt for login and acquire token
//             const loginResponse = await msalInstance.loginPopup(loginRequest);
//             const tokenRequest = {
//                 account: loginResponse.account,
//                 scopes: loginRequest.scopes
//             };
//             const tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
//             accessToken = tokenResponse.accessToken;
//         }

//         console.log('Access token retrieved:', accessToken);
//         return accessToken;

//     } catch (error) {
//         console.error('Error during authentication/token acquisition:', error);
//         throw new Error(`Failed to get access token: ${error.message}`);
//     }
// }

// // Step 5: Modify the function to send data to Business Central
// async function sendDataToBusinessCentral(transcript) {
//     try {
//         const token = await authenticateAndGetToken();
        
//         // const endpoint = `https://api.businesscentral.dynamics.com/v2.0/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/Development2/ODataV4/Company('CRONUS%20USA%2C%20Inc.')/audioTranscription`;
//         const endpoint = `https://api.businesscentral.dynamics.com/v2.0/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/Development/ODataV4/Company('CRONUS%20USA%2C%20Inc.')/AudioToTextAPI`;

        
//         const data = {
//             TranscribedText: transcript
//         };

//         const response = await axios.post(endpoint, data, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//                 'Accept': 'application/json',
//                 // 'Access-Control-Allow-Origin': '*'
//             }
//         });

//         if (response.status === 201) {
//             console.log('Data sent successfully!');
//             return response.data;
//         } else {
//             throw new Error(`Failed with status: ${response.status}`);
//         }
//     } catch (error) {
//         console.error('Error sending data to Business Central:', error);
//         throw new Error('Failed to send data to Business Central');
//     }
// }

// // Existing functions for handling SpeechRecognition remain unchanged
// const startButton = document.getElementById('startButton');
// const stopButton = document.getElementById('stopButton');
// const resultParagraph = document.getElementById('result');
// let recognition;
// let transcript = '';

// startButton.addEventListener('click', startRecognition);
// stopButton.addEventListener('click', stopRecognition);

// const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

// function startRecognition() {
//     if (SpeechRecognition) {
//         resultParagraph.textContent = 'Listening...recognition started';
//         recognition = new SpeechRecognition();
//         recognition.lang = 'en-US';
//         //testing
// resultParagraph.textContent = 'Listening...1111';
//         recognition.onstart = () => {
//             resultParagraph.textContent = 'Listening...';
//         };

//         recognition.onresult = (event) => {
//             transcript = event.results[event.results.length - 1][0].transcript;
//             resultParagraph.textContent = transcript;
//         };

//         recognition.onerror = (event) => {
//             console.error('Error occurred:', event.error);
//             resultParagraph.textContent = `Error: ${event.error}`;
//             // transcript = 'this is not working';
//             // resultParagraph.textContent = `this is not working`;
//         };

//         recognition.start();
//     } else {
//         console.error('SpeechRecognition API is not supported in this browser.');
//         resultParagraph.textContent = 'Speech recognition not supported in this browser';
//     }
// }

// const urlParams = new URLSearchParams(window.location.search);
// const redirectUrl = urlParams.get('redirectUrl');

// async function stopRecognition() {
//     if (recognition) {
//         recognition.stop();
//         try {
//             await sendDataToBusinessCentral(transcript);
//             resultParagraph.textContent = 'Data sent successfully!';
            
//             if (redirectUrl) {
//                 window.location.href = redirectUrl;  // Redirect back to the original page
//             } else {
//                 console.error('No redirect URL provided.');
//             }
//         } catch (error) {
//             console.error('Error sending data:', error);
//             resultParagraph.textContent = `Error sending data: ${error.message}`;
//         }
//     }
// }




// Modal opening and closing logic
function openModal(url) {
    document.getElementById('iframe').src = url; // Set iframe src to your third-party app URL
    document.getElementById('modal').style.display = "block"; // Show the modal
}

function closeModal() {
    document.getElementById('modal').style.display = "none"; // Hide the modal
}

document.getElementById('close').onclick = function() {
    closeModal();
}

// MSAL and other logic goes here...

const msalConfig = {
    auth: {
        clientId: 'ba95a7b7-2c93-43c6-9ba4-7370a6b9a4b6', // Replace with your app's client ID
        authority: 'https://login.microsoftonline.com/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54', // Replace with your tenant ID or common
        redirectUri: 'https://deulkarraj.github.io/New-WebAPI-for-BC/'     
    }
};

// Step 2: Create an instance of PublicClientApplication
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Step 3: Define login request
const loginRequest = {
    scopes: ['https://api.businesscentral.dynamics.com/.default'] // Replace with your API scope
};

// Step 4: Add authentication and token retrieval logic
async function authenticateAndGetToken() {
    try {
        // Check if the user is already logged in
        const accounts = msalInstance.getAllAccounts();
        let accessToken = '';

        if (accounts.length > 0) {
            // Attempt to acquire token silently
            const silentRequest = {
                account: accounts[0],
                scopes: loginRequest.scopes
            };
            const silentResult = await msalInstance.acquireTokenSilent(silentRequest);
            accessToken = silentResult.accessToken;
        } else {
            // Prompt for login and acquire token
            const loginResponse = await msalInstance.loginPopup(loginRequest);
            const tokenRequest = {
                account: loginResponse.account,
                scopes: loginRequest.scopes
            };
            const tokenResponse = await msalInstance.acquireTokenSilent(tokenRequest);
            accessToken = tokenResponse.accessToken;
        }

        console.log('Access token retrieved:', accessToken);
        return accessToken;

    } catch (error) {
        console.error('Error during authentication/token acquisition:', error);
        throw new Error(`Failed to get access token: ${error.message}`);
    }
}

// Step 5: Modify the function to send data to Business Central
async function sendDataToBusinessCentral(transcript) {
    try {
        const token = await authenticateAndGetToken();
        
        const endpoint = `https://api.businesscentral.dynamics.com/v2.0/12ee7ca7-ad23-44b5-afa6-4f2a2cbdea54/Development/ODataV4/Company('CRONUS%20USA%2C%20Inc.')/AudioToTextAPI`;

        const data = {
            TranscribedText: transcript
        };

        const response = await axios.post(endpoint, data, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        if (response.status === 201) {
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

// Existing functions for handling SpeechRecognition remain unchanged
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const resultParagraph = document.getElementById('result');
let recognition;
let transcript = '';

startButton.addEventListener('click', startRecognition);
stopButton.addEventListener('click', stopRecognition);

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function startRecognition() {
    if (SpeechRecognition) {
        resultParagraph.textContent = 'Listening...recognition started';
        recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        
        resultParagraph.textContent = 'Listening...1111';
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

const urlParams = new URLSearchParams(window.location.search);
const redirectUrl = urlParams.get('redirectUrl');

// Modify the stopRecognition function to open the modal
async function stopRecognition() {
    if (recognition) {
        recognition.stop();
        try {
            await sendDataToBusinessCentral(transcript);
            resultParagraph.textContent = 'Data sent successfully!';

            // Now trigger the modal with the third-party app URL
            const thirdPartyUrl = 'https://deulkarraj.github.io/New-WebAPI-for-BC/'; // Replace with your third-party app URL
            openModal(thirdPartyUrl);
        } catch (error) {
            console.error('Error sending data:', error);
            resultParagraph.textContent = `Error sending data: ${error.message}`;
        }
    }
}

