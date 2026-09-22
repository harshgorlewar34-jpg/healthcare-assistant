const mongoose = require('mongoose');

const createModelProxy = (modelName, mongooseModel, memoryCollection, InstanceClass) => {
  // Callable constructor for `new Model(data)`
  function ModelConstructor(data) {
    if (mongoose.connection.readyState === 1) {
      return new mongooseModel(data);
    }
    if (InstanceClass) {
      return new InstanceClass(data);
    }
    return memoryCollection.createInstance ? memoryCollection.createInstance(data) : data;
  }

  // Attach methods
  const methods = [
    'find',
    'findOne',
    'findById',
    'create',
    'insertMany',
    'deleteMany',
    'countDocuments',
    'findOneAndDelete',
  ];

  methods.forEach((method) => {
    ModelConstructor[method] = function (...args) {
      if (mongoose.connection.readyState === 1) {
        return mongooseModel[method](...args);
      }
      return memoryCollection[method](...args);
    };
  });

  // Attach underlying mongoose model for schema refs
  ModelConstructor.schema = mongooseModel.schema;
  ModelConstructor.modelName = modelName;

  return ModelConstructor;
};

module.exports = { createModelProxy };
