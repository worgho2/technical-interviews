import z from 'zod';

export default () => {
  const env = z
    .object({
      PORT: z.number({ coerce: true }).default(3000),
      REDIS_HOST: z.string(),
      REDIS_PORT: z.number({ coerce: true }),
      REDIS_USERNAME: z.string().optional(),
      REDIS_PASSWORD: z.string().optional(),
      MONGODB_URL: z.string().min(1),
    })
    .parse({ ...process.env });

  return {
    port: env.PORT,
    redis: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      username: env.REDIS_USERNAME,
      password: env.REDIS_PASSWORD,
    },
    mongo: {
      url: env.MONGODB_URL,
    },
  };
};
