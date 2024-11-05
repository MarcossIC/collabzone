import { Logger } from '@nestjs/common';
import cluster from 'cluster';
import os from 'os';
import { isUndefined } from './configuration/utils/validations';

export class Cluster {
  private static readonly logger = new Logger(Cluster.name);

  public static createCluster(main: () => Promise<void>): void {
    const cpuCount = Cluster.getCpuCount();

    if (cluster.isPrimary) {
      Cluster.logger.log(`Starting cluster with ${cpuCount} workers...`);
      Cluster.logger.log(
        `Master server is running on process ${process.pid}`,
      );

      for (let i = 0; i < cpuCount; i++) {
        Cluster.logger.log(`Forking process number ${i + 1}...`);
        cluster.fork();
      }

      cluster.on('exit', (worker) => {
        Cluster.logger.warn(`Worker ${worker.id} died. `);
        Cluster.logger.warn('Starting a new worker...');
        cluster.fork();
      });
    } else {
      main();
    }
  }

  private static getCpuCount(): number {
    if (!isUndefined(process.env.WORKERS_COUNT)) {
      return parseInt(process.env.WORKERS_COUNT, 10);
    }
    if (
      !isUndefined(process.env.NODE_ENV) &&
      process.env.NODE_ENV === 'production'
    ) {
      return os.cpus().length;
    }
    return 2;
  }
}