import { expect } from "chai";
import SimpleSchema from "simpl-schema";

import JsonToSimpleSchema from "../src/index";

const packageJsonSchema = {
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
        color: {
            type: "string",
            enum: ["red", "orange", "yellow", "green", "blue", "indigo", "violet", null],
        },
        emailAddress: {
            type: "string",
            format: "email",
        },
    },
    required: ["id", "name", "price"],
    additionalProperties: true, // ignore additionalProperties option at root level since SimpleSchema doesn't support blackbox at root level.
};

const allOf = [
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

describe("JsonToSimpleSchema", () => {
    it("Validate", () => {
        const simpleSchema = new JsonToSimpleSchema(packageJsonSchema).toSimpleSchema();
        const rawSchema = simpleSchema._schema;

        expect(rawSchema.id.type.definitions[0].type).to.equal(SimpleSchema.Integer);
        expect(rawSchema.id.optional).to.equal(false);

        expect(rawSchema.name.type.definitions[0].type).to.equal(String);
        expect(rawSchema.name.optional).to.equal(false);

        expect(rawSchema.price.type.definitions[0].type).to.equal(Number);
        expect(rawSchema.price.type.definitions[0].min).to.equal(0);
        expect(rawSchema.price.type.definitions[0].exclusiveMin).to.equal(true);
        expect(rawSchema.price.optional).to.equal(false);

        expect(rawSchema.tags.type.definitions[0].type).to.equal(Array);
        expect(rawSchema.tags.type.definitions[0].minCount).to.equal(1);
        expect(rawSchema.tags.optional).to.equal(true);
        expect(rawSchema["tags.$"].type.definitions[0].type).to.equal(String);
        expect(rawSchema["tags.$"].optional).to.equal(true);

        expect(rawSchema.arrayOfObjects.type.definitions[0].type).to.equal(Array);
        expect(rawSchema.arrayOfObjects.optional).to.equal(true);
        expect(
            rawSchema["arrayOfObjects.$"].type.definitions[0].type._schema.foo.type.definitions[0]
                .type,
        ).to.equal(String);
        expect(rawSchema["arrayOfObjects.$"].optional).to.equal(true);

        expect(rawSchema.arrayWithAdditionalProperties.type.definitions[0].type).to.equal(Array);
        expect(rawSchema["arrayWithAdditionalProperties.$"].type.definitions[0].type).to.equal(
            Object,
        );
        expect(rawSchema["arrayWithAdditionalProperties.$"].type.definitions[0].blackbox).to.equal(
            true,
        );

        expect(rawSchema.objectWithAdditionalProps.type.definitions[0].type).to.equal(Object);
        expect(rawSchema.objectWithAdditionalProps.type.definitions[0].blackbox).to.equal(true);

        expect(rawSchema.color.type.definitions[0].type).to.equal(String);
        expect(rawSchema.color.type.definitions[0].allowedValues.length).to.equal(7);

        expect(rawSchema.emailAddress.type.definitions[0].type).to.equal(String);
        expect(rawSchema.emailAddress.type.definitions[0].regEx).to.equal(SimpleSchema.RegEx.Email);

        simpleSchema.validate({
            id: 1,
            name: "test",
            price: 5.5,
            tags: ["test", "test"],
            arrayOfObjects: [{ foo: "foo" }],
            color: "red",
            emailAddress: "test@test.com",
        });
    });

    it("AllOf", () => {
        const simpleSchema = new JsonToSimpleSchema({
            allOf,
            ...packageJsonSchema,
        }).toSimpleSchema();

        const rawSchema = simpleSchema._schema;

        expect(rawSchema._id.type.definitions[0].type).to.equal(String);
        expect(rawSchema._id.optional).to.equal(false);

        expect(rawSchema.schemaVersion.type.definitions[0].type).to.equal(String);
        expect(rawSchema.schemaVersion.optional).to.equal(false);

        expect(rawSchema.createdAt.type.definitions[0].type).to.equal(Date);
        expect(rawSchema.createdAt.optional).to.equal(false);

        expect(rawSchema.updatedAt.type.definitions[0].type).to.equal(Date);
        expect(rawSchema.updatedAt.optional).to.equal(false);

        expect(rawSchema.removed.type.definitions[0].type).to.equal(Boolean);
        expect(rawSchema.removed.optional).to.equal(true);

        expect(rawSchema.removedAt.type.definitions[0].type).to.equal(Date);
        expect(rawSchema.removedAt.optional).to.equal(true);

        expect(rawSchema.slug.type.definitions[0].type).to.equal(String);

        simpleSchema.validate({
            id: 1,
            _id: "TT",
            schemaVersion: "df",
            slug: "test",
            name: "test",
            price: 5.5,
            tags: ["test", "test"],
            arrayOfObjects: [{ foo: "foo" }],
            color: "red",
            emailAddress: "test@test.com",
            removed: false,
            createdAt: new Date("2022-12-20"),
            updatedAt: new Date("2022-12-20"),
        });
    });
});
