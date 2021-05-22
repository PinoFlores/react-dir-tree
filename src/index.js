import React from "react";
import ReactDOM from "react-dom";
import LazyDirectory from "./LazyDirectory";
import {DirTreeProvider} from "./context/DirTreeProvider";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <DirTreeProvider
    baseUrl="http://localhost:2000/dirtree"
    baseDirectory="<put your base directory you need here>"
  >
    <LazyDirectory
      onDirSelect={(selected) => console.log(selected)}
      directoryContainer={(component) => <>{component}</>}
    />
  </DirTreeProvider>,
  document.getElementById("root")
);
reportWebVitals();
