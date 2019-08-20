const express = require("express");

const server = express();
server.use(express.json());
const projects = [];
let requisicoes = 0;

function hasProject(req, res, next) {
  const { id } = req.params || "";
  return projects.find(project => project.id === id)
    ? next()
    : res.status(400).json({ error: "O projeto não existe" });
}

function contaReqs(req, res, next) {
  requisicoes++;
  console.log("Requisicoes:", requisicoes);
  return next();
}

server.post("/projects", contaReqs, (req, res) => {
  const { id, title, tasks } = req.body;
  projects.push({
    id,
    title,
    tasks
  });

  return res.json(projects);
});

server.post("/projects/:id/tasks", hasProject, contaReqs, (req, res) => {
  const { title } = req.body;
  const { id } = req.params;

  projects.forEach(project => {
    if (project.id === id) {
      project.tasks.push(title);
    }
  });

  return res.json(projects);
});

server.put("/projects/:id", hasProject, contaReqs, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  projects.forEach(project => {
    if (project.id === id) {
      project.title = title;
      return;
    }
  });
  return res.json(projects);
});

server.delete("/projects/:id", hasProject, contaReqs, (req, res) => {
  const { id } = req.params;
  projects.forEach((project, indice) => {
    if (project.id === id) {
      projects.splice(indice, 1);
    }
  });

  return res.json(projects);
});

server.listen(3000);
