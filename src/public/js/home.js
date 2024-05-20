fetch('/api/current', {
  method: 'GET',
  headers: {
    authorization: `Bearer ${localStorage.getItem('accessToken')}`
  }
}).then(res => {
  if (res.status === 403 || res.status === 401) {
    window.location.href = '/login' // Opción a: window.replace('/login')
    localStorage.removeItem('accessToken')
  } else {
    return res.json()
  }
}).then(res => {
  const p = document.getElementById('userResult')
  p.innerHTML = `
  <div class="profile">
    <h3>Welcome 😊</h3>
    <br>
    <div class='userData'>
      {{#if res.payload}}
      <p><span>Name:</span> {{res.payload.name}}</p>
      {{/if}}
      <p><span>Email:</span> {{res.payload.email}}</p>
      {{#if user.age}}
      <p><span>Age:</span> {{ res.payload.age }}</p>
      {{/if}}
      <p><span>Role:</span> {{res.payload.role}}</p>
    </div>
    <a href="/api/sessions/logout">
      <button>Logout</button>
    </a>
    <br>
  </div>
  `
})
  .catch(err => {
    console.log(err)
  })