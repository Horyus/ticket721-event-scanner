import RxDB from 'rxdb';
RxDB.plugin(require('pouchdb-adapter-asyncstorage').default);

import {walletSchema} from "./schemas/wallet";
import {eventSchema} from "./schemas/event";

const databaseName = 'ticket721companion';

export let rxdb;

export const load = () => {
    return new Promise(async (ok, ko) => {
        if (rxdb) return ok(rxdb);
        try {
            rxdb = await RxDB.create({
                name: databaseName,
                adapter: 'asyncstorage',
                password: 'local_password',
                multiInstance: false
            });

            const eventCollection = await rxdb.collection({
                name: 'event',
                schema: eventSchema
            });

            ok(rxdb);
        } catch (e) {
            ko(e);
        }
    });
};
