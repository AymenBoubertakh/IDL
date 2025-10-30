# Course Service - Campus Student Management System

Django-based microservice for managing courses and student enrollments.

## Features

- ✅ Add, update, delete courses
- ✅ List all available courses
- ✅ Associate students with courses
- ✅ Manage course schedules
- ✅ Search courses by name, instructor, or category
- ✅ RESTful API endpoints
- ✅ PostgreSQL database

## Tech Stack

- **Framework**: Django 4.2.7
- **API**: Django REST Framework 3.14.0
- **Database**: PostgreSQL
- **Language**: Python 3.x

## Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

## Installation & Setup

### 1. Clone the repository (when ready)
```bash
git clone <repository-url>
cd course-service
```

### 2. Create a virtual environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Create PostgreSQL database
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE course_db;

# Exit PostgreSQL
\q
```

### 5. Configure environment variables
Create a `.env` file in the root directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DB_NAME=course_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
```

### 6. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Create superuser (optional)
```bash
python manage.py createsuperuser
```

### 8. Run the development server
```bash
python manage.py runserver
```

The service will be available at: `http://localhost:8000`

## API Endpoints

### Course Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses/` | List all courses |
| POST | `/api/courses/` | Create a new course |
| GET | `/api/courses/{id}/` | Get course details |
| PUT | `/api/courses/{id}/` | Update a course |
| PATCH | `/api/courses/{id}/` | Partially update a course |
| DELETE | `/api/courses/{id}/` | Delete a course |
| GET | `/api/courses/search/` | Search courses |
| POST | `/api/courses/{id}/enroll_student/` | Enroll a student |
| DELETE | `/api/courses/{id}/unenroll_student/` | Unenroll a student |
| GET | `/api/courses/{id}/students/` | Get enrolled students |

### Enrollment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/enrollments/` | List all enrollments |
| GET | `/api/enrollments/{id}/` | Get enrollment details |
| GET | `/api/enrollments/by_student/?student_id=123` | Get courses for a student |

## API Usage Examples

### 1. Create a Course
```bash
curl -X POST http://localhost:8000/api/courses/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Introduction to Python",
    "instructor": "Dr. Smith",
    "category": "Programming",
    "schedule": "Monday & Wednesday, 10:00 AM - 12:00 PM"
  }'
```

### 2. Search Courses
```bash
# Search by name
curl "http://localhost:8000/api/courses/?name=Python"

# Search by instructor
curl "http://localhost:8000/api/courses/?instructor=Smith"

# Search by category
curl "http://localhost:8000/api/courses/?category=Programming"

# General search
curl "http://localhost:8000/api/courses/?search=Python"
```

### 3. Enroll a Student
```bash
curl -X POST http://localhost:8000/api/courses/1/enroll_student/ \
  -H "Content-Type: application/json" \
  -d '{"student_id": 123}'
```

### 4. Get Students in a Course
```bash
curl http://localhost:8000/api/courses/1/students/
```

### 5. Get Courses for a Student
```bash
curl "http://localhost:8000/api/enrollments/by_student/?student_id=123"
```

## Database Schema

### Course Table
```sql
- id (Primary Key)
- name (VARCHAR)
- instructor (VARCHAR)
- category (VARCHAR)
- schedule (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### StudentCourse Table
```sql
- id (Primary Key)
- student_id (INTEGER) - References Student Service
- course_id (Foreign Key -> Course)
- enrolled_at (TIMESTAMP)
- UNIQUE(student_id, course_id)
```

## Project Structure
```
course-service/
├── course_service/          # Django project settings
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── courses/                 # Main app
│   ├── models.py           # Database models
│   ├── serializers.py      # API serializers
│   ├── views.py            # API views
│   ├── urls.py             # URL routing
│   └── admin.py            # Admin interface
├── requirements.txt
├── manage.py
├── .env                    # Environment variables
└── README.md
```

## Testing

Access the browsable API at: `http://localhost:8000/api/courses/`

Access Django admin at: `http://localhost:8000/admin/`

## Future Enhancements

- [ ] GraphQL integration
- [ ] Unit tests
- [ ] Docker containerization
- [ ] API Gateway integration
- [ ] Enhanced search with filters
- [ ] Course prerequisites
- [ ] Course capacity limits

## Contributing

This is a mini-project for learning microservices architecture.

## License

MIT License