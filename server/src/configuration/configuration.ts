import { seconds } from "@nestjs/throttler";
import { redisUrlToOptions } from "./utils/redisUrlToOptions";

export const configuration = () => {
  const testing = process.env.NODE_ENV !== 'production';
  return ({
    server: {
      port: Number(process.env.PORT),
      UI_URL: process.env.UI_URL,
      UI_LOCAL_URL: process.env.UI_LOCAL_URL,
      COOKIE_SECRET: process.env.COOKIE_SECRET,
    },
    APP_DOMAIN: process.env.APP_DOMAIN,
    APP_ID: process.env.APP_ID,
    redis: testing ? undefined : redisUrlToOptions(process.env.REDIS_URL),
    ttl: parseInt(process.env.REDIS_CACHE_TTL, 10) * 1000,
    testing,
    throttler: {
      ttl: seconds(parseInt(process.env.THROTTLE_TTL, 10)),
      limit: parseInt(process.env.THROTTLE_LIMIT, 10),
    },
    jwt: {
      access: {
        secret: process.env.JWT_ACCESS_SECRET,
        time: parseInt(process.env.JWT_ACCESS_TIME, 10),
      },
      confirmation: {
        secret: process.env.JWT_CONFIRMATION_SECRET,
        time: parseInt(process.env.JWT_CONFIRMATION_TIME, 10),
      },
      resetPassword: {
        secret: process.env.JWT_RESET_PASSWORD_SECRET,
        time: parseInt(process.env.JWT_RESET_PASSWORD_TIME, 10),
      },
      refresh: {
        secret: process.env.JWT_REFRESH_SECRET,
        time: parseInt(process.env.JWT_REFRESH_TIME, 10),
      },
    },
  });
}
