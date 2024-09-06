# backend/Dockerfile

FROM python:3.10.6

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY requirements.txt .
RUN pip install -r requirements.txt

# Копируем весь код приложения
COPY . .

ARG DJANGO_SUPERUSER_USERNAME=admin
ARG DJANGO_SUPERUSER_EMAIL=admin@example.com
ARG DJANGO_SUPERUSER_PASSWORD=admin

RUN python manage.py createsuperuser --no-input || true


RUN python manage.py collectstatic --noinput

# Запускаем сервер Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]