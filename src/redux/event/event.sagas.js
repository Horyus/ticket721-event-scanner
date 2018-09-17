import {EventActionTypes, EventLoaded, EventLoadedContracts} from "./event.actions";
import {takeEvery, call, take, put, select} from 'redux-saga/effects';
import {eventChannel, END} from 'redux-saga';
import {load} from "../../rxdb";
import {providers, Contract} from 'ethers';

function EventCreateChannel(action) {
    return (eventChannel(emit => {

        load()
            .then(async (rxdb) => {
                await rxdb.events.insert({
                    name: action.event.name,
                    address: action.event.address,
                    scanned: []
                });
                emit(END);
            })
            .catch(e => {
                console.log(e);
                emit(END)
            });

        return (() => {});
    }));
}

function* EventCreateSaga(action) {

    const event_create_channel = yield call(EventCreateChannel, action);

    try {
        while (true) {
            const event = yield take(event_create_channel);
            yield put(event);
        }
    } finally {
        event_create_channel.close();
    }
}

function EventLoadChannel(action) {
    return (eventChannel(emit => {

        load()
            .then(async (rxdb) => {
                const events = await rxdb.events.find().exec();
                emit(EventLoaded(events.map(elem => {
                    return {
                        address: elem.address,
                        name: elem.name,
                        scanned: elem.scanned
                    }
                })));
                emit(END);
            })
            .catch(e => emit(END));


        return (() => {});

    }));
}

function* EventLoadSaga(action) {

    const event_load_channel = yield call(EventLoadChannel, action);

    try {
        while (true) {
            const event = yield take(event_load_channel);
            yield put(event);
        }
    } finally {
        event_load_channel.close();
    }
}

function* EventLoadContracts(action) {
    try {
        const {BC_URL, T721HUB_ADDRESS, T721HUB_ABI, T721PU_ADDRESS, T721PU_ABI, T721VE_ADDRESS, T721VE_ABI, BC_CHAIN_ID, BC_CHAIN_NAME} = (yield select()).event.env;
        const provider = new providers.JsonRpcProvider(BC_URL, {name: BC_CHAIN_NAME, chainId: BC_CHAIN_ID});
        const Ticket721Hub = new Contract(T721HUB_ADDRESS, T721HUB_ABI, provider);
        const Ticket721 = new Contract(T721VE_ADDRESS, T721VE_ABI, provider);
        const Ticket721Public = new Contract(T721PU_ADDRESS, T721PU_ABI, provider);
        yield put(EventLoadedContracts({
            Ticket721,
            Ticket721Hub,
            Ticket721Public
        }));
    } catch (e) {
        console.error(e);
    }
}

function* EventAdd_Channel(action) {

    const live_event = (yield select()).event.events[action.event_idx];

    return eventChannel((emit) => {

        load().then(async RxDB => {

            const events = await RxDB.events.find().exec();

            console.log(events.length);
            if (events.length < action.event_idx) return emit(END);

            console.log("Hmmm");
            await events[action.event_idx].update({$set: {scanned: live_event.scanned}});

            console.log("LIVE", live_event);
            console.log("LIVE 2", events[action.event_idx]);

            emit(END);

        }).catch(e => {
            emit(END);
        });

        return (() => {});

    });
}

function* EventAdd(action) {

    const event_add_channel = yield call(EventAdd_Channel, action);

    try {
       while (true) {
           const event = yield take(event_add_channel);
           yield put(event);
       }
    } finally {
        event_add_channel.close();
    }

}

export function* eventSagas() {
    yield takeEvery(EventActionTypes.EventCreate, EventCreateSaga);
    yield takeEvery(EventActionTypes.EventLoad, EventLoadSaga);
    yield takeEvery(EventActionTypes.EventLoad, EventLoadContracts);
    yield takeEvery(EventActionTypes.EventAdd, EventAdd);
}
