chat-orders-api Assessment
===============================================

Project Overview
----------------

This project is an order creation and real-time chat application built with **NestJS** and **Socket.IO** to handle bi-directional communication between users and admins. The app leverages WebSockets for instant messaging and JWT-based authentication to authenticate users for user based roles and admins for admin based roles. It uses postgres with Prisma for the database.

Key Features
------------

### 1\. User Authentication

-   Users can create an account with their emails, name and password.
-   Users can login with their email and password.

### 2\. Admin Authentication

-   Admins can create an account with their emails, name, secretKey and password(Secret Key is required to create an admin account).
-   Admins can login with their email and password.

### 3\. Order and Chat creation

-   Authenticated Users can create orders. 
-   When they create an order a chatroom is automatically created for that order.


### 4\. Real-Time Messaging

-   Supports real-time communication between users and admins.
-   Messages are broadcast to all users in a specific chat room.
-   Users can only send messages to their created chatrooms.
-   Admins can send messages to multiple users within different chat rooms.

### 5\. Role-Based Messaging

-   **Users** are identified by `senderId`. If `senderId` is `null`, the message is from an admin.
-   **Admins** are identified by their `adminId`. If `adminId` is `null`, the message is from a user.

### 6\. WebSocket Authentication

-   WebSocket connections are secured using **JWT tokens**.
-   Users must provide a valid token to establish a WebSocket connection.
-   Invalid or expired tokens result in connection termination.

### 7\. Chat Room Management

-   Users and admins can join specific chat rooms by emitting a `join_chat` event.
-   Chat rooms are dynamically created based on `chatRoomId`.
-   Admins can close chatrooms and they must provide a summary before closing the chatroom.

### 8\. Error Handling

-   Errors during message handling or authentication trigger `error` events to notify the client.
-   Errors are returned on invalid requests.
-   Users are notified of invalid token usage or unauthorized access.

### 9\. Session Persistence

-   Users remain connected to chat rooms until they disconnect manually or their session expires.
-   Reconnection is handled gracefully.

Installation
------------

### Prerequisites

-   **Node.js** 
-   **NestJS CLI**

### Setup

```
# Clone the repository
git clone https://github.com/davidwale/checkIt-srv.git
cd checkit-assessment

# Install dependencies
npm install

# Set up environment variables
Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="postgresql://DBUSER:DBPASS@DBHOST:5432/DBNAME?schema=public"
ADMIN_SECRET_KEY=secretkey
JWT_SECRET=jwt_secret
ALLOWED_CLIENT_URL=frontend_url
JWT_EXPIRE_TIME=jwt_expiry_time


# Run the application
npm run start

```

API Endpoints
-------------

**Note:** While the main communication happens over WebSockets, there are still endpoints for sending and receiving messages.

### Auth Endpoints
-   **POST /auth/register** - Create a user account
-   **POST /auth/admin/register** - Create an admin account
-   **POST /auth/login** - Authenticate user or admin and receive JWT token.

### Order Endpoints(USER)
-   **POST /orders** - Create a new order. A chatroom is automatically created.
-   **GET /orders** - Retrieve all orders for authenticated user.
-   **GET /orders/:id** - Retrieve specific order for authenticated user.
-   **PATCH /orders/:id** - Update specific order for authenticated user.
-   **DELETE /orders/:id** - Delete specific order for authenticated user.

### Chat Endpoints(USER)
-   **POST /chat/:chatRoomId/message** - Sends a new message for user.
-   **GET /chat/:chatRoomId/message** - Get messages for chatroom.

### Chat Endpoints(ADMIN)
-   **POST /admin/chat/:chatRoomId/message** - Sends a new message for admin.
-   **GET /admin/chatrooms** - Retrieve all chat rooms.
-   **GET /admin/chatrooms/:chatRoomId** - Retrieve specific chatroom details.
-   **GET /admin/chatrooms/user/:userId** - Retrieve chatroom for specific user.
-   **PATCH /admin/chat/:chatRoomId/close** - Closes chat room. Retrieve summary for chatroom.
-   **PATCH /admin/chat/:chatRoomId/completed** - Sets order status as completed.

### Order Endpoints(ADMIN)
-   **GET /admin/orders** - Retrieve all orders.
-   **GET /admin/orders/:id** - Retrieve specific order.
-   **GET /admin/orders/user/:userId** - Retrieve order for specific user.

WebSocket Events
----------------

### Events from Client

-   **`send_message`** -- Send message to a specific chat room.
-   **`join_chat`** -- Join a specific chat room.

### Events from Server

-   **`receive_message`** -- Broadcast messages to all clients in the room.
-   **`joined_chat`** -- Notify users when they successfully join a chat room.
-   **`error`** -- Notify clients of errors during message sending or authentication.


License
-------

This project is open-source and available under the MIT License.
