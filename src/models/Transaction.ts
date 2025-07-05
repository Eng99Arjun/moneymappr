import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
    {
        amount: {type: Number, required: true },
        description: { type: String },
        date: { type: Date, required: true},
        category: { type: String, required: true,  enum:['Food', 'Transport', "Bills", 'Shopping', 'Other']
        },
    },
    {
            timestamps: true
    }
);

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema)

