export const VERSIONS = {
    queries: {
        getVersion: "select max(version) as version from versions;"
    },
    master: {
        2: {
            tables: [
                {
                    name: 'versions',
                    columns: [
                        { name: 'version', type: 'integer not null' },
                        { name: 'updated_at', type: 'text' }
                    ],
                },
            ],
            queries: []
        },
    },
    work: {
        1: {
            tables: [
                {
                    name: 'versions',
                    columns: [
                        { name: 'version', type: 'integer not null' },
                        { name: 'updated_at', type: 'text' }
                    ]
                }
            ]
        }
    }
};