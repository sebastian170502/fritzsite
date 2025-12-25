import { NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(req: Request) {
    try {
        const { path, tag, secret } = await req.json()

        // Validate secret to prevent unauthorized revalidation
        if (secret !== process.env.REVALIDATION_SECRET) {
            return NextResponse.json(
                { error: 'Invalid secret' },
                { status: 401 }
            )
        }

        if (path) {
            revalidatePath(path)
            return NextResponse.json({
                revalidated: true,
                type: 'path',
                value: path,
                now: Date.now(),
            })
        }

        if (tag) {
            revalidateTag(tag)
            return NextResponse.json({
                revalidated: true,
                type: 'tag',
                value: tag,
                now: Date.now(),
            })
        }

        return NextResponse.json(
            { error: 'Missing path or tag' },
            { status: 400 }
        )
    } catch (error) {
        console.error('Revalidation error:', error)
        return NextResponse.json(
            { error: 'Failed to revalidate' },
            { status: 500 }
        )
    }
}
