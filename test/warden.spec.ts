import "reflect-metadata";

import {expect} from "chai";
import sinon, {SinonMock} from "sinon";
import {Warden} from "../src/warden";
import {CacheFactory} from "../src/cache-factory";
import {RequestManager, RequestOptions, RouteConfiguration} from "../src/request-manager";
import {Tokenizer} from "../src/tokenizer";
import {StreamFactory} from "../src/stream-factory";
import faker from "faker";
import {RequestWrapper} from "../src/request-wrapper";

const sandbox = sinon.createSandbox();

const tokenizer = new Tokenizer();
const requestWrapper = new RequestWrapper();
const cacheFactory = new CacheFactory();
const streamFactory = new StreamFactory(cacheFactory, requestWrapper);
const requestManager = new RequestManager(streamFactory, tokenizer);


let requestWrapperMock: SinonMock;
let requestManagerMock: SinonMock;

describe("[warden.ts]", () => {
  beforeEach(() => {
    requestWrapperMock = sandbox.mock(requestWrapper);
    requestManagerMock = sandbox.mock(requestManager);
  });

  afterEach(() => {
    sandbox.verifyAndRestore();
  });

  it("should create new Warden instance", () => {
    // Arrange
    const warden = new Warden(requestManager, requestWrapper);

    // Assert
    expect(warden).to.be.instanceOf(Warden);
  });

  it("should call handle on new request", () => {
    // Arrange
    const routeName = faker.random.word();
    const requestOptions = {} as RequestOptions;
    const callback = sandbox.stub();
    const warden = new Warden(requestManager, requestWrapper);
    requestManagerMock
      .expects('handle')
      .withExactArgs(routeName, requestOptions, callback);

    // Act
    warden.request(routeName, requestOptions, callback);
  });

  it("should register new route calling request manager", () => {
    // Arrange
    const routeName = faker.random.word();
    const routeOptions = {} as RouteConfiguration;
    const warden = new Warden(requestManager, requestWrapper);
    requestManagerMock
      .expects('register')
      .withExactArgs(routeName, routeOptions);

    // Act
    warden.register(routeName, routeOptions);
  });

  it("should call configuration of request wrapper for request options", () => {
    // Arrange
    const config = {};
    const warden = new Warden(requestManager, requestWrapper);
    requestWrapperMock.expects('config').withExactArgs(config);

    // Act
    warden.requestConfig(config);
  });
});