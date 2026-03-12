const path = require("path");
const fs = require("fs");

const extractFields = (schemaPaths, prefix = "") => {
  let fields = "";

  for (const [fieldName, fieldObj] of Object.entries(schemaPaths)) {
    if (["__v", "id"].includes(fieldName)) continue;

    const fullName = prefix ? `${prefix}.${fieldName}` : fieldName;

    // ✅ Check array of sub-documents FIRST (before schema check)
    if (fieldObj.$isMongooseDocumentArray) {
      fields += `  - ${fullName}: Array of Objects\n`;
      fields += extractFields(fieldObj.schema.paths, `  ${fullName}[]`);
      continue;
    }

    // Handle nested objects (sub-schemas)
    if (fieldObj.schema) {
      fields += `  - ${fullName}: Object\n`;
      fields += extractFields(fieldObj.schema.paths, `  ${fullName}`);
      continue;
    }

    // Handle primitive arrays (e.g. [String])
    if (fieldObj.$isMongooseArray) {
      fields += `  - ${fullName}: Array of ${fieldObj.caster?.instance || "Mixed"}\n`;
      continue;
    }

    // Normal field
    const type = fieldObj.instance || "Mixed";
    const required = fieldObj.isRequired ? " (required)" : "";
    const ref = fieldObj.options?.ref ? ` (ref: ${fieldObj.options.ref})` : "";
    const enumVals = fieldObj.enumValues?.length
      ? ` (enum: ${fieldObj.enumValues.join(", ")})`
      : "";

    fields += `  - ${fullName}: ${type}${required}${ref}${enumVals}\n`;
  }

  return fields;
};

const extractSchema = () => {
  const modelsPath = path.join(__dirname, "models");
  const files = fs.readdirSync(modelsPath).filter((f) => f.endsWith(".js"));

  let schemaStr = "";

  for (const file of files) {
    const model = require(path.join(modelsPath, file));
    const collectionName = model.collection.name;

    schemaStr += `Collection: ${collectionName}\n`;
    schemaStr += extractFields(model.schema.paths);
    schemaStr += "\n";
  }

  return schemaStr;
};

module.exports = { extractSchema };
