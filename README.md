# React Directory Tree `react-dir-tree`

This package provide a `Directory Tree Component` that show a given tree structure. By the moment depends
on [Material UI](https://material-ui.com/), in future will change.

[![Build](https://github.com/pmndrs/react-spring/actions/workflows/main.yml/badge.svg?style=flat&colorA=000000&colorB=000000)](https://github.com/pmndrs/react-spring/actions/workflows/main.yml) [![npm version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=js&type=6&v=1.0.0&x2=0)](https://badge.fury.io/js/react-spring)

### How to use this module

Wrap this component inside `DirTreeProvider`

```js
<DirTreeProvider
  baseUrl="http://localhost:2000/dirtree"
  baseDirectory="C://Users//user//Documents//labs"
>
  <LazyDirectory
    onDirSelect={(selected) => console.log(selected)}
    directoryContainer={(component) => <>{component}</>}
  />
</DirTreeProvider>
```

## Service

**Import:** this version depends on api service to get that structure, so make sure that you are providing and that service is up and running. This is a simple example of a `nodej` service that uses `express` to expose that service.

### Service creating example

```bash
yarn add express cors morgan directory-tree
yarn add --dev nodemon
```

```js
./src/index.js

const express = require("express");
const app = express();

const path = require("path");
const _ = require("lodash");
const cors = require("cors");
const morgan = require("morgan");
const driTree = require("directory-tree");

app.use(cors());
app.use(morgan("dev"));



const configs = {
  exclude: [/node_modules/, /.git/],
};

const getSubDirsFromPath = (startPath) => {
  return getJustDirs(driTree(startPath, configs));
};

const getJustDirs = (prop) => {
  let aux = prop;
  delete aux.size;
  const pChildren = [];
  if (_.has(aux, "children")) {
    for (let i = 0; i < aux.children.length; i++) {
      let child = aux.children[i];
      if (child.type === "directory") {
        if (_.has(child, "children")) {
          child = getJustDirs(child);
        }
        pChildren.push(child);
      }
    }
  }
  return {...aux, children: pChildren};
};


app.get("/dirtree", (req, res) => {
  let dir = req.query.dir;
  if (!dir) {
    return res.status(404).send({
      message: "dir path is required!",
    });
  }
  const dirAux = path.resolve(dir);
  const tree = getSubDirsFromPath(dirAux);
  return res.send({path: tree});
});

app.listen(2000, () => {
  console.log("Directory Tree Service Running at :::2000");
});


```
