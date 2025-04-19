
document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const messagesContainer = document.getElementById('messages');
    const statusIndicator = document.getElementById('status');

    let ws = null;

    function connectWebSocket() {
        ws = new WebSocket('ws://' + window.location.host);
        
        ws.onopen = () => {
            statusIndicator.textContent = 'Connected';
            statusIndicator.classList.add('connected');
        };

        ws.onclose = () => {
            statusIndicator.textContent = 'Disconnected';
            statusIndicator.classList.remove('connected');
            setTimeout(connectWebSocket, 2000);
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            displayMessage(message, 'received');
        };
    }

    function sendMessage() {
        const text = messageInput.value.trim();
        if (text && ws && ws.readyState === WebSocket.OPEN) {
            const message = {
                text,
                timestamp: new Date().toISOString()
            };
            ws.send(JSON.stringify(message));
            displayMessage(message, 'sent');
            messageInput.value = '';
        }
    }

    function displayMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = message.text;
        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    connectWebSocket();
});
