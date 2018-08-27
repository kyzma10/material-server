import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: String,
    author: String
});

export default mongoose.model('Book', BookSchema);
