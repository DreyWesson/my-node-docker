### Dockerfile

1.  Create a Dockerfile and .dockerignore file

2.  Set up Dockerfile

3.  Build the image `docker build -t my-image .`
    _NB: To delete an image `docker rmi my-image`, to clean up images `docker image prune` and `docker image ls` to list images._

4.  Run the image on a container `docker run -p port:port -d --name name-d-container my-image`
    _NB: To delete a container and unnecessary volume build `docker rm -fv container-name`. If you're using docker-compose then you need to use `docker-compose down -v`_

5.  Run a command inside the container `docker exec -it container-name bash`

6.  Set up hot-reload using volume
    `docker run -p port:port -v /app/node_modules -v $(pwd):/app -d --name name-d-container my-image`

7.  Prevent docker from making changes to our source code: then add ro(read only) to the volume
    `docker run -p port:port -v /app/node_modules -v $(pwd):/app:ro -d --name name-d-container my-image`

8.  To set up environment variables add --env flag
    `docker run -v /app/node_modules -v $(pwd):/app:ro --env PORT=4000 -p 3000:4000 -d --name node-docker-container node-image`

NB: To be sure env variables are set in the container `docker exec -it node-docker-container bash` and enter `printenv`
NB: To set env variables from a .env file use --env-file flag `docker run -v /app/node_modules -v $(pwd):/app:ro --env-file ./.env -p 3000:4000 -d --name node-docker-container node-image`

9. Delete the enormous amount of volume created by docker
   a. always add `-v` flag to `docker rm image-name -fv`
   b. docker volume prune

10. To reduce the long list of command we need to use Docker compose

### Docker compose

1.  Docker-compose up `docker-compose up -d` to enforce a rebuild of the image `docker-compose up -d --build`

2.  Docker-compose down `docker-compose down -v` to stop and remove the containers

### Production vs Development

1.  Create 3 docker-compose files: docker-compose.prod.yml,docker-compose.dev.yml and docker-compose.yml
    NB: the docker-compose.yml will contain shared config
2.  To run the base docker-compose file and then dev: `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d` OR `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build` to enforce rebuild.

3.  To take it down `docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v`

#### Removing devDependencies from our production build add

1. Add

```bash
    ARG NODE_ENV
    RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi
```

2. Then pass the value of the ARG into the docker-compose\* files
3. Use docker exec to investigate if devDependencies are installed:
   `docker exec -it container-name bash`, `cd node_modules` and `ls`. Also, while here u can `printenv` to check the NODE_ENV.

### Persisting our database when you docker-compose down

1. Create a named volume rather than anonymous volume so as to recognize which volume is your database: In mongo service add

```
    volumes:
        name_db_volume:/data/db
```

2. Declare all our named volume

```
    volumes:
        name_db_volume:
```

3. At this point we cannot afford to use the `-v` flag when we docker-compose down, because it will del both our named and anonymous volumes. So we remove the -v flag:
   `docker-compose -f docker-compose.yml -f docker-compose.dev.yml down`
   Then, start up docker `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d` and use `docker volume prune` to remove all inactive volume
4. (This 1st method is sloppy)To get the IP-ADDRESS of a docker container, you'll use `docker inspect <container_name>` and paste in the mongoose connection URL.
   (Better method)=>We use our service name (in this case mongo) to get the IP-ADDRESS using `docker network ls`
5. Check if the Database is connected, Server status etc by using `docker logs <node-app_container-name>` and if you want to wait on some connections add `-f` flag: `docker logs <node-app_container-name> -f`.
6. To inspect the network of a particular container:
   `docker network inspect node-docker_default`

### Setting order of container startup

1. We use the `depends_on` flag to set the order of container startup.
2. Then, u can implement a logic in ur app to handle d scenario

### Starting just a particular service

By adding `--no-deps` flag:
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --no-deps service_name`

3. Now to add 2 instances of our app use the `--scale` flag:
   `docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d --scale node-image=#2_or_num_to_spin-up`. Then, use `docker ps` to see the number of containers. And use `docker logs...-f` and `docker exec...sh` to check if the containers are running.

### Going to production
