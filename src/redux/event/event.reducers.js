import {EventActionTypes} from "./event.actions";

export const eventReducers = (state = {status: 'NONE', events: [], selected: -1, env: Expo.Constants.manifest.extra, contracts: {status: 'NONE'}}, action) => {

    switch (action.type) {
        case EventActionTypes.EventLoad:
            return {
                ...state,
                status: 'LOADING'
            };
        case EventActionTypes.EventLoaded:
            return {
                ...state,
                events: action.events,
                status: 'READY'
            };
        case EventActionTypes.EventCreate:
            return {
                ...state,
                events: [
                    ...state.events,
                    {
                        name: action.event.name,
                        address: action.event.address,
                        scanned: []
                    }
                ]
            };
        case EventActionTypes.EventDelete:
            delete state.events[action.event_idx];
            return {
                ...state,
                events: [
                    ...state.events
                ]
            };
        case EventActionTypes.EventAdd:

            console.log(action.event_idx, state.events);
            state.events[action.event_idx].scanned.push(action.user_info);
            return {
                ...state,
                events: [
                    ...state.events
                ]
            };
        case EventActionTypes.EventSelect:
            return {
                ...state,
                selected: action.event_idx
            };
        case EventActionTypes.EventLoadedContracts:
            return {
                ...state,
                contracts: action.contracts
            };
        default:
            return state;
    }

};
