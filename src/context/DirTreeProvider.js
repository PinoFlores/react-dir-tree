import * as React from "react";
import axios from "axios";

const DirTreeContext = React.createContext(null);

/**
 * `DirTreeProvider` Component. Display a whole directory
 * structure.
 *
 * Wrap `Directory` or `LazyDirectory` inside this provider.
 *
 * This component make a request throw `DirTreeProvider fetchBaseDir`
 * to get tree structure. So is important to have the service up and running.
 * Check project repository to get service example.
 *
 * @see { @link https://github.com/PinoFlores/react-dir-tree#readme }
 *
 * @param {Object} props - {baseUrl, baseDirectory}
 * @version 0.1.0
 * @author Jose Aburto <pino0071@email.com>
 */
export const DirTreeProvider = (props) => {
  const [baseDir, setBaseDir] = React.useState({
    name: "Loading Directories, please wait...",
    path: "",
    children: [],
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
        setBaseDir({
          // name: `No Dirs. ${response}`,
          name: "No Directories. Check Server.",
          path: "",
          children: [],
        });
        console.log(error);
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
