FROM nikolaik/python-nodejs:python3.12-nodejs18

# RUN npm install -g yarn
WORKDIR /app
ADD apiServer/requirements.txt apiServer/requirements.txt
RUN pip install -r apiServer/requirements.txt
# RUN cd client && yarn && yarn build
ADD server/package.json server/package.json
RUN cd server && yarn
RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

COPY . /app/
ADD server/.env .env
ADD start.sh /app/start.sh
RUN chmod +x /app/start.sh
RUN ls -la /app > list_app.txt
RUN echo list_app.txt
# RUN cd client && yarn && yarn build
RUN mkdir -p public/tmp
RUN echo "ls -la /app" > test.sh
RUN chmod +x test.sh
CMD ["start.sh"]