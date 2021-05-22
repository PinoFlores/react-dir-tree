import {Typography} from "@material-ui/core";
import * as React from "react";

const Directory = React.lazy(() => import("./Directory"));

/**
 * `Directory` Component Lazy Loading. Display a whole directory
 * structure.
 *
 * This component make a request throw `DirTreeProvider fetchBaseDir`
 * to get tree structure. So is important to have the service up and running.
 * Check project repository to get service example.
 *
 * @see { @link https://github.com/PinoFlores/react-dir-tree#readme }
 *
 * @param {Object} object
 * @version 0.1.0
 * @author Jose Aburto <pino0071@email.com>
 */
const LazyDirectory = ({
  onDirSelect,
  directoryContainer,
  fallback = <Typography>Loding Directory Component...</Typography>,
}) => {
  return (
    <React.Suspense fallback={fallback}>
      <Directory
        onDirSelect={onDirSelect}
        directoryContainer={directoryContainer}
      />
    </React.Suspense>
  );
};
export default LazyDirectory;
