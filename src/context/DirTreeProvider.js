import * as React from "react";
import axios from "axios";

const DirTreeContext = React.createContext(null);

export const DirTreeProvider = (props) => {
  const [baseDir, setBaseDir] = React.useState({
    name: "",
    path: "",
    subDirectories: [],
  });

  const fetchBaseDir = () => {
    axios
      .get(`${props.baseUrl}`, {
        params: {
          dir: props.baseDirectory,
        },
      })
      .then(({data}) => {
        setBaseDir(data.path);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const value = React.useMemo(() => {
    return {
      baseDir,
      fetchBaseDir,
    };
  }, [baseDir]);

  return <DirTreeContext.Provider value={value} {...props} />;
};

export const useDirTree = () => {
  const context = React.useContext(DirTreeContext);
  if (!context) throw new Error("useDirTree must be inside DirTreeContext");
  const {baseDir, fetchBaseDir} = context;
  return {baseDir, fetchBaseDir};
};
