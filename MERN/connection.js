let mongoose=require('mongoose')
// mongoose.connect('mongodb://127.0.0.1:27017/notes');
mongoose.connect('mongodb://localhost:27017/notes', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  


let userSchema=new mongoose.Schema({
    title:String,
    content:String
})
module.exports=new mongoose.model('users',userSchema)


