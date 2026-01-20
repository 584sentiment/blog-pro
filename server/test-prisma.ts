import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

async function main() {
    try {
        const config = {
            url: 'file:./prisma/dev.db',
        };
        // @ts-ignore
        const adapter = new PrismaLibSql(config);
        // @ts-ignore
        const prisma = new PrismaClient({ adapter });

        console.log('Successfully initialized with LibSQL config for local file');
        const posts = await prisma.post.findMany();
        console.log('Posts count:', posts.length);
        await prisma.$disconnect();
    } catch (e) {
        console.error('Failed with LibSQL config:', e);
    }
}

main();
