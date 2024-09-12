import {Albums, albumsString} from "@/app/photos/album";

export const dynamic = "force-dynamic";

import {NextResponse} from "next/server";

export async function GET() {
    await Albums();
    return new NextResponse(albumsString);
}
