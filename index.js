const express=require("express");
const https=require("https");
const mongoose = require("mongoose");
const bodyParser=require("body-parser");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.set('view engine','ejs');

app.get("/icons",function(req,res){
  res.sendFile(__dirname+"/icons.html");
})

app.get("/",function(req,res){
  res.sendFile(__dirname+"/home.html")
})
app.get("/checkout",function(req,res){
  res.sendFile(__dirname+"/checkout.html")
})
app.get("/contact",function(req,res){
  res.sendFile(__dirname+"/contact.html")
})
app.get("/calculator",function(req,res){
  res.sendFile(__dirname+"/calculator.html")
})
app.get("/heart",function(req,res){
  res.sendFile(__dirname+"/heart.html")
})

app.get("/clock",function(req,res){

res.sendFile(__dirname+"/clock.html");
})

app.get("/weather",function(req,res){
  res.sendFile(__dirname+"/weather.html");
})

app.get("/timer",function(req,res){
  res.sendFile(__dirname+"/timer.html");
})
// app.get("/todo",function(req,res){
//   res.sendFile(__dirname+"/views/todo.ejs");
// })


// Weather code
app.post("/weather",function(req,res){
  const query=req.body.cName;
  const url=("https://api.openweathermap.org/data/2.5/weather?q="+query+"&appid=14e26f23c609c7d9da0bd4e9eab51a38&units=metric");
  https.get(url,function(response){
    console.log(response.statusCode);

    response.on("data",function(data){
      const weatherData=JSON.parse(data);
      const temp=weatherData.main.temp;
    const desp=weatherData.weather[0].description;
    const  icon=weatherData.weather[0].icon;
  const imgURL=(" http://openweathermap.org/img/wn/"+icon+"@2x.png")
  
  res.render("weatherOutput",{ query:query ,temp:temp,desp:desp,imgURL:imgURL});
})
})
})


// mongoose.connect("mongodb+srv://new_admin:Viplov123@cluster0.07hzy.mongodb.net/todolistDB?retryWrites=true&w=majority", {useNewUrlParser: true});
// mongoose.connect("mongodb+srv://new_admin:Viplov123@cluster0.07hzy.mongodb.net/projectDB?retryWrites=true&w=majority", {useNewUrlParser: true});
//Music code
// app.get("/music",function(req,res){
//
//
//
//
//   res.render("music",{});
//
//
// })



// Todo list
mongoose.connect("mongodb+srv://amanshrma16:aman16@cluster0.nqqgihe.mongodb.net/?retryWrites=true&w=majority", {useNewUrlParser: true});


const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);


const item1 = new Item({
  name: "Meeting @10A.M."
});


const defaultItems = [item1];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);


app.get("/todo", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/todo");
    } else {
      res.render("todo", {listTitle: "Today", newListItems: foundItems});
    }
  });

});

app.post("/todo", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today"){
    item.save();
    res.redirect("/todo");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (!err) {
        console.log("Successfully deleted checked item.");
        res.redirect("/todo");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (!err){
        res.redirect("/" + listName);
      }
    });
  }


});
// var items=["Meeting @10 A.M."];
//
// app.get("/todo",function(req,res){
//   var today=new Date();
// var options={
//   weekday:"long",
//   day:"numeric",
//   month:"long"
// };
// var day=today.toLocaleDateString("en-US",options);
//
//   res.render("todo",{listTitle:day,newListItem:items});
//
// });
//
// app.post("/todo",function(req,res){
//   var item=req.body.newField;
//
//   if(req.body.list==="Work"){
//     workItems.push(item);
//     res.redirect("/work");
//   }
//   else{
//   items.push(item);
//
//   res.redirect("/todo");
// }
// });





let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
  console.log("Successfully started server at port 3000")
});
