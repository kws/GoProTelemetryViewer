import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import gpmfExtract from 'gpmf-extract';
// import goproTelemetry from 'gopro-telemetry';

import TelemetryData from 'GoProTelemetryExtract/src/helpers/telemetryData';
import Player from "./components/player";

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
    background: 'linear-gradient(45deg, #282c34 30%, #000 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    padding: '0 30px',
  },
  player: {
    width: '960px',
    height: '720px',
    display: 'box',

    '& video': {
      border: '1px solid red',
      position: 'absolute',
      width: '960px',
      height: '720px',
      zIndex: '10',
    },

    '& canvas': {
      border: '1px solid blue',
      position: 'absolute',
      width: '960px',
      height: '720px',
      zIndex: '20',
    },

  },
});



function App() {
  const classes = useStyles();

  const [video, setVideo] = useState();
  const [telemetry, setTelemetry] = useState();


  const onFile = e => {
    const files = e.target.files;
    for (let ix in files) {
      const file = files[ix];
      if (file.type && file.type.startsWith("video/")) {
        if (video) {
          URL.revokeObjectURL(video);
        }
        const url = URL.createObjectURL(file);
        setVideo(url);
      } else if (file.type && file.type.endsWith("/json")) {
        const reader = new FileReader();
        reader.onload = () => {
          const telemetryData = JSON.parse(reader.result);
          const telemetry = new TelemetryData(telemetryData);
          setTelemetry(telemetry);
        };
        reader.readAsText(file);
      }
    }
  };

  // useEffect(() => {
  //   const calculateTelemetry = async file => {
  //     const videoData = await gpmfExtract(file, true, e => {
  //       console.log("extract update", e);
  //     });
  //     console.log("Received videoData", videoData);
  //     const telemetry = await goproTelemetry(videoData, {'promisify': true});
  //     console.log("Received telemetry", telemetry);
  //     setTelemetry(telemetry);
  //   };
  //   calculateTelemetry(file).catch(err => {
  //     console.log("Error while calculating telemetry", err);
  //   });
  // }, [file]);


  return (
    <div className={classes.root}>
        <header>
          <input type="file" onChange={onFile} multiple={true}></input>
          { video && telemetry &&
              <div className={classes.player}>
                <Player video={video} telemetry={telemetry}/>
              </div>
          }
        </header>
    </div>
  );
}

export default App;
