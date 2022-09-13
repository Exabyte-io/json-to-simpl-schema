export default {
    $schema: "http://json-schema.org/draft-04/schema#",
    title: "Product",
    description: "A product from Acme's catalog",
    type: "object",
    properties: {
        id: {
            description: "The unique identifier for a product",
            type: "integer",
        },
        name: {
            description: "Name of the product",
            type: "string",
        },
        price: {
            type: "number",
            minimum: "0", // test parsing of string values for number
            exclusiveMinimum: 1, // test parsing string values for boolean
            default: 0,
        },
        tags: {
            type: "array",
            items: {
                type: "string",
            },
            minItems: 1,
            uniqueItems: true,
        },
        arrayOfObjects: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    foo: { type: "string" },
                },
            },
        },
        objectWithAdditionalProps: {
            type: "object",
            properties: {
                blah: {
                    type: "string",
                },
            },
            additionalProperties: true,
        },
        arrayWithAdditionalProperties: {
            type: "array",
            items: {
                type: "object",
                additionalProperties: true,
                properties: {
                    test: { type: "string" },
                },
            },
        },
        arrayOfStrings: {
            items: {
                type: "string",
            },
        },
        color: {
            type: "string",
            enum: ["red", "orange", "yellow", "green", "blue", "indigo", "violet", null],
        },
        emailAddress: {
            type: "string",
            format: "email",
        },
        regExField: {
            type: "string",
            pattern: "test-it",
        },
        hostname: {
            type: "string",
            format: "hostname",
        },
        ipv4: {
            type: "string",
            format: "ipv4",
        },
        ipv6: {
            type: "string",
            format: "ipv6",
        },
        emptyObject: {
            type: "object",
        },
        flag: {
            type: "boolean",
            default: false,
        },
    },
    required: ["id", "name", "price"],
    additionalProperties: true, // ignore additionalProperties option at root level since SimpleSchema doesn't support blackbox at root level.
};
