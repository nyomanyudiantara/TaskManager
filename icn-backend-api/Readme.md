
1\. Database Setup
------------------

1.  Create a MySQL database named `task_manager`.

2.  Execute the following SQL to set up your tables:

SQL

```
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  token VARCHAR(255)
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255),
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

```

2\. Backend Setup
-----------------

1.  Navigate to the backend directory.

2.  Create a `.env` file using the template below.

3.  Install dependencies and start the server:

Bash

```
npm install
node index.js

```

3\. Frontend Setup
------------------

1.  Navigate to the frontend directory.

2.  Install dependencies and start the dev server:

Bash

```
npm install
npm run dev

```

* * * * *

🌐 API Documentation
--------------------

| **Method** | **Endpoint** | **Description** |
| --- | --- | --- |
| **POST** | `/users` | Register a new user |
| **POST** | `/users/login` | Authenticate and receive a token |
| **GET** | `/tasks/my-tasks` | Get user-specific tasks |
| **POST** | `/tasks` | Create a new task |
| **PUT** | `/tasks/:id` | Update an existing task |
| **DELETE** | `/tasks/:id` | Remove a task |

> **Note:** All task endpoints require the header: `Authorization: Bearer <your_token>`

Request/Response Example (`POST /users/login`)
----------------------------------------------

**Request Body:**

JSON

```
{
  "email": "user@example.com",
  "password": "password123"
}

```

**Response (200 OK):**

JSON

```
{
  "token": "0fbb9555-9d94-48c7-9e57-a21406cd5385"
}

```

* * * * *

🔐 Environment Variables (`.env.example`)
-----------------------------------------

Create a `.env` file in the backend root with these keys:

Code snippet

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=task_manager
PORT=3000

```