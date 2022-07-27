export default [
    {
        properties: {
            vectors: {
                schemaId: "properties-directory-structural-lattice-lattice-vectors",
                $schema: "http://json-schema.org/draft-04/schema#",
                title: "lattice explicit unit",
                allOf: [
                    {
                        schemaId: "core-abstract-3d-vector-basis",
                        $schema: "http://json-schema.org/draft-04/schema#",
                        title: "3 dimensional vector basis",
                        type: "object",
                        properties: {
                            a: {
                                schemaId: "core-primitive-array-of-3-numbers",
                                $schema: "http://json-schema.org/draft-04/schema#",
                                title: "array of 3 number elements schema",
                                type: "array",
                                items: {
                                    type: "number",
                                },
                                minItems: 3,
                                maxItems: 3,
                            },
                            b: {
                                schemaId: "core-primitive-array-of-3-numbers",
                                $schema: "http://json-schema.org/draft-04/schema#",
                                title: "array of 3 number elements schema",
                                type: "array",
                                items: {
                                    type: "number",
                                },
                                minItems: 3,
                                maxItems: 3,
                            },
                            c: {
                                schemaId: "core-primitive-array-of-3-numbers",
                                $schema: "http://json-schema.org/draft-04/schema#",
                                title: "array of 3 number elements schema",
                                type: "array",
                                items: {
                                    type: "number",
                                },
                                minItems: 3,
                                maxItems: 3,
                            },
                        },
                        required: ["a", "b", "c"],
                    },
                ],
                properties: {
                    alat: {
                        description: "lattice parameter for fractional coordinates",
                        type: "number",
                        default: 1,
                    },
                    units: {
                        enum: [
                            "km",
                            "m",
                            "pm",
                            "nm",
                            "angstrom",
                            "a.u.",
                            "bohr",
                            "fractional",
                            "crystal",
                            "cartesian",
                            "alat",
                        ],
                    },
                },
            },
        },
        required: ["vectors"],
    },
    {
        schemaId: "properties-directory-structural-lattice-lattice-bravais",
        $schema: "http://json-schema.org/draft-04/schema#",
        title: "lattice implicit schema",
        allOf: [
            {
                schemaId: "core-primitive-3d-lattice",
                $schema: "http://json-schema.org/draft-04/schema#",
                title: "3 dimensional lattice schema",
                type: "object",
                properties: {
                    a: {
                        description: "length of the first lattice vector",
                        type: "number",
                    },
                    b: {
                        description: "length of the second lattice vector",
                        type: "number",
                    },
                    c: {
                        description: "length of the third lattice vector",
                        type: "number",
                    },
                    alpha: {
                        description: "angle between first and second lattice vector",
                        type: "number",
                    },
                    beta: {
                        description: "angle between second and third lattice vector",
                        type: "number",
                    },
                    gamma: {
                        description: "angle between first and third lattice vector",
                        type: "number",
                    },
                },
                required: ["a", "b", "c", "alpha", "beta", "gamma"],
            },
        ],
        properties: {
            type: {
                description: "Bravais lattice type in short notation",
                type: "string",
                enum: [
                    "CUB",
                    "BCC",
                    "FCC",
                    "TET",
                    "MCL",
                    "ORC",
                    "ORCC",
                    "ORCF",
                    "ORCI",
                    "HEX",
                    "BCT",
                    "TRI",
                    "MCLC",
                    "RHL",
                ],
            },
            units: {
                type: "object",
                properties: {
                    length: {
                        type: "string",
                        enum: ["angstrom", "bohr"],
                    },
                    angle: {
                        type: "string",
                        enum: ["degree", "radian"],
                    },
                },
            },
        },
        required: ["type"],
    },
    {
        type: "string",
    },
    {
        properties: {
            arrayField: {
                oneOf: [
                    {
                        type: "array",
                        items: {
                            type: "number",
                        },
                    },
                    {
                        type: "array",
                        items: {
                            type: "boolean",
                        },
                    },
                ],
            },
        },
    },
];
