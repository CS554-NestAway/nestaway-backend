FROM node:20

WORKDIR /app


ARG COOKIESECRET
ENV COOKIESECRET=${COOKIESECRET}

ARG DBNAME
ENV DBNAME=${DBNAME}

ARG FIREBASEAPIKEY
ENV FIREBASEAPIKEY=${FIREBASEAPIKEY}

ARG FIREBASEAPPID
ENV FIREBASEAPPID=${FIREBASEAPPID}

ARG FIREBASEAUTHDOMAIN
ENV FIREBASEAUTHDOMAIN=${FIREBASEAUTHDOMAIN}

ARG FIREBASEMESSAGINGSENDERID
ENV FIREBASEMESSAGINGSENDERID=${FIREBASEMESSAGINGSENDERID}

ARG FIREBASEPROJECTID
ENV FIREBASEAPIKEY=${FIREBASEPROJECTID}

ARG FIREBASESTORAGEBUCKET
ENV FIREBASESTORAGEBUCKET=${FIREBASESTORAGEBUCKET}

ARG MONGOSERVERURL
ENV MONGOSERVERURL=${MONGOSERVERURL}

ARG PORT=3000
ENV PORT=${PORT}

ARG VITE_BASE_URL
ENV VITE_BASE_URL=${VITE_BASE_URL}


COPY package.json ./
# COPY package-lock.json ./
RUN npm install

COPY . .

CMD ["npm", "start"]

EXPOSE ${PORT}
