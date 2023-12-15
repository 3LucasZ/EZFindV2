# nginx/Dockerfile

FROM nginx:1.23.3-alpine

RUN apk add --no-cache openssl 
RUN mkdir /certificates
RUN openssl req -x509 -newkey rsa:4096 -keyout /certificates/key.pem -out /certificates/cert.pem -sha256 -days 36500 -nodes -subj "/C=US/ST=CA/L=SanJose/O=ezfind/OU=ezfind/CN=localhost"

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
EXPOSE 443