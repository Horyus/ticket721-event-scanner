export const eventSchema = {
    title: 'event_schema',
    description: 'Schema to store informations about scanned people',
    version: 0,
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        address: {
            type: 'string'
        },
        scanned: {
            type: 'array',
            items: {
                type: 'number'
            }
        }
    },
    required: ['name', 'address']
};
