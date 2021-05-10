const express=require('express')
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static("public"));

const default_img="https://neilpatel.com/wp-content/uploads/2018/10/blog.jpg"

mongoose.connect("mongodb+srv://dbkaran:Karan@123@cluster0.p32px.mongodb.net/blogDB" ,{useNewUrlParser:true, useUnifiedTopology: true});

const blogSchema=new mongoose.Schema({
    title:String,
    image:String,
    content:String
})
const Blog=mongoose.model('Blog',blogSchema);


// const blogs=[
    
// ];
let temp_blog={};

app.get('/',function(req,res){
    Blog.find(function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{blogs:blogs});
        }
    })
})

app.get('/about',function(req,res){
    res.render('about',{})
})

app.get('/contact',function(req,res){
    res.render('contact',{})
})

app.get('/add_posts',function(req,res){
    res.render('add_posts',{})
})

app.get(`/:slug`,function(req,res){
    res.render('blog',{blog:temp_blog});
})

app.post('/',function(req,res){
    if(req.body.button==='post_page'){
        res.redirect('/add_posts');
    }
    else if(req.body.button==='post'){
        const title=req.body.title;
        const content=req.body.content;
        let image=req.body.image;
        if(image.length==0){
            image=default_img
        }
    
        const blog=new Blog({
            title:title,
            image:image,
            content:content
        })
        blog.save();

        res.redirect('/');
    }
    else{
        
        const id=req.body.button;
        console.log(id);
        Blog.findById(id, function(err,blog){
            temp_blog=blog;
            // console.log(temp_blog);
            res.redirect(`/${temp_blog.title}`);
        });
    }
    
})


const port = process.env.PORT;
if(port ==null || port==""){
    port=3000;
}
app.listen(port,function(){
    console.log('server running at 3000');
})

