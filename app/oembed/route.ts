import {NextRequest, NextResponse} from "next/server";
import {Albums} from "@/app/photos/route";

export async function GET(request: NextRequest) {

    const id = request.nextUrl.searchParams.get('album');
    let res = {
        author_name: `٩(˘◡˘)۶`,
        author_url: "",
        provider_url: "",
        provider_name: `Dan's Photo Gallery`
    }
    if (id) {
        const to =`${process.env.NEXT_PUBLIC_HOST!}/${id}`
        res.author_url = to
        res.provider_url = to
        const photos = await Albums()
        const realId = Object.keys(photos).find((album) => album.toLowerCase() === id)
        const photoCount = photos[id]?.photos?.length

    }
    return new NextResponse(JSON.stringify(res));
}
