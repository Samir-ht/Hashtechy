const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
const PORT = 3010;

mongoose
  .connect("mongodb://localhost:27017/todo-list", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => console.log("Connected"))
  .catch((err) => console.error("MongoDb Server not connected", err));

const userSchema = new mongoose.Schema({
  todo: String,
  isCompleted: { type: Boolean, default: false },
});
const Task = mongoose.model("Task", userSchema);

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(201).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});-

app.post("/task", async (req, res) => {
  
  const{todo} = req.body;
  if (!todo || todo.trim().length  === 0 ) {
    return res.status(400).json({ error: "Task Cannot be empty" });
  }

  const newTask = new Task({
    todo: req.body.todo.trim(),
  });

  await newTask.save();
  res.status(201).json(newTask);
});
  

  //Delete Method

  app.delete("/task/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
       return res.status(400).json({ error: "Invaild Id" });
      }

      const deleted = await Task.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
      console.error("Error deteting Task:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Put Method

  app.put("/task/:id", async (req, res) => {
    // throw error
    const { id } = req.params;
    const { todo,isCompleted } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Task not Found" });
    }

    const task = await Task.findById(id);
    if (!task) {
      res.status(400).json({ error: "Task Not Found" });
    }

    if (!todo || todo.trim().length === 0) {
      res.status(400).json({ error: "Task Cannot be empty" });
    }
    if (isCompleted !== undefined) {
      Task.isCompleted=isCompleted
    }

    task.todo = todo.trim();
    await task.save();
    res.json(task);
  });

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
