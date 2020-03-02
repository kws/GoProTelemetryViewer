import gpmfExtract from 'gpmf-extract';
import goproTelemetry from 'gopro-telemetry';

export default async function extract(file) {
    const videoData = await gpmfExtract(file, true, e => {
        console.log("extract update", e);
    });
    console.log("Received videoData", videoData);
    const telemetry = await goproTelemetry(videoData, {'promisify': true});
    console.log("Received telemetry", telemetry);
}


