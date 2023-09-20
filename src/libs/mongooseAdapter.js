// libs/mongooseAdapter.js
const mongooseAdapter = (model) => {
  return {
    async get(id) {
      return model.findById(id).lean();
    },

    async insert(data) {
      const doc = new model(data);
      await doc.save();
      return doc.toJSON();
    },

    async update(id, data) {
      const updatedDoc = await model
        .findByIdAndUpdate(id, data, { new: true })
        .lean();
      return updatedDoc;
    },

    async delete(id) {
      await model.findByIdAndRemove(id);
    },
  };
};

export default mongooseAdapter;
