import SimpleSchema from "simpl-schema";

// import SimpleSchema from "./simpl-schema/package/dist/main";
import {
    getAllowedValuesOption,
    getBlackboxOption,
    getJsonSchemaProperties,
    getOptionalOption,
    getPrimitivePropertyType,
    getRegExOption,
    translateOptions,
} from "./utils";

export default class JsonToSimpleSchema {
    constructor(jsonSchema) {
        this.jsonSchema = jsonSchema;
    }

    toSimpleSchema() {
        const properties = getJsonSchemaProperties(this.jsonSchema);

        const simpleSchemaEntries = Object.entries(properties).reduce(
            (accumulatedEntries, [propertyName, jsonProperty]) => {
                const simpleSchemaProperty = {
                    type: JsonToSimpleSchema.getSimpleSchemaTypeOption(jsonProperty),
                    optional: getOptionalOption(propertyName, this.jsonSchema),
                    blackbox: getBlackboxOption(jsonProperty),
                    allowedValues: getAllowedValuesOption(jsonProperty),
                    regEx: getRegExOption(jsonProperty),
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

        return new SimpleSchema(Object.fromEntries(simpleSchemaEntries));
    }

    static getSimpleSchemaTypeOption(jsonProperty) {
        const { oneOf, anyOf } = jsonProperty;

        if (oneOf || anyOf) {
            const schemas = (oneOf || anyOf).map((schema) => {
                const baseSchema = new JsonToSimpleSchema(jsonProperty).toSimpleSchema();
                const oneOfSchema = new JsonToSimpleSchema(schema).toSimpleSchema();

                return oneOfSchema.extend(baseSchema);
            });

            return SimpleSchema.oneOf(...schemas);
        }

        const primitiveType = getPrimitivePropertyType(jsonProperty);

        return primitiveType === Object &&
            jsonProperty.properties &&
            !jsonProperty.additionalProperties
            ? new JsonToSimpleSchema(jsonProperty).toSimpleSchema()
            : primitiveType;
    }

    static getArrayEntry(propertyName, jsonProperty) {
        return [
            `${propertyName}.$`,
            {
                type: JsonToSimpleSchema.getSimpleSchemaTypeOption(jsonProperty.items),
                blackbox: getBlackboxOption(jsonProperty.items),
                allowedValues: getAllowedValuesOption(jsonProperty.items),
                regEx: getRegExOption(jsonProperty.items),
                ...translateOptions(jsonProperty.items),
            },
        ];
    }
}
