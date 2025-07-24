import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.category.createMany({
        data: [
            { name: 'Eletrônicos' },
            { name: 'Alimentos' },
            { name: 'Vestuário' },
            { name: 'Outro' },
        ],
    })
}

main()
    .then(() => {
        console.log('🌱 Seed concluído com sucesso!')
    })
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })