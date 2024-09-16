import {NextRequest, NextResponse} from "next/server";

export async function GET(request: NextRequest) {

    const id = request.nextUrl.searchParams.get('album');
    let res = {
        author_name: `٩(˘◡˘)۶`,
        author_url: "",
        provider_url: "",
        provider_name: `Dan's Photo Gallery`
    }
    let to =`${process.env.NEXT_PUBLIC_HOST!}`
    if (id) {
        to = `${process.env.NEXT_PUBLIC_HOST!}/${id}`
    }
    res.author_url = to
    res.provider_url = to
    return new NextResponse(JSON.stringify(res));
}
