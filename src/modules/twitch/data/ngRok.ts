import ngrok from 'ngrok';

export default async (port: number | string) => {
    console.log("Initializing Ngrok tunnel...");
    const url = await ngrok.connect({
        proto: "http",
        authtoken: "2l6ho3bVRgjo4cd3jsSiGpey1S2_3bJU5RFH2mijArJTKESvk",
        hostname: "included-smiling-titmouse.ngrok-free.app",
        addr: port,
    });
    console.log(`Listening on url ${url}`);
    console.log("Ngrok tunnel initialized!");
};
