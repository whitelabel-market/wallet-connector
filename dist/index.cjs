'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var EventEmitter = require('eventemitter3');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);

const events = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CHAIN_CHANGED: "chainChanged",
  SWITCH_CHAIN: "wallet_switchEthereumChain",
  ADD_CHAIN: "wallet_addEthereumChain",
  ACCOUNTS_CHANGED: "accountsChanged",
  ERROR: "error"
};
class ConnectorWrapperBase extends EventEmitter__default["default"] {
  constructor() {
    super();
    this.loading = false;
  }
  _removeBaseListeners() {
    var _a;
    (_a = this.provider) == null ? void 0 : _a.removeAllListeners();
  }
  _reportError(error) {
    this.error = error;
    this.loading = false;
    this.emit(events.ERROR, error);
  }
}

class ConnectorBridge extends ConnectorWrapperBase {
  constructor(_impl) {
    super();
    this._impl = _impl;
  }
  get id() {
    return this._impl.id;
  }
  get name() {
    return this._impl.name;
  }
  get logo() {
    return this._impl.logo;
  }
}

var __defProp$1 = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues$1 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp$1.call(b, prop))
      __defNormalProp$1(a, prop, b[prop]);
  if (__getOwnPropSymbols$1)
    for (var prop of __getOwnPropSymbols$1(b)) {
      if (__propIsEnum$1.call(b, prop))
        __defNormalProp$1(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
class ConnectorWrapperWithChainId extends ConnectorBridge {
  constructor(impl, options) {
    super(impl);
    this.options = options;
    this._validator = new ChainIdValidator(options);
  }
  get desiredChainId() {
    return this._validator.desiredChainId;
  }
  async _validateChainId(newChainId) {
    const chainId = this._validator.parse(newChainId);
    const error = this._validator.validate(chainId);
    if (error) {
      this._reportError(error);
      if (error instanceof ChainIdNotDesiredError) {
        await this._switchOrAddEthChain();
      }
    } else {
      this.error = void 0;
    }
    return chainId;
  }
  _addChainChangedListener() {
    var _a;
    (_a = this.provider) == null ? void 0 : _a.on("chainChanged", this._onChainChanged.bind(this));
  }
  async _getChainId() {
    const chainId = await this._getChainIdFromEthChainId();
    this.chainId = await this._validateChainId(chainId);
    return this.chainId;
  }
  async _onChainChanged(chainId) {
    try {
      this.loading = true;
      this.chainId = await this._validateChainId(chainId);
      this.emit(events.CHAIN_CHANGED, this.chainId);
      this.loading = false;
    } catch (error) {
      this._reportError(error);
    }
  }
  async _switchOrAddEthChain() {
    let error = await this._switchEthChain();
    if (error) {
      const { desiredChainOrChainId } = this.options;
      const desiredChainIsObject = desiredChainOrChainId && typeof desiredChainOrChainId !== "number";
      if (error.code === 4902 && desiredChainIsObject) {
        error = await this._addEthChain();
      }
    }
    if (error) {
      return error;
    }
    this.error = void 0;
    this.emit(events.SWITCH_CHAIN, this._validator.parse(this.desiredChainId));
  }
  async _switchEthChain() {
    var _a;
    try {
      await ((_a = this.provider) == null ? void 0 : _a.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: this.desiredChainId }]
      }));
      this.emit(events.SWITCH_CHAIN, this._validator.parse(this.desiredChainId));
    } catch (error) {
      return error;
    }
  }
  async _addEthChain() {
    var _a;
    const params = __spreadProps(__spreadValues$1({}, this.options.desiredChainOrChainId), {
      chainId: this.desiredChainId
    });
    try {
      await ((_a = this.provider) == null ? void 0 : _a.request({
        method: "wallet_addEthereumChain",
        params: [params]
      }));
      this.emit(events.ADD_CHAIN, params);
    } catch (error) {
      return error;
    }
  }
  async _getChainIdFromEthChainId() {
    var _a;
    return (_a = this.provider) == null ? void 0 : _a.request({
      method: "eth_chainId"
    });
  }
}
class ChainIdNotAllowedError extends Error {
  constructor(chainId, allowedChainIds) {
    super(`chainId ${chainId} not included in ${allowedChainIds.toString()}`);
    this.chainId = chainId;
    this.name = ChainIdNotAllowedError.name;
    Object.setPrototypeOf(this, ChainIdNotAllowedError.prototype);
  }
}
class ChainIdNotDesiredError extends Error {
  constructor(chainId, desiredChainId) {
    super(`chainId ${chainId} not desired as ${desiredChainId}`);
    this.chainId = chainId;
    this.name = ChainIdNotDesiredError.name;
    Object.setPrototypeOf(this, ChainIdNotDesiredError.prototype);
  }
}
const _ChainIdValidator = class {
  constructor(options) {
    this.desiredChainId = this.parseDesiredChainId(options.desiredChainOrChainId);
    this.allowedChainIds = options.allowedChainIds;
  }
  parse(chainId) {
    if (typeof chainId === "number") {
      return chainId;
    } else {
      return Number.parseInt(chainId, chainId.startsWith("0x") ? 16 : 10);
    }
  }
  parseHex(chainId) {
    return "0x" + this.parse(chainId).toString(16);
  }
  validate(chainId) {
    try {
      this.validateChainIdFormat(chainId);
      this.validateChainIdAllowed(chainId);
      this.validateChainIdDesired(chainId);
    } catch (error) {
      return error;
    }
  }
  validateChainIdFormat(chainId) {
    if (!Number.isInteger(chainId) || chainId <= 0 || chainId > _ChainIdValidator.MAX_SAFE_CHAIN_ID) {
      throw new Error(`ChainId ${chainId} invalid: Unsupported format`);
    } else {
      return true;
    }
  }
  validateChainIdDesired(chainId) {
    if (this.desiredChainId) {
      const desiredChainId = this.parse(this.desiredChainId);
      if (chainId !== desiredChainId) {
        throw new ChainIdNotDesiredError(chainId, desiredChainId);
      }
    }
    return true;
  }
  validateChainIdAllowed(chainId) {
    var _a;
    if (!!this.allowedChainIds && this.allowedChainIds.length > 0) {
      const isAllowed = (_a = this.allowedChainIds) == null ? void 0 : _a.some((id) => chainId === id);
      if (!isAllowed) {
        throw new ChainIdNotAllowedError(chainId, this.allowedChainIds || []);
      }
    }
    return true;
  }
  parseDesiredChainId(desiredChainOrChainId) {
    if (desiredChainOrChainId) {
      const chainId = typeof desiredChainOrChainId === "number" ? desiredChainOrChainId : desiredChainOrChainId == null ? void 0 : desiredChainOrChainId.chainId;
      return this.parseHex(chainId);
    } else {
      return null;
    }
  }
};
let ChainIdValidator = _ChainIdValidator;
ChainIdValidator.MAX_SAFE_CHAIN_ID = 4503599627370476;

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
class LocalStorage {
  constructor(key) {
    this.key = key;
    this.enabled = false;
    if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
      this.storage = window.localStorage;
      this.enabled = true;
    }
  }
  set(data) {
    var _a;
    const jsonData = JSON.stringify(data);
    if (this.enabled) {
      (_a = this.storage) == null ? void 0 : _a.setItem(this.key, jsonData);
    }
  }
  get() {
    var _a;
    let data = null;
    let raw = null;
    if (this.enabled) {
      raw = (_a = this.storage) == null ? void 0 : _a.getItem(this.key);
    }
    if (raw && typeof raw === "string") {
      try {
        data = JSON.parse(raw);
      } catch (error) {
        return null;
      }
    }
    return data;
  }
  remove() {
    var _a;
    if (this.enabled) {
      (_a = this.storage) == null ? void 0 : _a.removeItem(this.key);
    }
  }
  update(data) {
    const localData = this.get() || {};
    const mergedData = __spreadValues(__spreadValues({}, localData), data);
    this.set(mergedData);
  }
}

class ConnectorWrapperWithAccounts extends ConnectorWrapperWithChainId {
  constructor(impl, options) {
    super(impl, options);
  }
  get selectedAccount() {
    return this.accounts ? this.accounts[0] : void 0;
  }
  _addAccountsChangedListener() {
    var _a;
    (_a = this.provider) == null ? void 0 : _a.on("accountsChanged", this._onAccountsChanged.bind(this));
  }
  async _getAccounts() {
    try {
      return this._onAccountsChanged(await this._getRequestAccounts());
    } catch (error) {
      const accounts = await this._getEthAccounts();
      if (accounts == null ? void 0 : accounts.length) {
        return this._onAccountsChanged(accounts);
      } else {
        throw error;
      }
    }
  }
  _onAccountsChanged(accounts) {
    if (!accounts.length) {
      throw new Error("No accounts returned");
    }
    this.accounts = accounts;
    this.emit(events.ACCOUNTS_CHANGED, this.accounts);
    return this.accounts;
  }
  _getRequestAccounts() {
    var _a;
    return (_a = this.provider) == null ? void 0 : _a.request({ method: "eth_requestAccounts" });
  }
  _getEthAccounts() {
    var _a;
    return (_a = this.provider) == null ? void 0 : _a.request({ method: "eth_accounts" });
  }
}

class ConnectorWrapperConnect extends ConnectorWrapperWithAccounts {
  constructor(impl, connection) {
    super(impl, connection.options);
    this._storage = connection.options.cache.enabled ? connection._storage : void 0;
  }
  async _activate() {
    var _a;
    this.provider = await this._impl.connectImpl();
    (_a = this._storage) == null ? void 0 : _a.set(this.id);
    await Promise.all([this._getAccounts(), this._getChainId()]);
    this._addChainChangedListener();
    this._addAccountsChangedListener();
  }
  async _deactivate() {
    var _a;
    this._removeBaseListeners();
    await this._impl.disconnectImpl();
    this.accounts = void 0;
    this.chainId = void 0;
    this.provider = void 0;
    this.error = void 0;
    (_a = this._storage) == null ? void 0 : _a.remove();
  }
  get connected() {
    return !!(!this.error && this.selectedAccount && this.selectedAccount.length > 0);
  }
}

class ConnectorWrapper extends ConnectorWrapperConnect {
  constructor(impl, connection) {
    super(impl, connection);
    this._connection = connection;
  }
  async connect() {
    try {
      this.loading = true;
      this._connection._add(this);
      await this._activate();
      this.emit(events.CONNECT, this);
      this.loading = false;
    } catch (error) {
      this._reportError(error);
      this._connection._remove(this);
    }
    return this;
  }
  async disconnect() {
    try {
      this.loading = true;
      await this._deactivate();
      this._connection._remove(this);
      this.loading = false;
      this.emit(events.DISCONNECT, this);
    } catch (error) {
      this._reportError(error);
      this._connection._remove(this);
    }
  }
}

class ConnectorFactory extends EventEmitter__default["default"] {
  constructor() {
    super();
    this.activeConnectors = {};
    this.connectors = {};
  }
  _init(connectors, connection) {
    connectors.forEach((impl) => {
      const connector = new ConnectorWrapper(impl, connection);
      Object.values(events).forEach((event) => connector.on(event, (data) => {
        this.emit(event, data, connector);
      }));
      this.connectors[connector.id] = connector;
    });
  }
  _add(connector) {
    this.activeConnectors[connector.id] = connector;
    this.activeConnector = connector;
  }
  _remove(connector) {
    this.activeConnectors[connector.id] && delete this.activeConnectors[connector.id];
    const activeConnectors = Object.values(this.activeConnectors);
    this.activeConnector = activeConnectors.length > 0 ? activeConnectors[activeConnectors.length - 1] : void 0;
  }
}

function mergeDeep(...objects) {
  const isObject = (obj) => obj && typeof obj === "object";
  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key];
      const oVal = obj[key];
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });
    return prev;
  }, {});
}

const DEFAULT_OPTIONS = {
  allowedChainIds: null,
  desiredChainOrChainId: null,
  cache: {
    enabled: true,
    key: "cached-connector"
  }
};
const initOptions = (options) => mergeDeep(DEFAULT_OPTIONS, options);
class Connection extends ConnectorFactory {
  constructor(options, connectors) {
    super();
    this.options = initOptions(options);
    this._storage = new LocalStorage(this.options.cache.key);
    this._init(connectors, this);
  }
  loadFromCache() {
    var _a;
    if ((_a = this.options.cache) == null ? void 0 : _a.enabled) {
      const id = this._storage.get();
      if (id) {
        if (this.connectors[id]) {
          return this.connectors[id].connect();
        }
      }
    }
  }
}

var Logo$5 = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg width=\"382px\" height=\"472px\" viewBox=\"0 0 382 472\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <!-- Generator: Sketch 52.6 (67491) - http://www.bohemiancoding.com/sketch -->\n    <title>authereum</title>\n    <desc>Created with Sketch.</desc>\n    <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"authereum\" fill=\"#FF4C2F\">\n            <g id=\"Group\" transform=\"translate(190.950000, 235.900000) scale(-1, 1) rotate(-180.000000) translate(-190.950000, -235.900000) translate(-0.000000, 0.100000)\">\n                <path d=\"M80,454.1 C50,444.5 19.8,434.9 12.7,432.7 L0,428.6 L0,340.4 C0,287.6 0.4,247.8 1,241.2 C5.4,195 25.4,151.2 58.8,114.8 C66.4,106.5 187,1.4 190.4,0.1 C191.8,-0.4 297.8,90 315.2,106.6 C345.4,135.3 369,177.3 377.4,217.5 C381.8,238.7 382.1,246.6 381.8,340.6 L381.5,429 L313.6,450.4 C276.3,462.1 245.6,471.6 245.4,471.5 C245.3,471.3 250.9,460.2 258,446.7 L270.9,422.2 L290.2,416 C300.8,412.6 316.8,407.5 325.8,404.7 L342.1,399.6 L341.7,318.4 C341.4,240.4 341.3,236.8 339.3,227.7 C331.7,193.4 316,164.3 291.9,139.7 C287.3,135 263.9,114.3 240,93.8 C216.1,73.2 195.3,55.3 193.8,53.9 L191.2,51.5 L145.3,91 C89.2,139.4 80.8,147.6 67.4,168.2 C57.1,184.1 49.5,201.2 44.9,218.9 C40.4,236.9 40,243.6 40,323.8 L40,399.5 L54.3,404 C62.1,406.5 78.1,411.6 89.8,415.3 C101.4,419 111,422.4 111,422.7 C111,423 116.6,434 123.5,447.1 C130.4,460.3 136,471.2 136,471.4 C136,472 134.8,471.6 80,454.1 Z\" id=\"Path\"></path>\n                <path d=\"M188.4,468.5 C187.5,466.7 162.3,418.6 132.5,361.7 L78.3,258.2 L79.1,249.8 C80.9,232.6 87.3,214.4 97.7,197.9 C101.4,191.9 102.5,190.8 103.5,191.9 C104.1,192.6 123.9,230 147.5,275 C171,319.9 190.5,356.7 190.9,356.7 C191.2,356.7 211,320.3 234.8,275.9 C258.6,231.5 278.5,194.4 279.1,193.4 C280.1,191.7 280.3,191.8 281.9,193.9 C292.2,207.4 300.7,229.7 303.1,249.4 L304.3,259.4 L247.5,365.3 C216.3,423.5 190.6,471.4 190.4,471.5 C190.3,471.7 189.4,470.4 188.4,468.5 Z\" id=\"Path\"></path>\n                <path d=\"M163,213.8 L135.5,158.9 L151,145.4 C159.5,138 172,127.3 178.7,121.7 L191,111.5 L193.7,113.7 C195.3,114.9 207.6,125.6 221.1,137.5 L245.8,159.1 L218.4,213.9 C203.3,244 190.9,268.7 190.7,268.7 C190.6,268.7 178.1,244 163,213.8 Z\" id=\"Path\"></path>\n            </g>\n        </g>\n    </g>\n</svg>";

var generateId = (name) => {
  return name.toLowerCase().replace(/\s/g, "");
};

class AbstractConnector {
  constructor(name, logo) {
    this.name = name;
    this.logo = logo;
    this.id = generateId(this.name);
  }
  init(options) {
    this.options = options;
    return this;
  }
}

function createInjectedProvider(from, selector) {
  var _a, _b;
  if ((_a = from.providers) == null ? void 0 : _a.length) {
    return (_b = from.providers.find((p) => p[selector])) != null ? _b : from.providers[0];
  }
  return from;
}
function createConnector(impl) {
  return (options) => impl.init(options || {});
}

class AuthereumConnector extends AbstractConnector {
  constructor() {
    super("Authereum", Logo$5);
  }
  async connectImpl() {
    const { Authereum } = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('authereum/dist')); });
    const authereum = new Authereum(this.options);
    const provider = authereum.getProvider();
    provider.authereum = authereum;
    await provider.enable();
    return provider;
  }
  async disconnectImpl() {
    return null;
  }
}
var Authereum$1 = createConnector(new AuthereumConnector());

var Logo$4 = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\" fill-rule=\"evenodd\" clip-rule=\"evenodd\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><g fill=\"#f0b90b\"><path d=\"M20.245 0L9.634 6.125l3.901 2.262 6.71-3.862 6.71 3.862 3.902-2.262L20.245 0zm6.711 11.586l3.9 2.263v4.526l-6.71 3.862v7.724l-3.9 2.263-3.902-2.263v-7.724l-6.71-3.862v-4.526l3.901-2.263 6.71 3.863 6.71-3.863h.001z\"/><path d=\"M30.857 21.573V26.1l-3.901 2.262v-4.525l3.9-2.263.001-.001z\"/><path d=\"M26.916 31.56l6.71-3.862v-7.724l3.902-2.263v12.25l-10.611 6.125V31.56h-.001zm6.711-19.31l-3.902-2.263 3.902-2.263 3.9 2.263v4.525l-3.9 2.263V12.25zM16.344 37.724V33.2l3.901 2.263 3.902-2.263v4.525l-3.902 2.263-3.9-2.263-.001-.001zm-2.809-9.363L9.634 26.1v-4.526l3.901 2.263v4.525-.001zm6.71-16.111l-3.9-2.263 3.9-2.263 3.902 2.263-3.902 2.263zm-9.48-2.263l-3.9 2.263v4.525l-3.902-2.263V9.987l3.901-2.263 3.901 2.263z\"/><path d=\"M2.963 17.711l3.901 2.263v7.724l6.71 3.862v4.526L2.963 29.96V17.71v.001z\"/></g></svg>";

class BinanceChainConnector extends AbstractConnector {
  constructor() {
    super("Binance Chain", Logo$4);
  }
  async connectImpl() {
    let provider = null;
    if (typeof window.BinanceChain !== "undefined") {
      provider = window.BinanceChain;
    } else {
      throw new TypeError("No Binance Chain Wallet found");
    }
    return provider;
  }
  async disconnectImpl() {
    return null;
  }
}
var BinanceChain$1 = createConnector(new BinanceChainConnector());

var Logo$3 = "<svg fill=\"none\" height=\"63\" viewBox=\"0 0 63 63\" width=\"63\" xmlns=\"http://www.w3.org/2000/svg\"><path clip-rule=\"evenodd\" d=\"m31.6393.984375h15.3274 15.3275v15.299025h-15.3275-15.3274-15.3275v15.2989.981 14.2289.0891 15.2099h-15.327425v-15.2099-.0891-14.2289-.981-15.2989-15.299025h15.327425zm15.3274 45.808325h-15.2381v-15.2098h30.5566v15.7449c0 3.914-1.5571 7.668-4.3291 10.4365s-6.5319 4.325-10.4533 4.3274h-.5361z\" fill=\"#617bff\" fill-rule=\"evenodd\"/></svg>";

class FortmaticConnector extends AbstractConnector {
  constructor() {
    super("Fortmatic", Logo$3);
  }
  async connectImpl() {
    const { default: Fortmatic } = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('fortmatic')); });
    const fm = new Fortmatic(this.options.key, this.options.networkName);
    const provider = await fm.getProvider();
    await fm.user.login();
    const isLoggedIn = await fm.user.isLoggedIn();
    if (isLoggedIn) {
      return provider;
    } else {
      throw new Error("Failed to login to Fortmatic");
    }
  }
  async disconnectImpl() {
    return null;
  }
}
var Fortmatic$1 = createConnector(new FortmaticConnector());

var FrameLogo = "<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 153.4 152.9\"><defs><linearGradient id=\"phase\" gradientTransform=\"rotate(45)\"><stop offset=\"0%\" style=\"stop-color: #2b254f\"/><stop offset=\"100%\" style=\"stop-color: #192f45\"/></linearGradient></defs><path fill=\"url('#phase')\" d=\"M145.1,75.6v-58c0-5.1-4.2-9.3-9.3-9.3h0H77.7c-0.6,0-1.1-0.2-1.6-0.6l-7-7c-0.4-0.4-1-0.7-1.6-0.7H9.3 C4.2,0,0,4.1,0,9.3c0,0,0,0,0,0l0,0v58c0,0.6,0.2,1.1,0.6,1.6l7,7c0.4,0.4,0.7,1,0.7,1.6v58c0,5.1,4.2,9.3,9.3,9.3c0,0,0,0,0,0h58.2 c0.6,0,1.1,0.2,1.6,0.6l7,7c0.4,0.4,1,0.6,1.6,0.6h58.2c5.1,0,9.3-4.1,9.3-9.3c0,0,0,0,0,0l0,0v-58c0-0.6-0.2-1.1-0.6-1.6l-7-7 C145.4,76.7,145.1,76.2,145.1,75.6z M105.6,106.6H47.9c-0.7,0-1.3-0.6-1.3-1.3V47.7c0-0.7,0.6-1.3,1.3-1.3h57.7 c0.7,0,1.3,0.6,1.3,1.3v57.6C107,106,106.4,106.6,105.6,106.6z\"/></svg>";

class FrameConnector extends AbstractConnector {
  constructor() {
    super("Frame", FrameLogo);
  }
  async connectImpl() {
    const { default: ethProvider } = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('eth-provider')); });
    return ethProvider("frame");
  }
  async disconnectImpl() {
    return null;
  }
}
var Frame$1 = createConnector(new FrameConnector());

var Logo$2 = "<svg height=\"355\" viewBox=\"0 0 397 355\" width=\"397\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\" transform=\"translate(-1 -1)\"><path d=\"m114.622644 327.195472 52.004717 13.810198v-18.05949l4.245283-4.249292h29.716982v21.246459 14.872523h-31.839624l-39.268868-16.997169z\" fill=\"#cdbdb2\"/><path d=\"m199.528305 327.195472 50.943397 13.810198v-18.05949l4.245283-4.249292h29.716981v21.246459 14.872523h-31.839623l-39.268868-16.997169z\" fill=\"#cdbdb2\" transform=\"matrix(-1 0 0 1 483.96227 0)\"/><path d=\"m170.872644 287.889523-4.245283 35.056657 5.306604-4.249292h55.18868l6.367925 4.249292-4.245284-35.056657-8.490565-5.311615-42.452832 1.062323z\" fill=\"#393939\"/><path d=\"m142.216984 50.9915022 25.471698 59.4900858 11.674528 173.158643h41.391511l12.735849-173.158643 23.349056-59.4900858z\" fill=\"#f89c35\"/><path d=\"m30.7783023 181.657226-29.71698153 86.048161 74.29245393-4.249293h47.7594343v-37.181303l-2.122641-76.487253-10.613208 8.498583z\" fill=\"#f89d35\"/><path d=\"m87.0283032 191.218134 87.0283028 2.124646-9.551886 44.617563-41.391511-10.623229z\" fill=\"#d87c30\"/><path d=\"m87.0283032 192.280457 36.0849058 33.994334v33.994334z\" fill=\"#ea8d3a\"/><path d=\"m123.113209 227.337114 42.452831 10.623229 13.79717 45.679888-9.551886 5.311615-46.698115-27.620398z\" fill=\"#f89d35\"/><path d=\"m123.113209 261.331448-8.490565 65.864024 56.25-39.305949z\" fill=\"#eb8f35\"/><path d=\"m174.056606 193.34278 5.306604 90.297451-15.919812-46.211049z\" fill=\"#ea8e3a\"/><path d=\"m74.2924539 262.393771 48.8207551-1.062323-8.490565 65.864024z\" fill=\"#d87c30\"/><path d=\"m24.4103777 355.878193 90.2122663-28.682721-40.3301901-64.801701-73.23113313 5.311616z\" fill=\"#eb8f35\"/><path d=\"m167.688682 110.481588-45.636793 38.243627-35.0235858 42.492919 87.0283028 3.186969z\" fill=\"#e8821e\"/><path d=\"m114.622644 327.195472 56.25-39.305949-4.245283 33.994334v19.121813l-38.207548-7.43626z\" fill=\"#dfcec3\"/><path d=\"m229.245286 327.195472 55.18868-39.305949-4.245283 33.994334v19.121813l-38.207548-7.43626z\" fill=\"#dfcec3\" transform=\"matrix(-1 0 0 1 513.679252 0)\"/><path d=\"m132.665096 212.464593-11.674528 24.433427 41.39151-10.623229z\" fill=\"#393939\" transform=\"matrix(-1 0 0 1 283.372646 0)\"/><path d=\"m23.349057 1.06232296 144.339625 109.41926504-24.410378-59.4900858z\" fill=\"#e88f35\"/><path d=\"m23.349057 1.06232296-19.10377392 58.42776294 10.61320772 63.7393781-7.42924541 4.249292 10.61320771 9.560906-8.49056617 7.436261 11.67452847 10.623229-7.4292454 6.373938 16.9811323 21.246459 79.5990577-24.433428c38.915096-31.161473 58.018869-47.096318 57.311322-47.804533-.707548-.708215-48.820756-37.1813036-144.339625-109.41926504z\" fill=\"#8e5a30\"/><g transform=\"matrix(-1 0 0 1 399.056611 0)\"><path d=\"m30.7783023 181.657226-29.71698153 86.048161 74.29245393-4.249293h47.7594343v-37.181303l-2.122641-76.487253-10.613208 8.498583z\" fill=\"#f89d35\"/><path d=\"m87.0283032 191.218134 87.0283028 2.124646-9.551886 44.617563-41.391511-10.623229z\" fill=\"#d87c30\"/><path d=\"m87.0283032 192.280457 36.0849058 33.994334v33.994334z\" fill=\"#ea8d3a\"/><path d=\"m123.113209 227.337114 42.452831 10.623229 13.79717 45.679888-9.551886 5.311615-46.698115-27.620398z\" fill=\"#f89d35\"/><path d=\"m123.113209 261.331448-8.490565 65.864024 55.18868-38.243626z\" fill=\"#eb8f35\"/><path d=\"m174.056606 193.34278 5.306604 90.297451-15.919812-46.211049z\" fill=\"#ea8e3a\"/><path d=\"m74.2924539 262.393771 48.8207551-1.062323-8.490565 65.864024z\" fill=\"#d87c30\"/><path d=\"m24.4103777 355.878193 90.2122663-28.682721-40.3301901-64.801701-73.23113313 5.311616z\" fill=\"#eb8f35\"/><path d=\"m167.688682 110.481588-45.636793 38.243627-35.0235858 42.492919 87.0283028 3.186969z\" fill=\"#e8821e\"/><path d=\"m132.665096 212.464593-11.674528 24.433427 41.39151-10.623229z\" fill=\"#393939\" transform=\"matrix(-1 0 0 1 283.372646 0)\"/><path d=\"m23.349057 1.06232296 144.339625 109.41926504-24.410378-59.4900858z\" fill=\"#e88f35\"/><path d=\"m23.349057 1.06232296-19.10377392 58.42776294 10.61320772 63.7393781-7.42924541 4.249292 10.61320771 9.560906-8.49056617 7.436261 11.67452847 10.623229-7.4292454 6.373938 16.9811323 21.246459 79.5990577-24.433428c38.915096-31.161473 58.018869-47.096318 57.311322-47.804533-.707548-.708215-48.820756-37.1813036-144.339625-109.41926504z\" fill=\"#8e5a30\"/></g></g></svg>";

const _MetaMaskConnector = class extends AbstractConnector {
  constructor() {
    super("MetaMask", Logo$2);
  }
  async connectImpl() {
    const { default: detectEthereumProvider } = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('@metamask/detect-provider')); });
    let provider = await detectEthereumProvider();
    if (!provider) {
      _MetaMaskConnector._redirect();
      throw new Error("No Metamask provider found");
    }
    provider = createInjectedProvider(provider, "isMetaMask");
    return provider;
  }
  async disconnectImpl() {
    return null;
  }
  static _redirect() {
    const target = "_blank";
    const { host, pathname } = window.location;
    window.open(`${_MetaMaskConnector.DEEP_LINK_BASE}${host + pathname}`, target);
  }
};
let MetaMaskConnector = _MetaMaskConnector;
MetaMaskConnector.DEEP_LINK_BASE = "https://metamask.app.link/dapp/";
var MetaMask$1 = createConnector(new MetaMaskConnector());

var Logo$1 = "<svg height=\"512\" viewBox=\"0 0 512 512\" width=\"512\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"><radialGradient id=\"a\" cx=\"0%\" cy=\"50%\" r=\"100%\"><stop offset=\"0\" stop-color=\"#5d9df6\"/><stop offset=\"1\" stop-color=\"#006fff\"/></radialGradient><g fill=\"none\" fill-rule=\"evenodd\"><path d=\"m256 0c141.384896 0 256 114.615104 256 256s-114.615104 256-256 256-256-114.615104-256-256 114.615104-256 256-256z\" fill=\"url(#a)\"/><path d=\"m64.6917558 37.7088298c51.5328072-50.2784397 135.0839942-50.2784397 186.6167992 0l6.202057 6.0510906c2.57664 2.5139218 2.57664 6.5897948 0 9.1037177l-21.215998 20.6995759c-1.288321 1.2569619-3.3771 1.2569619-4.665421 0l-8.534766-8.3270205c-35.950573-35.0754962-94.237969-35.0754962-130.188544 0l-9.1400282 8.9175519c-1.2883217 1.2569609-3.3771016 1.2569609-4.6654208 0l-21.2159973-20.6995759c-2.5766403-2.5139229-2.5766403-6.5897958 0-9.1037177zm230.4934852 42.8089117 18.882279 18.4227262c2.576627 2.5139103 2.576642 6.5897593.000032 9.1036863l-85.141498 83.070358c-2.576623 2.513941-6.754182 2.513969-9.33084.000066-.00001-.00001-.000023-.000023-.000033-.000034l-60.428256-58.957451c-.64416-.628481-1.68855-.628481-2.33271 0-.000004.000004-.000008.000007-.000012.000011l-60.4269683 58.957408c-2.5766141 2.513947-6.7541746 2.51399-9.3308408.000092-.0000151-.000014-.0000309-.000029-.0000467-.000046l-85.14386774-83.071463c-2.57663928-2.513921-2.57663928-6.589795 0-9.1037163l18.88231264-18.4226955c2.5766393-2.5139222 6.7541993-2.5139222 9.3308397 0l60.4291347 58.9582758c.6441608.62848 1.6885495.62848 2.3327103 0 .0000095-.000009.0000182-.000018.0000277-.000025l60.4261065-58.9582508c2.576581-2.51398 6.754142-2.5140743 9.33084-.0002103.000037.0000354.000072.0000709.000107.0001063l60.429056 58.9583548c.644159.628479 1.688549.628479 2.332709 0l60.428079-58.9571925c2.57664-2.5139231 6.754199-2.5139231 9.330839 0z\" fill=\"#fff\" fill-rule=\"nonzero\" transform=\"translate(98 160)\"/></g></svg>";

class WalletConnectConnector extends AbstractConnector {
  constructor() {
    super("WalletConnect", Logo$1);
  }
  async connectImpl() {
    const { default: WalletConnectWeb3Provider } = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('@walletconnect/web3-provider')); });
    this.walletConnect = new WalletConnectWeb3Provider(this.options);
    await this.walletConnect.enable();
    return this.walletConnect;
  }
  disconnectImpl() {
    return this.walletConnect.disconnect();
  }
}
var WalletConnect$1 = createConnector(new WalletConnectConnector());

var Logo = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg width=\"383px\" height=\"383px\" viewBox=\"0 0 383 383\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n    <!-- Generator: Sketch 54.1 (76490) - https://sketchapp.com -->\n    <title>walletlink</title>\n    <desc>Created with Sketch.</desc>\n    <defs>\n        <rect id=\"path-1\" x=\"0\" y=\"0\" width=\"383\" height=\"383\" rx=\"64\"></rect>\n        <linearGradient x1=\"49.9999938%\" y1=\"0%\" x2=\"49.9999938%\" y2=\"100%\" id=\"linearGradient-3\">\n            <stop stop-color=\"#2E66F8\" offset=\"0%\"></stop>\n            <stop stop-color=\"#124ADB\" offset=\"100%\"></stop>\n        </linearGradient>\n    </defs>\n    <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n        <g id=\"walletlink\">\n            <g id=\"Path\">\n                <mask id=\"mask-2\" fill=\"white\">\n                    <use xlink:href=\"#path-1\"></use>\n                </mask>\n                <rect stroke=\"#979797\" x=\"0.5\" y=\"0.5\" width=\"382\" height=\"382\" rx=\"64\"></rect>\n                <polygon fill=\"url(#linearGradient-3)\" fill-rule=\"nonzero\" mask=\"url(#mask-2)\" points=\"0 0 383 0 383 384 0 384\"></polygon>\n            </g>\n            <path d=\"M60.1074,191.572 C60.1074,264.966 119.605,324.463 192.998,324.463 C266.392,324.463 325.889,264.966 325.889,191.572 C325.889,118.179 266.392,58.6816 192.998,58.6816 C119.605,58.6816 60.1074,118.179 60.1074,191.572 Z M159.037,148.752 C154.144,148.752 150.178,152.718 150.178,157.611 L150.178,225.533 C150.178,230.426 154.144,234.393 159.037,234.393 L226.959,234.393 C231.852,234.393 235.818,230.426 235.818,225.533 L235.818,157.611 C235.818,152.718 231.852,148.752 226.959,148.752 L159.037,148.752 Z\" id=\"Shape\" fill=\"#FFFFFF\"></path>\n        </g>\n    </g>\n</svg>";

class CoinbaseWalletConnector extends AbstractConnector {
  constructor() {
    super("Coinbase Wallet", Logo);
  }
  async connectImpl() {
    const { CoinbaseWalletSDK } = await Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require('@coinbase/wallet-sdk')); });
    this.coinbaseWallet = new CoinbaseWalletSDK(this.options);
    const provider = await this.coinbaseWallet.makeWeb3Provider(this.options.rpcUrl);
    return provider;
  }
  async disconnectImpl() {
    return this.coinbaseWallet.disconnect();
  }
}
var CoinbaseWallet$1 = createConnector(new CoinbaseWalletConnector());

var Connectors = { Authereum: Authereum$1, BinanceChain: BinanceChain$1, Fortmatic: Fortmatic$1, Frame: Frame$1, MetaMask: MetaMask$1, WalletConnect: WalletConnect$1, CoinbaseWallet: CoinbaseWallet$1 };

const { Authereum, BinanceChain, Fortmatic, Frame, MetaMask, WalletConnect, CoinbaseWallet } = Connectors;

exports.Authereum = Authereum;
exports.BinanceChain = BinanceChain;
exports.ChainIdNotAllowedError = ChainIdNotAllowedError;
exports.ChainIdNotDesiredError = ChainIdNotDesiredError;
exports.CoinbaseWallet = CoinbaseWallet;
exports.Connection = Connection;
exports.Connectors = Connectors;
exports.Fortmatic = Fortmatic;
exports.Frame = Frame;
exports.MetaMask = MetaMask;
exports.WalletConnect = WalletConnect;
