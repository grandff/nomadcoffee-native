"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGraphQLServer = exports.startAsync = exports.createAuthenticationContextAsync = void 0;
const base64url_1 = __importDefault(require("base64url"));
const crypto_1 = __importDefault(require("crypto"));
const express_1 = __importDefault(require("express"));
const freeport_async_1 = __importDefault(require("freeport-async"));
const graphql = __importStar(require("graphql"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const xdl_1 = require("xdl");
// @ts-ignore
const AsyncIterableRingBuffer_1 = __importDefault(require("./graphql/AsyncIterableRingBuffer"));
const GraphQLSchema_1 = __importDefault(require("./graphql/GraphQLSchema"));
const Issues_1 = __importDefault(require("./graphql/Issues"));
const createContext_1 = __importStar(require("./graphql/createContext"));
const serverStartTimeUTCString = new Date().toUTCString();
function setHeaders(res) {
    // Set the Last-Modified header to server start time because otherwise it
    // becomes Sat, 26 Oct 1985 08:15:00 GMT for files installed from npm.
    res.setHeader('Last-Modified', serverStartTimeUTCString);
}
async function generateSecureRandomTokenAsync() {
    return new Promise((resolve, reject) => {
        crypto_1.default.randomBytes(32, (error, buffer) => {
            if (error)
                reject(error);
            else
                resolve(base64url_1.default.fromBase64(buffer.toString('base64')));
        });
    });
}
async function createAuthenticationContextAsync({ port }) {
    const clientAuthenticationToken = await generateSecureRandomTokenAsync();
    const endpointUrlToken = await generateSecureRandomTokenAsync();
    const graphQLEndpointPath = `/${endpointUrlToken}/graphql`;
    //const hostname = `${devtoolsGraphQLHost()}:${port}`;
	const hostname = "instaclone-native.run.goorm.io";
    const webSocketGraphQLUrl = `ws://${hostname}${graphQLEndpointPath}`;
    const allowedOrigin = `http://${hostname}`;
    return {
        clientAuthenticationToken,
        graphQLEndpointPath,
        webSocketGraphQLUrl,
        allowedOrigin,
        requestHandler: (request, response) => {
            response.json({ webSocketGraphQLUrl, clientAuthenticationToken });
        },
    };
}
exports.createAuthenticationContextAsync = createAuthenticationContextAsync;
async function startAsync(projectRoot) {
    const port = await freeport_async_1.default(19002, { hostnames: [null, 'localhost'] });
    const server = express_1.default();
    const authenticationContext = await createAuthenticationContextAsync({ port });
    server.get('/dev-tools-info', authenticationContext.requestHandler);
    server.use('/_next', express_1.default.static(path_1.default.join(__dirname, '../client/_next'), {
        // All paths in the _next folder include hashes, so they can be cached more aggressively.
        immutable: true,
        maxAge: '1y',
        setHeaders,
    }));
    server.use(express_1.default.static(path_1.default.join(__dirname, '../client'), { setHeaders }));
    const listenHostname = devtoolsHost();
    const httpServer = http_1.default.createServer(server);
    await new Promise((resolve, reject) => {
        httpServer.once('error', reject);
        httpServer.once('listening', resolve);
        httpServer.listen(port, listenHostname);
    });
    startGraphQLServer(projectRoot, httpServer, authenticationContext);
    await xdl_1.ProjectSettings.setPackagerInfoAsync(projectRoot, { devToolsPort: port });
    return `http://${listenHostname}:${port}`;
}
exports.startAsync = startAsync;
function startGraphQLServer(projectRoot, httpServer, authenticationContext) {
    const layout = createLayout();
    const issues = new Issues_1.default();
    const messageBuffer = createMessageBuffer(projectRoot, issues);
    subscriptions_transport_ws_1.SubscriptionServer.create({
        schema: GraphQLSchema_1.default,
        execute: graphql.execute,
        subscribe: graphql.subscribe,
        onOperation: (operation, params) => ({
            ...params,
            context: createContext_1.default({
                projectDir: projectRoot,
                messageBuffer,
                layout,
                issues,
            }),
        }),
        onConnect: connectionParams => {
            if (!connectionParams.clientAuthenticationToken ||
                connectionParams.clientAuthenticationToken !==
                    authenticationContext.clientAuthenticationToken) {
                throw new Error('Dev Tools API authentication failed.');
            }
            return true;
        },
    }, {
        server: httpServer,
        path: authenticationContext.graphQLEndpointPath,
        verifyClient: info => {
            return info.origin === authenticationContext.allowedOrigin;
        },
    });
}
exports.startGraphQLServer = startGraphQLServer;
function devtoolsHost() {
    if (process.env.EXPO_DEVTOOLS_LISTEN_ADDRESS) {
        return process.env.EXPO_DEVTOOLS_LISTEN_ADDRESS.trim();
    }
    return 'localhost';
}
function devtoolsGraphQLHost() {
    if (process.env.EXPO_DEVTOOLS_LISTEN_ADDRESS && process.env.REACT_NATIVE_PACKAGER_HOSTNAME) {
        return process.env.REACT_NATIVE_PACKAGER_HOSTNAME.trim();
    }
    else if (process.env.EXPO_DEVTOOLS_LISTEN_ADDRESS) {
        return process.env.EXPO_DEVTOOLS_LISTEN_ADDRESS;
    }
    return 'localhost';
}
function createLayout() {
    let layout = {
        selected: null,
        sources: null,
        sourceLastReads: {},
    };
    return {
        get() {
            return layout;
        },
        set(newLayout) {
            layout = {
                ...layout,
                ...newLayout,
            };
        },
        setLastRead(sourceId, lastReadCursor) {
            layout.sourceLastReads[sourceId] = lastReadCursor;
        },
    };
}
function createMessageBuffer(projectRoot, issues) {
    const buffer = new AsyncIterableRingBuffer_1.default(10000);
    // eslint-disable-next-line no-new
    new xdl_1.PackagerLogsStream({
        projectRoot,
        updateLogs(updater) {
            const chunks = updater([]);
            chunks.forEach(chunk => {
                if (chunk.issueId) {
                    if (chunk.issueCleared) {
                        issues.clearIssue(chunk.issueId);
                    }
                    else {
                        issues.addIssue(chunk.issueId, chunk);
                    }
                    return;
                }
                buffer.push({
                    type: 'ADDED',
                    sourceId: createContext_1.PROCESS_SOURCE.id,
                    node: chunk,
                });
            });
        },
        onStartBuildBundle({ chunk }) {
            buffer.push({
                type: 'ADDED',
                sourceId: createContext_1.PROCESS_SOURCE.id,
                node: {
                    ...chunk,
                    progress: 0,
                    duration: 0,
                },
            });
        },
        onProgressBuildBundle({ progress, start, chunk }) {
            buffer.push({
                type: 'UPDATED',
                sourceId: createContext_1.PROCESS_SOURCE.id,
                node: {
                    ...chunk,
                    progress,
                    // @ts-ignore
                    duration: new Date() - (start || new Date()),
                },
            });
        },
        onFinishBuildBundle({ error, start, end, chunk }) {
            buffer.push({
                type: 'UPDATED',
                sourceId: createContext_1.PROCESS_SOURCE.id,
                node: {
                    ...chunk,
                    error,
                    // @ts-ignore
                    duration: end - (start || new Date()),
                },
            });
        },
    });
    // needed for validation logging to function
    xdl_1.ProjectUtils.attachLoggerStream(projectRoot, {
        stream: {
            write: chunk => {
                if (chunk.tag === 'device') {
                    buffer.push({
                        type: 'ADDED',
                        sourceId: chunk.deviceId,
                        node: chunk,
                    });
                }
            },
        },
        type: 'raw',
    });
    xdl_1.Logger.global.addStream({
        stream: {
            write: chunk => {
                buffer.push({
                    type: 'ADDED',
                    sourceId: createContext_1.PROCESS_SOURCE.id,
                    node: chunk,
                });
            },
        },
        type: 'raw',
    });
    return buffer;
}
//# sourceMappingURL=DevToolsServer.js.map