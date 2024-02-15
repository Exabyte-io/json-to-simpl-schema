export default {
    $id: "webapp/flavor",
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {
        test: {
            type: "object",
            properties: {
                input: {
                    oneOf: [
                        {
                            type: "object",
                            properties: {
                                nSplits: {
                                    type: "number",
                                },
                                targets: {
                                    type: "array",
                                    items: {
                                        type: "string",
                                    },
                                },
                            },
                        },
                        {
                            type: "array",
                            items: {
                                oneOf: [
                                    {
                                        type: "object",
                                        properties: {
                                            templateId: {
                                                type: "string",
                                            },
                                            templateName: {
                                                type: "string",
                                            },
                                            name: {
                                                type: "string",
                                            },
                                        },
                                        additionalProperties: false,
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            scope: {
                                                type: "string",
                                            },
                                            name: {
                                                type: "string",
                                            },
                                        },
                                        required: ["scope", "name"],
                                    },
                                    {
                                        type: "object",
                                        properties: {
                                            name: {
                                                type: "string",
                                            },
                                            content: {
                                                type: "string",
                                            },
                                        },
                                        required: ["name", "content"],
                                    },
                                ],
                            },
                        },
                    ],
                },
            },
        },
    },
};
