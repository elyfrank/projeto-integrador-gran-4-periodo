import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/products">
                    <Button size="lg">Gerenciar Produtos</Button>
                </Link>
                <Link href="/supplier">
                    <Button size="lg">Gerenciar Fornecedores</Button>
                </Link>
            </div>
        </main>
    );
}