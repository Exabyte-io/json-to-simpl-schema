export default [
    {
        schemaId: "core-reference-modeling",
        $schema: "http://json-schema.org/draft-04/schema#",
        title: "info for property obtained by modeling, only supports exabyte-originated data atm, but easily extendable",
        oneOf: [
            {
                schemaId: "core-reference-modeling-exabyte",
                $schema: "http://json-schema.org/draft-04/schema#",
                title: "info for characteristic obtained by exabyte calculation",
                properties: {
                    type: {
                        enum: ["exabyte"],
                    },
                    title: {
                        description: "Human-readable title of the job",
                        type: "string",
                        maxLength: 300,
                    },
                    _id: {
                        description: "job identifier",
                        type: "string",
                    },
                    owner: {
                        schemaId: "system-entity-reference",
                        $schema: "http://json-schema.org/draft-04/schema#",
                        title: "entity reference schema",
                        properties: {
                            _id: {
                                description: "entity identity",
                                type: "string",
                            },
                            cls: {
                                description: "entity class",
                                type: "string",
                            },
                            slug: {
                                description: "entity slug",
                                type: "string",
                            },
                        },
                        required: ["_id", "cls"],
                    },
                },
                required: ["title", "_id", "owner"],
            },
        ],
    },
    {
        schemaId: "core-reference-experiment",
        $schema: "http://json-schema.org/draft-04/schema#",
        title: "info for characteristic obtained by experiment",
        properties: {
            type: {
                enum: ["experiment"],
            },
            authors: {
                description: "experiment authors",
                type: "array",
                items: {
                    schemaId: "core-reference-literature-name",
                    $schema: "http://json-schema.org/draft-04/schema#",
                    title: "experiment author schema",
                    type: "object",
                    properties: {
                        first: {
                            type: "string",
                        },
                        middle: {
                            type: "string",
                        },
                        last: {
                            type: "string",
                        },
                        affiliation: {
                            type: "string",
                        },
                    },
                    required: ["first", "last"],
                },
            },
            title: {
                type: "string",
                description: "experiment title",
            },
            method: {
                type: "string",
                description: "method used in experiment",
            },
            conditions: {
                type: "array",
                items: {
                    schemaId: "core-reference-experiment-condition",
                    $schema: "http://json-schema.org/draft-04/schema#",
                    title: "condition schema",
                    properties: {
                        units: {
                            description: "condition unit",
                            type: "string",
                        },
                        scalar: {
                            description: "array of condition values",
                            type: "array",
                            items: {
                                properties: {
                                    value: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                        name: {
                            description: "human-readable name of the condition",
                            type: "string",
                        },
                    },
                    required: ["name"],
                },
            },
            location: {
                schemaId: "core-reference-experiment-location",
                $schema: "http://json-schema.org/draft-04/schema#",
                title: "location schema",
                properties: {
                    latitude: {
                        description: "location latitude",
                        type: "number",
                    },
                    longitude: {
                        description: "location longitude",
                        type: "number",
                    },
                },
                required: ["latitude", "longitude"],
            },
            timestamp: {
                description: "epoch time.",
                type: "number",
            },
            note: {
                description: "Note about experiment",
                type: "string",
            },
            references: {
                type: "array",
                description: "references to literature articles",
                items: {
                    schemaId: "core-reference-literature",
                    $schema: "http://json-schema.org/draft-04/schema#",
                    title: "literature reference schema",
                    properties: {
                        type: {
                            enum: ["literature"],
                        },
                        doi: {
                            type: "string",
                            description: "Digital Object Identifier of the reference.",
                        },
                        isbn: {
                            type: "string",
                            description: "International Standard Book Number of the reference.",
                        },
                        issn: {
                            type: "string",
                            description: "International Standard Serial Number of the reference.",
                        },
                        url: {
                            type: "string",
                            description: "Internet address of the reference.",
                        },
                        title: {
                            type: "string",
                            description: "Title of the work.",
                        },
                        publisher: {
                            type: "string",
                            description: "Publisher of the work.",
                        },
                        journal: {
                            type: "string",
                            description: "Journal in which the work appeared.",
                        },
                        volume: {
                            type: "string",
                            description: "Volume of the series in which the work appeared.",
                        },
                        year: {
                            type: "string",
                            description: "Year in which the reference was published.",
                        },
                        issue: {
                            type: "string",
                            description: "Issue of the collection in which the work appeared.",
                        },
                        pages: {
                            type: "object",
                            description: "Start and end pages of the work.",
                            allOf: [
                                {
                                    schemaId: "core-reference-literature-pages",
                                    $schema: "http://json-schema.org/draft-04/schema#",
                                    title: "pages schema",
                                    type: "object",
                                    properties: {
                                        start: {
                                            type: "string",
                                        },
                                        end: {
                                            type: "string",
                                        },
                                    },
                                    required: ["start"],
                                },
                            ],
                        },
                        authors: {
                            type: "array",
                            description: "List of authors of the work.",
                            items: {
                                schemaId: "core-reference-literature-name",
                                $schema: "http://json-schema.org/draft-04/schema#",
                                title: "experiment author schema",
                                type: "object",
                                properties: {
                                    first: {
                                        type: "string",
                                    },
                                    middle: {
                                        type: "string",
                                    },
                                    last: {
                                        type: "string",
                                    },
                                    affiliation: {
                                        type: "string",
                                    },
                                },
                                required: ["first", "last"],
                            },
                        },
                        editors: {
                            type: "array",
                            description: "List of editors of the work.",
                            items: {
                                schemaId: "core-reference-literature-name",
                                $schema: "http://json-schema.org/draft-04/schema#",
                                title: "experiment author schema",
                                type: "object",
                                properties: {
                                    first: {
                                        type: "string",
                                    },
                                    middle: {
                                        type: "string",
                                    },
                                    last: {
                                        type: "string",
                                    },
                                    affiliation: {
                                        type: "string",
                                    },
                                },
                                required: ["first", "last"],
                            },
                        },
                        reference: {
                            type: "array",
                            items: {
                                type: "object",
                            },
                            description:
                                "References cited by the work. Reference objects can nest as deeply as needed. This is useful, for example, when tracking the history of a value referenced in a scholarly article; the top level reference would contain information about where the data was accessed while the nested reference would contain information about where it was originally published.",
                        },
                    },
                },
            },
        },
        required: ["conditions", "authors", "title", "method", "timestamp"],
    },
    {
        schemaId: "core-reference-literature",
        $schema: "http://json-schema.org/draft-04/schema#",
        title: "literature reference schema",
        properties: {
            type: {
                enum: ["literature"],
            },
            doi: {
                type: "string",
                description: "Digital Object Identifier of the reference.",
            },
            isbn: {
                type: "string",
                description: "International Standard Book Number of the reference.",
            },
            issn: {
                type: "string",
                description: "International Standard Serial Number of the reference.",
            },
            url: {
                type: "string",
                description: "Internet address of the reference.",
            },
            title: {
                type: "string",
                description: "Title of the work.",
            },
            publisher: {
                type: "string",
                description: "Publisher of the work.",
            },
            journal: {
                type: "string",
                description: "Journal in which the work appeared.",
            },
            volume: {
                type: "string",
                description: "Volume of the series in which the work appeared.",
            },
            year: {
                type: "string",
                description: "Year in which the reference was published.",
            },
            issue: {
                type: "string",
                description: "Issue of the collection in which the work appeared.",
            },
            pages: {
                type: "object",
                description: "Start and end pages of the work.",
                allOf: [
                    {
                        schemaId: "core-reference-literature-pages",
                        $schema: "http://json-schema.org/draft-04/schema#",
                        title: "pages schema",
                        type: "object",
                        properties: {
                            start: {
                                type: "string",
                            },
                            end: {
                                type: "string",
                            },
                        },
                        required: ["start"],
                    },
                ],
            },
            authors: {
                type: "array",
                description: "List of authors of the work.",
                items: {
                    schemaId: "core-reference-literature-name",
                    $schema: "http://json-schema.org/draft-04/schema#",
                    title: "experiment author schema",
                    type: "object",
                    properties: {
                        first: {
                            type: "string",
                        },
                        middle: {
                            type: "string",
                        },
                        last: {
                            type: "string",
                        },
                        affiliation: {
                            type: "string",
                        },
                    },
                    required: ["first", "last"],
                },
            },
            editors: {
                type: "array",
                description: "List of editors of the work.",
                items: {
                    schemaId: "core-reference-literature-name",
                    $schema: "http://json-schema.org/draft-04/schema#",
                    title: "experiment author schema",
                    type: "object",
                    properties: {
                        first: {
                            type: "string",
                        },
                        middle: {
                            type: "string",
                        },
                        last: {
                            type: "string",
                        },
                        affiliation: {
                            type: "string",
                        },
                    },
                    required: ["first", "last"],
                },
            },
            reference: {
                type: "array",
                items: {
                    type: "object",
                },
                description:
                    "References cited by the work. Reference objects can nest as deeply as needed. This is useful, for example, when tracking the history of a value referenced in a scholarly article; the top level reference would contain information about where the data was accessed while the nested reference would contain information about where it was originally published.",
            },
        },
    },
];
