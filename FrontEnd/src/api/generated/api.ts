/* tslint:disable */
/* eslint-disable */
/**
 * Title
 * Title
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import { Configuration } from './configuration';
import globalAxios, { AxiosPromise, AxiosInstance, AxiosRequestConfig } from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from './base';

/**
 * 
 * @export
 * @interface AvailableUser
 */
export interface AvailableUser {
    /**
     * 
     * @type {string}
     * @memberof AvailableUser
     */
    'id': string;
    /**
     * 
     * @type {string}
     * @memberof AvailableUser
     */
    'username': string;
}
/**
 * 
 * @export
 * @interface ChatMessage
 */
export interface ChatMessage {
    /**
     * 
     * @type {string}
     * @memberof ChatMessage
     */
    'id'?: string;
    /**
     * 
     * @type {Array<ChatMessageContentInner>}
     * @memberof ChatMessage
     */
    'content'?: Array<ChatMessageContentInner>;
    /**
     * 
     * @type {number}
     * @memberof ChatMessage
     */
    'timestamp'?: number;
    /**
     * 
     * @type {string}
     * @memberof ChatMessage
     */
    'from'?: string;
    /**
     * 
     * @type {Array<string>}
     * @memberof ChatMessage
     */
    'images'?: Array<string>;
}
/**
 * @type ChatMessageContentInner
 * @export
 */
export type ChatMessageContentInner = number | string;

/**
 * 
 * @export
 * @interface GetAvailableUsers200Response
 */
export interface GetAvailableUsers200Response {
    /**
     * 
     * @type {Array<AvailableUser>}
     * @memberof GetAvailableUsers200Response
     */
    'users'?: Array<AvailableUser>;
}
/**
 * 
 * @export
 * @interface LoginRequest
 */
export interface LoginRequest {
    /**
     * 
     * @type {string}
     * @memberof LoginRequest
     */
    'username'?: string;
    /**
     * 
     * @type {string}
     * @memberof LoginRequest
     */
    'password': string;
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAvailableUsers: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/users`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {number} [timestamp] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChatMessages: async (timestamp?: number, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/chat/messages`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication cookieAuth required

            if (timestamp !== undefined) {
                localVarQueryParameter['timestamp'] = timestamp;
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserProfile: async (options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/users/me`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication cookieAuth required


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {LoginRequest} [loginRequest] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        login: async (loginRequest?: LoginRequest, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/auth/login`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            localVarHeaderParameter['Content-Type'] = 'application/json';

            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = serializeDataIfNeeded(loginRequest, localVarRequestOptions, configuration)

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @param {string} message 
         * @param {Array<File>} images 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sendChatMessage: async (message: string, images: Array<File>, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'message' is not null or undefined
            assertParamExists('sendChatMessage', 'message', message)
            // verify required parameter 'images' is not null or undefined
            assertParamExists('sendChatMessage', 'images', images)
            const localVarPath = `/chat/messages`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;
            const localVarFormParams = new ((configuration && configuration.formDataCtor) || FormData)();

            // authentication cookieAuth required


            if (message !== undefined) { 
                localVarFormParams.append('message', message as any);
            }
                if (images) {
                images.forEach((element) => {
                    localVarFormParams.append('images', element as any);
                })
            }

    
    
            localVarHeaderParameter['Content-Type'] = 'multipart/form-data';
    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
            localVarRequestOptions.data = localVarFormParams;

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getAvailableUsers(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetAvailableUsers200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getAvailableUsers(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {number} [timestamp] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getChatMessages(timestamp?: number, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<ChatMessage>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getChatMessages(timestamp, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getUserProfile(options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<GetAvailableUsers200Response>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getUserProfile(options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {LoginRequest} [loginRequest] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async login(loginRequest?: LoginRequest, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.login(loginRequest, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
        /**
         * 
         * @param {string} message 
         * @param {Array<File>} images 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async sendChatMessage(message: string, images: Array<File>, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.sendChatMessage(message, images, options);
            return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DefaultApiFp(configuration)
    return {
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getAvailableUsers(options?: any): AxiosPromise<GetAvailableUsers200Response> {
            return localVarFp.getAvailableUsers(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {number} [timestamp] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getChatMessages(timestamp?: number, options?: any): AxiosPromise<Array<ChatMessage>> {
            return localVarFp.getChatMessages(timestamp, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getUserProfile(options?: any): AxiosPromise<GetAvailableUsers200Response> {
            return localVarFp.getUserProfile(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {LoginRequest} [loginRequest] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        login(loginRequest?: LoginRequest, options?: any): AxiosPromise<void> {
            return localVarFp.login(loginRequest, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @param {string} message 
         * @param {Array<File>} images 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        sendChatMessage(message: string, images: Array<File>, options?: any): AxiosPromise<void> {
            return localVarFp.sendChatMessage(message, images, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getAvailableUsers(options?: AxiosRequestConfig) {
        return DefaultApiFp(this.configuration).getAvailableUsers(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {number} [timestamp] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getChatMessages(timestamp?: number, options?: AxiosRequestConfig) {
        return DefaultApiFp(this.configuration).getChatMessages(timestamp, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getUserProfile(options?: AxiosRequestConfig) {
        return DefaultApiFp(this.configuration).getUserProfile(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {LoginRequest} [loginRequest] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public login(loginRequest?: LoginRequest, options?: AxiosRequestConfig) {
        return DefaultApiFp(this.configuration).login(loginRequest, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @param {string} message 
     * @param {Array<File>} images 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public sendChatMessage(message: string, images: Array<File>, options?: AxiosRequestConfig) {
        return DefaultApiFp(this.configuration).sendChatMessage(message, images, options).then((request) => request(this.axios, this.basePath));
    }
}


