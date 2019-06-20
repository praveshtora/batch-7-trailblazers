import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 1 },
});
const Counter = mongoose.model('Counter', CounterSchema);

mongoose.set('useFindAndModify', false);

async function increaseSeq(schema, key, seqStartFrom) {
  const document = this;
  try {
    const updtaedDocument = await Counter.findByIdAndUpdate({ _id: schema }, { $inc: { seq: 1 } });
    if (!updtaedDocument) {
      const counter = seqStartFrom? new Counter({ _id: schema, seq: seqStartFrom }) : new Counter({ _id: schema});
      counter.save();
      document[key] = seqStartFrom ? seqStartFrom : 1;
    } else {
      document[key] = updtaedDocument.seq + 1;
    }
  } catch (exception) {
    throw new Error(`Error occured while auto incrementing ${key}, ${exception}`);
  }
}

export default increaseSeq;
