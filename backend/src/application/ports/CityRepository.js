import { assertPort } from './assertPort.js';

export const asCityRepository = (adapter) => assertPort(adapter, 'CityRepository', ['findAllNames']);
