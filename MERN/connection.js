let mongoose=require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/notes');


let userSchema=new mongoose.Schema({
    title:String,
    content:String
})
module.exports=new mongoose.model('user',userSchema)


