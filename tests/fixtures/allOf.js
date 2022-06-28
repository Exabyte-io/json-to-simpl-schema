export default [
    {
        schemaId: "system-entity",
        $schema: "http://json-schema.org/draft-04/schema#",
        title: "entity schema",
        allOf: [
            {
                schemaId: "system-timestampable",
                $schema: "http://json-schema.org/draft-04/schema#",
                title: "timestampable entity schema",
                properties: {
                    createdAt: {
                        description: "entity creation time",
                        type: "string",
                        format: "date",
                    },
                    updatedAt: {
                        description: "entity last modification time",
                        type: "string",
                        format: "date",
                    },
                },
                required: ["createdAt", "updatedAt"],
            },
            {
                schemaId: "system-soft-removable",
                $schema: "http://json-schema.org/draft-04/schema#",
                title: "soft removable entity schema",
                properties: {
                    removedAt: {
                        description: "Timestamp of the moment when entity was removed",
                        type: "string",
                        format: "date",
                    },
                    removed: {
                        description: "Identifies that entity was removed",
                        type: "boolean",
                    },
                },
            },
            {
                schemaId: "system-name",
                $schema: "http://json-schema.org/draft-04/schema#",
                title: "timestampable entity schema",
                properties: {
                    name: {
                        description: "entity name",
                        type: "string",
                        maxLength: 300,
                    },
                    slug: {
                        description: "entity slug",
                        type: "string",
                    },
                },
                required: ["name", "slug"],
            },
        ],
        properties: {
            _id: {
                description: "entity identity",
                type: "string",
            },
            schemaVersion: {
                description: "entity's schema version. Used to distinct between different schemas.",
                type: "string",
            },
        },
        required: ["_id", "schemaVersion"],
    },
];
