import { execSync } from 'child_process';
import { ClusterServiceArgs } from '../.sst/platform/src/components/aws';
import { env } from './env';

const vpc = new sst.aws.Vpc('ConsentsVpc');

const cluster = new sst.aws.Cluster('ConsentsCluster', {
  vpc,
});

const loadBalancer: ClusterServiceArgs['loadBalancer'] | undefined =
  env.CONSENTS_PROXY_TYPE === 'APPLICATION_LOAD_BALANCER'
    ? {
        rules: [
          { listen: '80/http', redirect: '443/https' },
          { listen: '443/https', forward: '8080/http' },
        ],
      }
    : undefined;

const createServiceContext = (context: string) => {
  execSync(`
    cd ${context}
    ./gradlew optimizedBuildNativeLayersTask
    ./gradlew generateResourcesConfigFile
    ./gradlew internalStartTestResourcesService
    ./gradlew optimizedDockerfileNative
    ./gradlew optimizedDockerPrepareContext
    mv build/docker/native-optimized/DockerfileNative build/docker/native-optimized/Dockerfile 
  `);

  return `${context}/build/docker/native-optimized`;
};

const service = cluster.addService('ConsentsService', {
  loadBalancer,
  serviceRegistry: {
    port: 8080,
  },
  image: {
    context: createServiceContext('./packages/consents'),
  },
  scaling: {
    min: 1,
    max: 4,
    cpuUtilization: 80,
    memoryUtilization: 80,
  },
  environment: {
    MONGODB_URI: env.CONSENTS_MONGODB_URI,
  },
});

let apiGatewayV2: sst.aws.ApiGatewayV2 | undefined;

if (env.CONSENTS_PROXY_TYPE === 'API_GATEWAY_VPC_LINK') {
  apiGatewayV2 = new sst.aws.ApiGatewayV2('ConsentsApiGatewayV2', {
    vpc,
    cors: true,
  });

  apiGatewayV2.routePrivate('$default', service.nodes.cloudmapService.arn);
}

const serviceUrl = apiGatewayV2?.url ?? service.url;

export { vpc, cluster, service, apiGatewayV2, serviceUrl };
