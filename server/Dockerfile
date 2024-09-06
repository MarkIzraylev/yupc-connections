# backend/Dockerfile

FROM python:3.10.6

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файлы зависимостей и устанавливаем их
COPY requirements.txt .
RUN pip install -r requirements.txt

# Копируем весь код приложения
COPY . .

# Запускаем сервер Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]