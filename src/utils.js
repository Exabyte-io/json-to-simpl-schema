import SimpleSchema from "simpl-schema";

/**
 *
 *  There's no native implementation of AnyOf in SimpleSchema, but there is an implementation of OneOf
 *  In general, all AnyOf are a special case OneOf and any AnyOf could be converted to OneOf
 *  Example:
 *  {
 *      anyOf: [
 *          { field1: { type: string } },
 *           { field2: { type: string } }
 *       ]
 *   }
 *   is equivalent to
 *   {
 *      oneOf: [
 *           { field1: { type: string } },
 *           { field2: { type: string } },
 *           {
 *              allOf: [
 *                  { field1: { type: string } },
 *                  { field2: { type: string } },
 *              ]
 *           }
 *       ]
 *   }
 *   Remove this function in case native support of AnyOf is implemented
 */
export function convertAnyOfToOneOf(anyOf) {
    const oneOf = anyOf.reduce((combinations, schema) => {
        const result = combinations.reduce(
            (tempArr, cur) => [...tempArr, [...cur, schema]],
            [[schema]],
        );
        return [...combinations, ...result];
    }, []);

    return oneOf.map((schemas) => ({ allOf: schemas }));
}

export function getJsonSchemaProperties(schema) {
    if (!schema) {
        return {};
    }

    /**
     * SimpleSchema does not support oneOf at the root level at the moment.
     * But there are a number of schemas that refers to only one single schema in oneOf/anyOf statement and this case can be handled
     */
    const { allOf = [], oneOf = [], anyOf = [] } = schema;

    const allOfProps = {
        ...Object.assign({}, ...allOf.map(getJsonSchemaProperties).flat()),
        ...getJsonSchemaProperties(oneOf[0]),
        ...getJsonSchemaProperties(anyOf[0]),
    };

    const schemaProps = schema.properties || {};

    return { ...allOfProps, ...schemaProps };
}

export function getSchemaRequiredProperties(schema) {
    if (!schema) {
        return [];
    }

    const { allOf = [], oneOf = [], anyOf = [] } = schema;

    const allOfRequiredProperties = [
        ...allOf.map(getSchemaRequiredProperties).flat(),
        ...getSchemaRequiredProperties(oneOf[0]),
        ...getSchemaRequiredProperties(anyOf[0]),
    ];

    const schemaRequiredProperties = schema.required || [];

    return allOfRequiredProperties.concat(schemaRequiredProperties);
}

export function getOptionalOption(propertyName, schema) {
    const requiredProperties = getSchemaRequiredProperties(schema);

    return !requiredProperties.includes(propertyName);
}

export function getBlackboxOption(jsonProperty) {
    return Boolean(jsonProperty.additionalProperties);
}

export function getAllowedValuesOption(jsonProperty) {
    if (jsonProperty.enum) {
        return jsonProperty.enum.filter((item) => item !== null);
    }
}

export function getRegExOption(jsonProperty) {
    const { pattern, format } = jsonProperty;

    if (pattern) {
        return new RegExp(pattern);
    }

    switch (format) {
        case "email":
            return SimpleSchema.RegEx.Email;
        case "host-name":
        case "hostname":
            return SimpleSchema.RegEx.Domain;
        case "ipv4":
            return SimpleSchema.RegEx.IPv4;
        case "ipv6":
            return SimpleSchema.RegEx.IPv6;
        default:
    }
}

export function translateOptions(jsonProperty) {
    const translationMap = {
        title: { key: "label" },
        minimum: { key: "min", type: Number },
        maximum: { key: "max", type: Number },
        exclusiveMinimum: { key: "exclusiveMin", type: Boolean },
        exclusiveMaximum: { key: "exclusiveMax", type: Boolean },
        minLength: { key: "min", type: Number },
        maxLength: { key: "max", type: Number },
        minItems: { key: "minCount", type: Number },
        maxItems: { key: "maxCount", type: Number },
        default: { key: "defaultValue" },
    };

    const entries = Object.entries(translationMap)
        .map(([optionName, { key: mappedKey, type }]) => {
            if (jsonProperty[optionName]) {
                const mappedValue = type
                    ? type(jsonProperty[optionName])
                    : jsonProperty[optionName];

                return [mappedKey, mappedValue];
            }
            return null;
        })
        .filter((entry) => Array.isArray(entry));

    return Object.fromEntries(entries);
}

export function getPrimitivePropertyType(jsonProperty) {
    if (!jsonProperty.type) {
        if (jsonProperty.properties) {
            return Object;
        }
        if (jsonProperty.items) {
            return Array;
        }
        return String;
    }

    switch (jsonProperty.type) {
        case "integer":
            return SimpleSchema.Integer;
        case "number":
            return Number;
        case "boolean":
            return Boolean;
        case "object":
            return Object;
        case "array":
            return Array;
        default:
            return ["date-time", "date"].includes(jsonProperty.format) ? Date : String;
    }
}
