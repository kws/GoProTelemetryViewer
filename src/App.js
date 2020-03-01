import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import gpmfExtract from 'gpmf-extract';
// import goproTelemetry from 'gopro-telemetry';

import Renderer from 'GoProTelemetryExtract/src/helpers/renderer';
import TelemetryData from 'GoProTelemetryExtract/src/helpers/telemetryData';

const bunnyVideo = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
const skiVideo = 'https://www.dropbox.com/s/2dmjyea4f7pzk6t/GOPR4011.MP4?dl=1';


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

  const [file, setFile] = useState();
  const [video, setVideo] = useState();
  const [telemetry, setTelemetry] = useState();
  const [renderer, setRenderer] = useState();

  const videoRef = React.createRef();
  const canvasRef = React.createRef();

  const onFile = e => {
    const files = e.target.files;
    for (let ix in files) {
      const file = files[ix];
      if (file.type && file.type.startsWith("video/")) {
        setFile(file);
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

  useEffect(() => {
    if (video) {
      URL.revokeObjectURL(video);
    }

    if (file) {
      const url = URL.createObjectURL(file);
      setVideo(url);
    }
  }, [file]);


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

  useEffect(() => {
    if (telemetry && !renderer) {
      const newRenderer = new Renderer(canvasRef.current, telemetry, 25);
      newRenderer.on("frame", (e, maxFrame) => {
        console.log("RENDERER", e, maxFrame);
      });
      // newRenderer.ctx.scale(canvasRef.current.width/1920, canvasRef.current.height/1440);
      setRenderer(newRenderer);
    }
  }, [canvasRef, telemetry, renderer]);

  useEffect(() => {
    if (!renderer | !videoRef) {
      return;
    }
    const timer  = setInterval(() => {
      const time = videoRef.current.currentTime;
      renderer.render(Math.ceil(time*25));
    }, 1000/25);

    return () => {
      clearTimeout(timer);
    };

  }, [renderer, videoRef]);

  return (
    <div className={classes.root}>
        <header>
          <input type="file" onChange={onFile} multiple={true}></input>
          { video && telemetry &&
              <div className={classes.player}>
                <video ref={videoRef} src={video} autoPlay={true}></video>
                <canvas ref={canvasRef}></canvas>
              </div>
          }
        </header>
    </div>
  );
}

export default App;
