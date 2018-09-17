import RxDB from 'rxdb';
RxDB.plugin(require('pouchdb-adapter-asyncstorage').default);

import {eventSchema} from "./schemas/event";

const databaseName = 'ticket721eventscanner';

export let rxdb;

export const load = () => {
    return new Promise(async (ok, ko) => {
        if (rxdb) return ok(rxdb);
        try {
            //await RxDB.removeDatabase(databaseName, 'asyncstorage');
            rxdb = await RxDB.create({
                name: databaseName,
                adapter: 'asyncstorage',
                password: 'local_password',
                multiInstance: false
            });

            const eventCollection = await rxdb.collection({
                name: 'events',
                schema: eventSchema
            });

            ok(rxdb);
        } catch (e) {
            console.log(e);
            ko(e);
        }
    });
};
