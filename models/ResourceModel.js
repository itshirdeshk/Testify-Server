import mongoose, {Schema} from "mongoose";

const ResourceSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: String, required: true },
    description: { type: String, required: true },
    exam: { type: Schema.Types.ObjectId, ref: "Exam" },
    subExam: { type: Schema.Types.ObjectId, ref: "SubExam" },
});

const ResourceModel = mongoose.model("Resource", ResourceSchema);

export default ResourceModel; 