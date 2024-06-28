# NodeJs Ecommerce <img width='20' align='center' src='https://i.ibb.co/7XPkx1L/nodejs.png'>

Fullstack ecommerce project, built on NodeJs

## 🔍 About the project 

- URL: [NodeJsEcommerce](https://nodejsecommerce-8f7b.onrender.com)
- Github Repository: [NodeJsEcommerce](https://github.com/escuderoemanuel/NodeJsEcommerce)
- Developer: [Emanuel Escudero](https://emanuelescudero.ar)

## ⚙️ Features

- View to register a new user account
- View to log in with an existing user account
- It is also possible to log in with a github account
- Method available to reset the password
- Accounts have a type role 'user', 'premium' or 'admin'
- All functions have authentication through jwt and cookies
- The navbar, views, and functions available depend on the type of role that the account with which the user is logged in has

### 🪪 Account with role of type 'user'

- Navbar with access to products, chat, cart, profile and exit
- In the product view, can see the data of each product and add them to the cart
- The user cannot add products without stock
- In the chat view, the user can read and send messages to other connected users in real time
- In the cart view you can see the products you have added, you can remove a product or make the purchase
- If the purchase is made, the user receives the data generated in his email account
- Cannot make a purchase from an empty cart
- In the profile view, the user can see their account information and upload files such as their profile photo and the documentation required to be a premium role user
- If the user has uploaded a profile picture, the default icon in their navbar will be replaced by that image
- Access to the logout button

### 🪪 Account with role of type 'premium'

- Navbar with access to products, products manager, chat, cart, profile and exit
- In the product view, can see the data of each product and add them to the cart
- The user cannot add products without stock
- The user cannot add products created by himself to the cart
- In the products manager view, the user can create new products that will be available to all users
- The user can only delete products created by himself
- In the chat view, the user can read and send messages to other connected users in real time
- In the cart view you can see the products you have added, you can remove a product or make the purchase
- If the purchase is made, the user receives the data generated in his email account
- Cannot make a purchase from an empty cart
- In the profile view, the user can see their account information and upload files such as their profile photo and the documentation required to be a premium role user
- If the user has uploaded a profile picture, the default icon in their navbar will be replaced by that image
- Access to the logout button

### 🪪 Account with role of type 'admin'

- Navbar with access to products, products manager, user manager, profile and exit
- In the product view, can see the data of each product, but cannot add them to the cart
- In the products manager view, the user can create new products that will be available to all users
- The user can delete products created by himself or other users
- In the users manager view the admin can change the role of a user
- The admin will only be able to change the role of 'user' to another, if that user has uploaded the required documents
- The admin will be able to delete user accounts manually
- The admin will be able to delete all inactive accounts at once
- The admin will not be able to delete his own account
- In the profile view, the user can see their account information and upload files such as their profile photo and the documentation required
- If the user has uploaded a profile picture, the default icon in their navbar will be replaced by that image
- Access to the logout button


### 📋 Technologies & Tools

- NPM https://www.npmjs.com
- NodeJs https://nodejs.org/en
- ExpressJs https://expressjs.com/es
- Handlebars https://handlebarsjs.com
- MongoDB https://www.mongodb.com/es
- Mongoose https://www.npmjs.com/package/mongoose
- JWT https://jwt.io
- NodeMailer https://www.npmjs.com/package/nodemailer
- PassportAuth https://www.passportjs.org
- BCrypt https://www.npmjs.com/package/bcrypt
- DotEnv https://www.npmjs.com/package/dotenv
- Faker https://fakerjs.dev
- Luxon https://www.npmjs.com/package/luxon
- Multer https://www.npmjs.com/package/multer
- SocketIo https://socket.io
- SwaggerJsDoc https://www.npmjs.com/package/swagger-jsdoc
- SweetAlert https://sweetalert2.github.io
- UUID https://www.npmjs.com/package/uuid
- Winston https://www.npmjs.com/package/winston
- Commander https://www.npmjs.com/package/commander
- Cors https://www.npmjs.com/package/cors
- VisualStudioCode https://code.visualstudio.com
- CSS3 https://developer.mozilla.org/en-US/docs/Web/CSS
- Javascript https://www.javascript.com
- GoogleFonts https://fonts.google.com
- Icons8 https://icons8.com

### 🚀 Execution

- Clone the repository

  `git clone https://github.com/escuderoemanuel/NodeJsEcommerce`

- Install the dependencies listed in the package.json file
  
  `npm i`

- You will need to create your own .env file in the root of the project and set your own environment variables!

- Run the project

  `npm run dev`

- In the browser, go to the following path http://localhost:8080 or the port provided by the 'npm run dev' command

- You can access the documentation for the functions from http://localhost:8080/apidocs

### 🌍 Deployment With

- Render https://render.com
