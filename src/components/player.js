import React, { useState, useEffect } from 'react';
import Renderer from 'GoProTelemetryExtract/src/helpers/renderer';

export default function Player({video, telemetry}) {
    const videoRef = React.createRef();
    return (
        <>
            <video ref={videoRef} src={video} autoPlay={true}/>
            <OverylayCanvas videoRef={videoRef} telemetry={telemetry}/>
        </>
    )

}

function OverylayCanvas({telemetry, videoRef}) {
    const [renderer, setRenderer] = useState(undefined);
    const canvasRef = React.createRef();

    useEffect(() => {
        console.log("Creating new renderer", telemetry.getGPS);
        const newRenderer = new Renderer(telemetry, 25);
        setRenderer(newRenderer);
    }, [telemetry]);

    useEffect(() => {
        console.log("Creating new timer");
        const timer  = setInterval(() => {
            const time = videoRef.current.currentTime;
            console.log("Rendering", time);
            renderer.render(canvasRef.current, time*25);
        }, 250);
        return () => {
            console.log("Destroying timer");
            clearTimeout(timer);
        }
    });

    return (
        <canvas ref={canvasRef} width={1920} height={1440}></canvas>
    );

}