"use strict";

const fastify = require("fastify");
const fastifyJWT = require("@fastify/jwt");
const fastifyRedis = require("@fastify/redis");

const config = require("./config/env");

function buildApp() {
  const app = fastify({
    logger: {
      level: config.server.isDev ? "info" : "warn",
      transport: config.server.isDev
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
            },
          }
        : undefined,
    },
  });

  app.register(fastifyJWT, {
    secret: config.jwt.secret,
  });

  app.register(fastifyRedis, {
    url: config.redis.url,
  });

  app.get("/health", async () => {
    return {
      status: "ok",
      service: "muziloop-user-service",
      timestamp: new Date().toISOString(),
    };
  });

  // Register routes
  // app.register(require("./routes/auth.routes"), { prefix: "/api/auth" });

  return app;
}

module.exports = buildApp;
