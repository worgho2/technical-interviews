import { z } from 'zod';

const envValidation = z
  .object({
    CONSENTS_MONGODB_URI: z.string().min(1),
    CONSENTS_PROXY_TYPE: z
      .enum(['API_GATEWAY_VPC_LINK', 'APPLICATION_LOAD_BALANCER'])
      .default('APPLICATION_LOAD_BALANCER'),
  })
  .safeParse(process.env);

if (!envValidation.success) {
  throw new Error(`Environment validation error: ${JSON.stringify(envValidation.error, null, 2)}`);
}

export const env = envValidation.data;
