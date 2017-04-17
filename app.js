var express=require("express");
var bodyparser=require("body-parser");
var app=express();
var mongoose=require("mongoose");
var methodOverride=require("method-override");

app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/BlogDatabase");

var blogSchema= new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	date: {
		type:Date,
		default:Date.now
	}
})

var Blog=mongoose.model("blog",blogSchema);

app.set("view engine","ejs");
app.set("port",3000);

app.use(express.static("public"));
/*Blog.create({
			title:"Aneri",
			image:"https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAqPAAAAJGJlYmFjMWM0LWYzYTUtNGNhZS1hM2FkLTg3YmYyYzY5YWM3MA.jpg",
			body:"ontrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32."
		})
*/
app.get("/",function(req,res){
	res.redirect("/blogs");
})

app.get("/blogs",function(req,res){

	Blog.find({},function(err,blogs){
		if(err){
			console.log(err);
		}
		else{
			res.render("index",{blogs:blogs});
		}
	})
})

app.get("/blogs/new",function(req,res){
	res.render("new");
})

app.post("/blogs",function(req,res){
	Blog.create(req.body.blog,function(err,newBlog){
		if(err){
				console.log("error occured..."+err);
		}
		else{
			res.redirect("/blogs");
		}
	});
});

app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,oneBlog){
		if(err){
			console.log("error occured..."+err);
		}
		else{
			res.render("show",{blog:oneBlog});
		}
	})
})

app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,blogEdit){
		if(err){
			console.log(err);
		}else{
			res.render("edit",{blog:blogEdit});
		}
	})
			
})

app.put("/blogs/:id",function(req,res){
	Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err,editedBlog){
		if(err){
			console.log("error occured..."+err);
		}
		else
		{
			res.redirect("/blogs/" +req.params.id);
		}
	} )
})

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err,deleteBlog){
		if(err){
			console.log("error occured..."+err);
		}
		else
		{
			res.redirect("/blogs");
		}
	})
})
app.listen(app.get("port"),function(req,res){
	console.log("server is listening...");
})