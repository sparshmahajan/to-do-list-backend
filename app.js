const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const _ = require("lodash");
const port = process.env.port || 5000;
const app = express();

app.use(express.static("public"));
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Learn React"
});

const item2 = new Item({
  name: "Learn DSA"
});

const item3 = new Item({
  name: "Learn OS"
});

const defaultItems = [item1, item2, item3];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.json(foundItems);
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.item;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  console.log(req);
  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }
  });
});

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
