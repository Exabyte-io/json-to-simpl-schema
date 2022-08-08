import SimpleSchema from "simpl-schema";

// import SimpleSchema from "./simpl-schema/package/dist/main";
import {
    convertAnyOfToOneOf,
    getAllowedValuesOption,
    getBlackboxOption,
    getJsonSchemaProperties,
    getOptionalOption,
    getPrimitivePropertyType,
    getRegExOption,
    translateOptions,
} from "./utils";

const schemaCache = new Map();

export default class JsonToSimpleSchema {
    constructor(jsonSchema) {
        this.jsonSchema = jsonSchema;
    }

    toSimpleSchema() {
        const schemaId = this.jsonSchema?.schemaId;
        const properties = getJsonSchemaProperties(this.jsonSchema);

        if (schemaId && schemaCache.has(schemaId)) {
            return schemaCache.get(schemaId);
        }

        const simpleSchemaEntries = Object.entries(properties).reduce(
            (accumulatedEntries, [propertyName, jsonProperty]) => {
                const simpleSchemaProperty = {
                    ...JsonToSimpleSchema.getSimpleSchemaTypeOption(jsonProperty),
                    ...getOptionalOption(propertyName, this.jsonSchema),
                    ...getBlackboxOption(jsonProperty),
                    ...getAllowedValuesOption(jsonProperty),
                    ...getRegExOption(jsonProperty),
                    ...translateOptions(jsonProperty),
                };

                const propertyEntry = [propertyName, simpleSchemaProperty];
                const arrayEntry =
                    simpleSchemaProperty.type === Array
                        ? [JsonToSimpleSchema.getArrayEntry(propertyName, jsonProperty)]
                        : [];

                return accumulatedEntries.concat([propertyEntry, ...arrayEntry]);
            },
            [],
        );

        const schema = new SimpleSchema(Object.fromEntries(simpleSchemaEntries));

        if (schemaId) {
            schemaCache.set(schemaId, schema);
        }

        return schema;
    }

    static getSimpleSchemaTypeOption(jsonProperty) {
        const oneOfSchemas = jsonProperty.anyOf
            ? convertAnyOfToOneOf(jsonProperty.anyOf)
            : jsonProperty.oneOf;

        if (oneOfSchemas) {
            const schemas = oneOfSchemas.map((schema) => {
                const primitiveType = getPrimitivePropertyType(schema);

                if (primitiveType === Object) {
                    const { oneOf, anyOf, ...restJsonProperty } = jsonProperty;
                    const baseSchema = new JsonToSimpleSchema(restJsonProperty).toSimpleSchema();
                    const oneOfSchema = new JsonToSimpleSchema(schema).toSimpleSchema();

                    return oneOfSchema.extend(baseSchema);
                }

                return primitiveType;
            });

            if (schemas.every((schema) => schema === Array)) {
                return { type: Array };
            }

            return { type: SimpleSchema.oneOf(...schemas) };
        }

        const primitiveType = getPrimitivePropertyType(jsonProperty);

        const typeOption =
            primitiveType === Object &&
            ((jsonProperty.properties && !jsonProperty.additionalProperties) || jsonProperty.allOf)
                ? new JsonToSimpleSchema(jsonProperty).toSimpleSchema()
                : primitiveType;

        return { type: typeOption };
    }

    static getArrayEntry(propertyName, jsonProperty) {
        if (jsonProperty.oneOf) {
            const arrayValues = jsonProperty.oneOf.map(
                (schema) => this.getArrayEntry(propertyName, schema)[1],
            );

            return [`${propertyName}.$`, SimpleSchema.oneOf(...arrayValues)];
        }

        return [
            `${propertyName}.$`,
            {
                ...JsonToSimpleSchema.getSimpleSchemaTypeOption(jsonProperty.items),
                ...getBlackboxOption(jsonProperty.items),
                ...getAllowedValuesOption(jsonProperty.items),
                ...getRegExOption(jsonProperty.items),
                ...translateOptions(jsonProperty.items),
            },
        ];
    }
}
