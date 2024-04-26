const socket = io();

//! Elements
const userNameFront = document.getElementById('userNameFront')
const messageInput = document.getElementById("messageInput");
const messagesLog = document.getElementById("messagesLog");
let userName = userNameFront.innerHTML;

//! Events & Socket Events

///SOCKET EMIT => Enviar Usuario a Atlas
messageInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (messageInput.value.trim().length > 0) {
      // Send Event: user data
      socket.emit("userMessage", {
        user: userName,
        message: e.target.value,
        date: new Date().toLocaleString(),

      });
      e.target.value = "";
    }
  }
})

// SOCKET ON => Recive Event: new messages

socket.on("messages", ({ messages }) => {
  if (!userName) return;
  messagesLog.innerHTML = '';
  messages.forEach(message => {
    const messageClass = message.user === userName ? 'sentMessage' : 'receivedMessage';
    messagesLog.innerHTML += `
      <p class='messageContainer ${messageClass}'>
        <span class='messageInfo'>${message.date} ${message.user}</span>
        <span class='userMessage'>${message.message}</span>
      </p>
    `;
  });
  messagesLog.scrollTop = messagesLog.scrollHeight;
});


// Socket New User Connected
socket.on("newUserConnected", ({ userName }) => {
  if (!userName) return;
  // Alert New User Connected
  Swal.fire({
    color: "#eee",
    text: `🔔 ${userName} has joined the chat!`,
    toast: true,
    position: 'top-right',
    timer: 2000,
    background: "#222",
    confirmButtonColor: "#43c09e",
  })
})


// Login
Swal.fire({
  color: "#fff",
  background: "#43c09e",
  radius: 2,
  title: "👋 Hey, welcome to our chat! 😉",
  timer: 2000,
  showConfirmButton: false,

}).then((result) => {
  user = result.value;
  userName = `${userName}`;
  socket.emit("newUser", userName);
  // Send Event Auth
  socket.emit("authenticated", { userName });
});


