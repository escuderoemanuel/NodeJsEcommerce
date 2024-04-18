const socket = io();
let user;

//! Elements
const usernameFront = document.getElementById('usernameFront')
const messageInput = document.getElementById("messageInput");
const messagesLog = document.getElementById("messagesLog");

//! Events & Socket Events


///SOCKET EMIT => Enviar Usuario a Atlas
messageInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    if (messageInput.value.trim().length > 0) {
      // Send Event: user data
      socket.emit("userMessage", {
        user: user,
        message: e.target.value,
        date: new Date().toLocaleString(),

      });
      e.target.value = "";
    }
  }
})

// SOCKET ON => Recive Event: new messages
socket.on("messages", ({ messages }) => {
  if (!user) return;
  messagesLog.innerHTML = '';
  messages.forEach(message => {
    messagesLog.innerHTML += `
    <p class='messageContainer'>
    <span class='messageInfo'>${message.date} ${message.user}</span>
    
    <span class='userMessage'>${message.message}</span>
    </p>
    `;
  })
  messagesLog.scrollTop = messagesLog.scrollHeight;
})

// Socket New User Connected
socket.on("newUserConnected", ({ user }) => {
  if (!user) return;
  // Alert New User Connected
  Swal.fire({
    color: "#eee",
    text: `🔔 ${user} has joined the chat!`,
    toast: true,
    position: 'top-right',
    timer: 2000,
    background: "#222",
    confirmButtonColor: "#43c09e",
  })
})


// Login
Swal.fire({
  color: "#eee",
  background: "#222",
  radius: 2,
  title: "👋 Hey, welcome! 😉",
  text: "Enter your email 👇",
  input: "email",
  confirmButtonColor: "#43c09e",
  allowOutsideClick: false
}).then((result) => {
  user = result.value;
  usernameFront.innerHTML = `${user}`;
  socket.emit("newUser", user);
  // Send Event Auth
  socket.emit("authenticated", { user });
});


