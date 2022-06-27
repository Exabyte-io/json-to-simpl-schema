import SimpleSchema from "simpl-schema";

export function getJsonSchemaProperties(schema) {
    const defaultValue = schema.type === "object" ? {} : null;

    return schema.properties || defaultValue;
}

export function getOptionalOption(propertyName, schema) {
    const requiredProperties = schema.required || schema.items?.required || [];

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
