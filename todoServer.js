const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors')
const fs = require('fs')

app.use(bodyParser.json());
app.use(cors());

// app.get("/", (req,res) => {
//   res.sendFile(path.join(__dirname,"index.html"));
// });

// API to retrieve all todos
app.get("/todos", (req, res) => {
  fs.readFile("list_data.json","utf8", (err, data) => {
    res.json(JSON.parse(data));
  });
});

// API to add a to-do task to the file
app.post("/todos", (req,res) => {
  let list = []
  fs.readFile("list_data.json","utf8", (err, data) => {
    if (err) return res.send("Error reading File");
    list = JSON.parse(data);

    var new_data = {
      id: Math.floor(Math.random() * 10000),
      title: req.body.title,
      description: req.body.description
    };
    list.push(new_data);
    fs.writeFile("list_data.json",JSON.stringify(list), (err) => {
      if (err) return res.send("Error writing data to the file.")
      res.send("To-do note is added successfully.");
    });
  });
});

// API endpoint to retrieve a specific to-do task
app.get("/todos/:id", (req,res) => {
  id_num = req.params.id;

  fs.readFile("list_data.json","utf8",(err,data) => {
    if (err) return res.send("Error retrieving data from the list_data");
    let list = JSON.parse(data);
    for (var i=0; i<list.length; i++){
      if (id_num == list[i].id){
        return res.json(list[i]);
      }
    }
    return res.status(404).send("No ID found");
  });
});

// TO EDIT: API endpoint to edit a to-do task
app.put("/todos/:id", (req,res) => {
  id_num = req.params.id;
  for (var i=0; i<list.length; i++){
    if (id_num == list[i].id){
      list[i].completed = true;
      return res.json(list[i]);
    }
  }
  return res.status(404).send("No ID found");
});

// API end point to delete a specific to-do task
app.delete("/todos/:id", (req,res) => {
  id_num = req.params.id;

  fs.readFile("list_data.json","utf8", (err, data) => {
    if (err) return res.send("Error reading File");
      let temp_data = JSON.parse(data);

      for (var i=0; i<temp_data.length; i++){
        if (id_num == temp_data[i].id){
          temp_data.splice(i, 1);

          fs.writeFile("list_data.json",JSON.stringify(temp_data), (err) => {
            if (err) return res.send("Error updating file after deletion.");
            return res.json({
              message: `Todo task with id:${id_num} has been deleted.`,
              updatedList: temp_data  
            });
          })
        }
      }
  });
});

var port=3000;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
})
module.exports = app;
