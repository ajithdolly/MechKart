import mongoose from "mongoose";
const  {Schema} = mongoose;

const categorySchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    
    img : {
        type : String,
        
    },
    cat : {
        type : String,
        required: true,
    },
    
});

export default mongoose.model("categorycards",categorySchema);