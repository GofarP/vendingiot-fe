import * as SignalR from "@microsoft/signalr";
import axiosInstance from "./axios";

export const startSignalR = async (token: string) => {
    const connection = new SignalR.HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/hub/notification`, {
            accessTokenFactory: () => token,
            skipNegotiation: true,
            transport: SignalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect()
        .build();

    connection.on("OnPermissionChanged", async () => {
        console.warn("Permission changed, refreshing token....");

        try {
            const oldToken = sessionStorage.getItem("token");
            const refreshToken = sessionStorage.getItem("refreshToken");

            if (!oldToken || !refreshToken) {
                console.error("Refresh failed: Tokens not found in storage");
                return;
            }

            const res = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
                accessToken: oldToken,
                refreshToken: refreshToken
            });

            if (res.data.token) {
                sessionStorage.setItem("token", res.data.token);
                sessionStorage.setItem("refreshToken", res.data.refreshToken);

                console.log("Token successfully refreshed via SignalR trigger.");

            }

        } catch (err) {
            console.error("SignalR Refresh Error", err);

        }
    });

    if (connection.state === SignalR.HubConnectionState.Disconnected) {
        try {
            await connection.start();
            console.log("SignalR Connected (WebSocket Direct)");
        } catch (err) {
            if (err instanceof Error && !err.message.includes("stop() was called")) {
                console.error("SignalR Connection Error: ", err);
            }
        }
    }

    return connection;
}