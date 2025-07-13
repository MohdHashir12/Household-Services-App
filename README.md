# 🛠️ Household Services App

The **Household Services App** is a full-stack web application designed to seamlessly connect customers with verified service professionals (like electricians, plumbers, etc.). It simplifies the booking, tracking, and management of household service requests for both users and service providers.

---

## 🚀 Features

- 👤 User registration with role selection (Customer or Professional)
- 📋 Customers can create and view service requests
- 🧰 Professionals can accept, reject, and track service requests
- 🔍 Admin dashboard with search functionality for users and professionals
- 📈 Daily & monthly reports via Celery background jobs
- 📊 Dashboard analytics with ChartJS
- 🖥 Responsive design for both desktop and mobile

---

## 🧱 Technologies Used

| Layer       | Stack/Tools                           |
|-------------|----------------------------------------|
| Backend     | Flask, SQLAlchemy, REST APIs           |
| Frontend    | Vue.js, HTML, CSS, Bootstrap           |
| Database    | SQLite                                 |
| Scheduling  | Celery + Redis                         |
| Caching     | Redis                                  |
| Security    | JWT for token-based authentication     |
| Docs/Charts | Flasgger (Swagger UI), ChartJS         |

---
Installation :
Clone the repository:
git clone https://github.com/MohdHashir12/Household-Services-App.git
Create a virtual environment:
python -m venv env
source env/bin/activate
Install the required packages:
pip install -r requirements.txt
Run the application
flask run
Install Redis:
https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/
Run Redis:
sudo service redis-server start
Run Celery worker in another window:
celery -A app.celery worker --loglevel=info
Run Celery beat in another window:
celery -A app.celery beat --loglevel=info


