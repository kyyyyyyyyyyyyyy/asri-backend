export const createProductMultipartSchema = {
  fields: {
    store_id: {
      required: true,
      type: "string",
    } as const,

    category_id: {
      required: false,
      type: "string",
    } as const,

    name: {
      required: true,
      type: "string",
    } as const,

    description: {
      required: false,
      type: "string",
    } as const,

    price: {
      required: true,
      type: "number",
    } as const,

    stock: {
      required: false,
      type: "number",
    } as const,
  },
} as const;

export const updateProductMultipartSchema = {
  fields: {
    category_id: {
      required: false,
      type: "string",
    },

    name: {
      required: false,
      type: "string",
    },

    description: {
      required: false,
      type: "string",
    },

    price: {
      required: false,
      type: "number",
    },

    stock: {
      required: false,
      type: "number",
    },

    status: {
      required: false,
      type: "string",
    },

    delete_images: {
      required: false,
      type: "string",
    }
  },
} as const;