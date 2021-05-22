import React from "react";
import {
  Collapse,
  fade,
  makeStyles,
  SvgIcon,
  withStyles,
} from "@material-ui/core";
import {useSpring, animated} from "react-spring/web.cjs"; // web.cjs is required for IE 11 support
import {TreeItem, TreeView} from "@material-ui/lab";
import {useDirTree} from "./context/DirTreeProvider";
import * as _ from "lodash";

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{width: 14, height: 14}} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{width: 14, height: 14}} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon
      className="close"
      fontSize="inherit"
      style={{width: 14, height: 14}}
      {...props}
    >
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M17.485 17.512q-.281.281-.682.281t-.696-.268l-4.12-4.147-4.12 4.147q-.294.268-.696.268t-.682-.281-.281-.682.294-.669l4.12-4.147-4.12-4.147q-.294-.268-.294-.669t.281-.682.682-.281.696 .268l4.12 4.147 4.12-4.147q.294-.268.696-.268t.682.281 .281.669-.294.682l-4.12 4.147 4.12 4.147q.294.268 .294.669t-.281.682zM22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0z" />
    </SvgIcon>
  );
}

function TransitionComponent(props) {
  const style = useSpring({
    from: {opacity: 0, transform: "translate3d(20px,0,0)"},
    to: {
      opacity: props.in ? 1 : 0,
      transform: `translate3d(${props.in ? 0 : 20}px,0,0)`,
    },
  });

  return (
    <animated.div style={style}>
      <Collapse {...props} />
    </animated.div>
  );
}

const StyledTreeItem = withStyles((theme) => ({
  iconContainer: {
    "& .close": {
      opacity: 0.3,
    },
  },
  group: {
    marginLeft: 7,
    paddingLeft: 18,
    borderLeft: `1px dashed ${fade(theme.palette.text.primary, 0.4)}`,
  },
}))((props) => {
  return <TreeItem {...props} TransitionComponent={TransitionComponent} />;
});

const useStyles = makeStyles({
  root: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
});

/**
 * `Directory` Component. Display a whole directory
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
function Directory({onDirSelect, directoryContainer}) {
  const classes = useStyles();
  const {baseDir, fetchBaseDir} = useDirTree();
  const [expanded, setExpanded] = React.useState([]);

  React.useEffect(() => fetchBaseDir(), []);

  const handleToggle = ({path}) => {
    let aux = Object.assign([], expanded);
    if (aux.includes(path)) {
      aux = aux.filter((id) => id !== path);
    } else {
      aux.push(path);
    }
    setExpanded(aux);
  };

  const handleSelect = ({path}) => {
    onDirSelect(path);
  };

  const renderChildren = (item) => {
    if (_.has(item, "children") && item.children.length) {
      return renderDirItemWithChildren(item);
    }
    return (
      <StyledTreeItem
        key={item.path}
        {...handleEvents(item)}
        nodeId={item.path}
        label={item.name}
      />
    );
  };

  const renderDirItemWithChildren = (item) => {
    return (
      <StyledTreeItem
        {...handleEvents(item)}
        key={item.path}
        nodeId={item.path}
        label={item.name}
      >
        {item.children.map((child) => {
          return renderChildren(child);
        })}
      </StyledTreeItem>
    );
  };

  const handleEvents = (item) => {
    return {
      onLabelClick: () => handleSelect(item),
      onIconClick: () => handleToggle(item),
    };
  };

  const directoryComponent = (
    <>
      {baseDir ? (
        <TreeView
          className={classes.root}
          defaultExpanded={[baseDir.path]}
          defaultCollapseIcon={<MinusSquare />}
          defaultExpandIcon={<PlusSquare />}
          defaultEndIcon={<CloseSquare />}
          expanded={expanded}
        >
          <StyledTreeItem
            {...handleEvents(baseDir)}
            nodeId={baseDir.path}
            label={baseDir.name}
          >
            {baseDir && baseDir.children
              ? baseDir.children.map((item) => {
                  return renderChildren(item);
                })
              : null}
          </StyledTreeItem>
        </TreeView>
      ) : null}
    </>
  );

  return directoryContainer(directoryComponent);
}

export default Directory;
