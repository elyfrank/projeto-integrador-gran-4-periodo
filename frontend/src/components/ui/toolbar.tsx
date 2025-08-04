import Link from "next/link"

export default function Toolbar() {
    return (
        <header className="bg-gray-800 text-white p-4">
            <nav className="container mx-auto flex justify-between">
                <Link href="/" className="text-lg font-bold">
                    Dashboard
                </Link>
                <div className="space-x-4">
                    <Link href="/products" className="hover:underline">
                        Produtos
                    </Link>
                    <Link href="/product-supplier" className="hover:underline">
                        Associar Fornecedores
                    </Link>
                    <Link href="/supplier" className="hover:underline">
                        Fornecedores
                    </Link>
                </div>
            </nav>
        </header>
    )
}
