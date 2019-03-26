import {Network} from "./network";
import {CacheFactory} from "./cache-factory";
import {StreamHead} from "./stream-head";
import {Holder} from "./holder";
import {RequestWrapper} from "./request-wrapper";

const enum StreamType {
  HOLDER = 'holder',
  CACHE = 'cache',
  NETWORK = 'network',
  QUEUE = 'queue',
  CIRCUIT = 'circuit',
  HEAD = 'head'
}

enum ConfigurableStream {
  HOLDER = StreamType.HOLDER,
  CACHE = StreamType.CACHE
}


class StreamFactory {
  private readonly cacheFactory: CacheFactory;
  private readonly requestWrapper: RequestWrapper;

  constructor(
    cacheFactory: CacheFactory,
    requestWrapper: RequestWrapper
  ) {
    this.cacheFactory = cacheFactory;
    this.requestWrapper = requestWrapper;
  }

  create<U, T = {}>(streamType: string, configuration?: T) {
    switch (streamType) {
      case StreamType.CACHE:
        return this.cacheFactory.create(configuration as T) as unknown as U;
      case StreamType.HOLDER:
        return new Holder() as unknown as U;
      // case StreamType.CIRCUIT:
      //   throw new Error('Not implemented');
      case StreamType.NETWORK:
        return new Network(this.requestWrapper) as unknown as U;
      case StreamType.HEAD:
        return new StreamHead() as unknown as U;
      default:
        throw new Error('Unknown stream type');
    }
  }
}

export {
  ConfigurableStream,
  StreamType,
  StreamFactory
};