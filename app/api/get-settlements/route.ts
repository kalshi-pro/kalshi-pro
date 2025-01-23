import { NextResponse } from "next/server";



export const GetSettlementsRouteConstants = {
    method: "GET",
    baseUrl: "https://api.elections.kalshi.com",
    path: "/trade-api/v2/portfolio/settlements",
}


export async function POST(request: Request) {
    const { accessKey, signature, timestampStr } = await request.json()

    try {
        if (!signature) {
            throw new Error("Failed to sign the message");
        }
        const headers = new Headers();
        headers.set("KALSHI-ACCESS-KEY", accessKey);
        headers.set("KALSHI-ACCESS-SIGNATURE", signature);
        headers.set("KALSHI-ACCESS-TIMESTAMP", timestampStr);
        headers.set("Content-Type", "application/json");

        const response = await fetch(GetSettlementsRouteConstants.baseUrl + GetSettlementsRouteConstants.path, {
            method: GetSettlementsRouteConstants.method,
            headers,
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const contents = await response.json();
        return NextResponse.json(contents)
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

