const socket = io()

// Emit chat message with user information
const messageList = document.getElementById('message-list');
const messageuser = document.getElementById('message-user');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

//Recibe mensajes y los agregar a la lista
socket.on('newMessage', (message) => {
  console.log("Mensjae Recibido")
  const li = document.createElement('li');
  li.textContent = `${message.user}: ${message.text}`;
  if (messageList.firstChild) {
    messageList.insertBefore(li, messageList.firstChild);
  } else {
    messageList.appendChild(li);
  }
});

//Enviar mensajes al presionar botón
sendButton.addEventListener('click', (event) => {
  event.preventDefault();
  const user = messageuser.value.trim();
  const message = messageInput.value.trim();
  if (message !== '' && user !== '') {
    socket.emit('chatMessage', { text: message, user: user });
  }
});

