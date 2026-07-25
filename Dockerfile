# Plain static site — no build step, served by nginx
FROM nginx:1.27-alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
