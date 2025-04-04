# seismic

docker-compose does not yet work, but app can be built and run with

podman build -t your-angular-app .
podman run -p 4200:80 your-angular-app

app runs on http://localhost:4200/
