import { resultTable, writeMocks } from './features';
import type { Entry, Filter, Har, Logger } from './types';

export class HarToMocksProcess {
  public data: Entry[] = [];

  constructor(private log: Logger) {}

  /**
   * Extract `Entrys`, filter by flags and return to another process
   * @param {JSON} fileContent har as JSON
   * @param {object} filter flags
   */
  extract(fileContent: Har, filter: Filter) {
    const { method, resourceType, url } = filter;
    const { entries } = fileContent.log;
    let filtred: Entry[] = entries;

    // Filter by user input in the flow:
    if (url) {
      filtred = filtred.filter((e) => e.request.url.includes(url));
    }

    if (resourceType) {
      filtred = filtred.filter((e) => resourceType.some((rt) => rt === e._resourceType));
    }

    if (method) {
      filtred = filtred.filter((e) => method.some((m) => m === e.request.method));
    }

    // Log table with content
    this.log('\nFiltered requests:\n');
    resultTable(filtred, this.log);

    this.data = filtred;
  }

  write(targetPath: string, isDryRun = false) {
    writeMocks(targetPath, this.data, this.log, { isDryRun });
  }
}
