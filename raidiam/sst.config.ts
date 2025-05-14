/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'raidiam-technical-task',
      removal: 'remove',
      home: 'aws',
    };
  },
  async run() {
    await import('./infra/env');
    const consents = await import('./infra/consents');

    return {
      consentsApiUrl: consents.serviceUrl,
    };
  },
});
