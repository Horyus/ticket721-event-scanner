export const EventActionTypes = {
    EventLoad: 'EVENT_LOAD',
    EventLoaded: 'EVENT_LOADED',
    EventCreate: 'EVENT_CREATE',
    EventDelete: 'EVENT_DELETE',
    EventAdd: 'EVENT_ADD',
    EventSelect: 'EVENT_SELECT',
    EventLoadedContracts: 'EVENT_LOADED_CONTRACTS'
};

export const EventLoadedContracts = (contracts) => {
    return {
        type: EventActionTypes.EventLoadedContracts,
        contracts: {
            status: 'LOADED',
            ...contracts
        }
    };
};

export const EventLoad = () => {
    return {
        type: EventActionTypes.EventLoad
    }
};

export const EventLoaded = (events) => {
    return {
        type: EventActionTypes.EventLoaded,
        events
    }
};

export const EventCreate = (event) => {
    return {
        type: EventActionTypes.EventCreate,
        event
    }
};

export const EventDelete = (event_idx) => {
    return {
        type: EventActionTypes.EventDelete,
        event_idx
    }
};

export const EventAdd = (user_info, event_idx) => {
    return {
        type: EventActionTypes.EventAdd,
        event_idx,
        user_info
    }
};

export const EventSelect = (event_idx) => {
    return {
        type: EventActionTypes.EventSelect,
        event_idx
    }
}
