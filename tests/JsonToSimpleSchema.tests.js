import { expect } from "chai";
import SimpleSchema from "simpl-schema";

import JsonToSimpleSchema from "../src/main";
import allOf from "./fixtures/allOf";
import anyOf from "./fixtures/anyOf";
import baseJsonSchema from "./fixtures/baseJsonSchema";
import oneOf from "./fixtures/oneOf";

describe("JsonToSimpleSchema", () => {
    it("Base functionality", () => {
        const simpleSchema = new JsonToSimpleSchema(baseJsonSchema).toSimpleSchema();
        const rawSchema = simpleSchema._schema;

        expect(rawSchema.id.type.definitions[0].type).to.equal(SimpleSchema.Integer);
        expect(rawSchema.id.optional).to.equal(false);

        expect(rawSchema.name.type.definitions[0].type).to.equal(String);
        expect(rawSchema.name.optional).to.equal(false);

        expect(rawSchema.price.type.definitions[0].type).to.equal(Number);
        expect(rawSchema.price.type.definitions[0].min).to.equal(0);
        expect(rawSchema.price.type.definitions[0].exclusiveMin).to.equal(true);
        expect(rawSchema.price.optional).to.equal(false);
        expect(rawSchema.price.defaultValue).to.equal(0);

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

        expect(rawSchema.arrayOfStrings.type.definitions[0].type).to.equal(Array);
        expect(rawSchema["arrayOfStrings.$"].type.definitions[0].type).to.equal(String);

        expect(rawSchema.objectWithAdditionalProps.type.definitions[0].type).to.equal(Object);
        expect(rawSchema.objectWithAdditionalProps.type.definitions[0].blackbox).to.equal(true);

        expect(rawSchema.color.type.definitions[0].type).to.equal(String);
        expect(rawSchema.color.type.definitions[0].allowedValues.length).to.equal(7);

        expect(rawSchema.emailAddress.type.definitions[0].type).to.equal(String);
        expect(rawSchema.emailAddress.type.definitions[0].regEx).to.equal(SimpleSchema.RegEx.Email);

        expect(rawSchema.regExField.type.definitions[0].type).to.equal(String);

        expect(rawSchema.hostname.type.definitions[0].type).to.equal(String);
        expect(rawSchema.hostname.type.definitions[0].regEx).to.equal(SimpleSchema.RegEx.Domain);

        expect(rawSchema.ipv4.type.definitions[0].type).to.equal(String);
        expect(rawSchema.ipv4.type.definitions[0].regEx).to.equal(SimpleSchema.RegEx.IPv4);

        expect(rawSchema.ipv6.type.definitions[0].type).to.equal(String);
        expect(rawSchema.ipv6.type.definitions[0].regEx).to.equal(SimpleSchema.RegEx.IPv6);

        expect(rawSchema.emptyObject.type.definitions[0].type).to.equal(Object);
        expect(rawSchema.emptyObject.type.definitions[0].blackbox).to.equal(true);

        expect(rawSchema.flag.type.definitions[0].type).to.equal(Boolean);
        expect(rawSchema.flag.defaultValue).to.equal(false);

        simpleSchema.validate({
            id: 1,
            name: "test",
            price: 5.5,
            tags: ["test", "test"],
            arrayOfObjects: [{ foo: "foo" }],
            color: "red",
            emailAddress: "test@test.com",
            regExField: "sometest-it",
            hostname: "www.google.com",
            ipv4: "1.1.1.1",
            ipv6: "2001:0db8:11a3:09d7:1f34:8a2e:07a0:765d",
            emptyObject: {
                anyField: true,
            },
        });
    });

    it("AllOf", () => {
        const simpleSchema = new JsonToSimpleSchema({
            allOf,
            ...baseJsonSchema,
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

        // eslint-disable-next-line no-unused-expressions
        expect(rawSchema.arguments.defaultValue).to.be.empty;

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
            arguments: {
                nimage: 1,
            },
        });
    });

    it("OneOf", () => {
        const simpleSchema = new JsonToSimpleSchema({
            type: "object",
            properties: {
                field: {
                    oneOf,
                    properties: {
                        test: {
                            type: "string",
                        },
                    },
                    required: ["test"],
                },
            },
            required: ["field"],
        }).toSimpleSchema();

        simpleSchema.validate({
            field: {
                vectors: {
                    a: [1, 1, 1],
                    b: [1, 1, 1],
                    c: [1, 1, 1],
                    alat: 1,
                    units: "nm",
                },
                test: "test",
            },
        });

        simpleSchema.validate({
            field: {
                a: 1,
                b: 1,
                c: 1,
                alpha: 1,
                beta: 1,
                gamma: 1,
                type: "MCL",
                test: "test",
            },
        });

        simpleSchema.validate({
            field: "test",
        });

        simpleSchema.validate({
            field: {
                arrayField: [1],
                test: "test",
            },
        });

        simpleSchema.validate({
            field: {
                arrayField: [false],
                test: "test",
            },
        });
    });

    it("AnyOf", () => {
        const simpleSchema = new JsonToSimpleSchema({
            type: "object",
            properties: {
                field: {
                    anyOf,
                    properties: {
                        test: {
                            type: "string",
                        },
                    },
                    required: ["test"],
                },
            },
            required: ["field"],
        }).toSimpleSchema();

        const validObjects = [
            {
                title: "title",
                _id: "id",
                owner: {
                    _id: "_id",
                    cls: "cls",
                },
            },
            {
                conditions: [],
                authors: [],
                title: "title",
                method: "method",
                timestamp: 123,
            },
            {
                doi: "doi",
            },
        ];

        simpleSchema.validate({
            field: {
                test: "test",
                ...validObjects[0],
            },
        });

        simpleSchema.validate({
            field: {
                test: "test",
                ...validObjects[1],
            },
        });

        simpleSchema.validate({
            field: {
                test: "test",
                ...validObjects[2],
            },
        });

        simpleSchema.validate({
            field: {
                test: "test",
                ...validObjects[0],
                ...validObjects[1],
            },
        });

        simpleSchema.validate({
            field: {
                test: "test",
                ...validObjects[1],
                ...validObjects[2],
            },
        });

        simpleSchema.validate({
            field: {
                test: "test",
                ...validObjects[2],
                ...validObjects[3],
            },
        });

        simpleSchema.validate({
            field: {
                test: "test",
                ...validObjects[1],
                ...validObjects[2],
                ...validObjects[3],
            },
        });
    });

    it("Cache schemas", () => {
        new JsonToSimpleSchema({
            schemaId: "cache-test",
            ...baseJsonSchema,
        }).toSimpleSchema();

        const simpleSchema = new JsonToSimpleSchema({
            schemaId: "cache-test",
            type: "object",
            properties: {
                _id: {
                    description: "The unique identifier for a product",
                    type: "integer",
                },
            },
        }).toSimpleSchema();

        const rawSchema = simpleSchema._schema;

        // eslint-disable-next-line no-unused-expressions
        expect(rawSchema._id).to.be.undefined;

        expect(rawSchema.id.type.definitions[0].type).to.equal(SimpleSchema.Integer);
        expect(rawSchema.id.optional).to.equal(false);
    });
});
