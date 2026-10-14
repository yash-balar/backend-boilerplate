# Redis setup

Redis is optional while developing the API. The Redis connection and product
cache are currently commented out, so the API can start without a Redis
container. BullMQ email queue initialization is also disabled because it
requires Redis.

## Start Redis with Docker Compose

Docker Desktop (or another Docker Engine) must be running. From the project
root, start the Redis service already defined in `docker-compose.yml`:

```powershell
docker compose up -d redis
```

Check that the container is running and responds to Redis commands:

```powershell
docker compose ps redis
docker compose exec redis redis-cli ping
```

The expected response from `redis-cli ping` is `PONG`. Redis is exposed on
`127.0.0.1:6379`, which is the address used by the application.

To view Redis logs:

```powershell
docker compose logs -f redis
```

To stop the Redis service:

```powershell
docker compose down
```

The Compose configuration uses the official Redis image and a named volume for
persistent data. No custom `docker build` command is needed.

## Run Redis without Compose

Alternatively, pull the official Redis image and start a container directly:

```powershell
docker pull redis:7-alpine
docker run --name redis-demo -d -p 6379:6379 redis:7-alpine
docker exec redis-demo redis-cli ping
```

Stop and remove this standalone container when finished:

```powershell
docker stop redis-demo
docker rm redis-demo
```

Use either the Compose service or the standalone container, not both, since
both bind to port `6379`.

## Enable Redis in the API

After Redis responds with `PONG`:

1. In `src/index.js`, uncomment the `connectRedis` import and the
   `await connectRedis()` call in `startServer`.
2. In `src/controllers/product.controller.js`, uncomment the Redis client
   import and the product cache lookup.
3. Uncomment the `emailQueue` import only when using the BullMQ email queue.
   The queue and workers in `src/queues/email.queue.js`,
   `src/config/bullMQ.js`, and `src/workers/email.worker.js` also require a
   running Redis server.
4. The rate limiter in `src/middleweres/rate.limiter.js` also requires Redis
   when it is attached to a route.

Start or restart the API with:

```powershell
npm start
```
