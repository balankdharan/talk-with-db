const mongoose = require("mongoose");

// Dynamically get the correct mongoose model by collection name
const getModel = (collectionName) => {
  // Find registered mongoose model matching the collection
  const modelNames = mongoose.modelNames();

  const modelName = modelNames.find((name) => {
    const model = mongoose.model(name);
    return model.collection.name === collectionName;
  });

  if (!modelName)
    throw new Error(`No model found for collection '${collectionName}'`);

  return mongoose.model(modelName);
};

const executeMongoQuery = async (queryObj) => {
  const { collection, operation, filter, projection, sort, limit, pipeline } =
    queryObj;

  const Model = getModel(collection);
  const safeLimit = Math.min(limit || 20, 100);

  switch (operation) {
    case "find":
      return await Model.find(filter || {})
        .select(projection || {})
        .sort(sort || {})
        .limit(safeLimit)
        .lean(); // returns plain JS objects instead of mongoose documents

    case "aggregate":
      const hasLimit = pipeline.some((s) => s.$limit);
      const safePipeline = hasLimit
        ? pipeline
        : [...pipeline, { $limit: safeLimit }];
      return await Model.aggregate(safePipeline);

    case "count":
      const count = await Model.countDocuments(filter || {});
      return [{ count, collection }];

    default:
      throw new Error(`Unsupported operation: ${operation}`);
  }
};

module.exports = { executeMongoQuery };
