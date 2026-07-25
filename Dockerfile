# Plain static site — no build step, served by nginx
FROM nginx:1.27-alpine
COPY . /usr/share/nginx/html

# Create a simple healthcheck endpoint
RUN echo "ok" > /usr/share/nginx/html/healthz

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]