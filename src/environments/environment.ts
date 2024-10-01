import { config } from '../configService';

export const environment = {
    baseUrl: 'https://localhost:7041/api/',
    apiUrl: 'https://localhost:7041/api/',
};

export const environmentDocker = {
    baseUrl: config?.apiUrl,
    apiUrl: config?.apiUrl
};

export const environmentServerMaps = {
    baseUrl: config?.mapserverUrl,
};