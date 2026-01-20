import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const config = {
    url: 'file:./prisma/dev.db',
};
// @ts-ignore
const adapter = new PrismaLibSql(config);
// @ts-ignore
const prisma = new PrismaClient({ adapter });

async function main() {
    // Clear existing data
    await prisma.post.deleteMany()
    await prisma.project.deleteMany()
    await prisma.friend.deleteMany()
    await prisma.message.deleteMany()
    await prisma.song.deleteMany()

    // Seed Posts
    await prisma.post.createMany({
        data: [
            {
                title: "Building the Future with React 19",
                excerpt: "Exploring the latest concurrent features and the new compiler that's changing how we think about rendering.",
                date: "Jan 18, 2026",
                category: "Development"
            }
        ]
    })

    // Seed Projects
    await prisma.project.createMany({
        data: [
            {
                title: "EcoTracker",
                description: "A mobile application for tracking and reducing personal carbon footprint through gamification.",
                tags: "React Native,Firebase,D3.js",
                github: "#",
                link: "#",
                color: "#00DC82"
            }
        ]
    })

    // Seed Friends
    await prisma.friend.createMany({
        data: [
            { name: "Alice's Garden", url: "#", description: "Design & Illustration", avatar: "A" }
        ]
    })

    // Seed Messages
    await prisma.message.createMany({
        data: [
            { name: "Traveler", content: "Love the fresh design of this blog! Keep it up.", date: "2 Hours ago" }
        ]
    })

    // Seed Songs
    await prisma.song.createMany({
        data: [
            {
                id: 1,
                title: "Eco Valley",
                artist: "Lofi Dreamer",
                url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                lyrics: JSON.stringify([
                    { time: 0, text: "Welcome to the green valley..." },
                    { time: 5, text: "The wind whispers through the leaves." },
                ])
            }
        ]
    })

    console.log('Seed completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
