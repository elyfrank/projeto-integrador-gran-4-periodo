"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Product = {
    id: number
    name: string
}

type Supplier = {
    id: number
    name: string
}

export default function ProductSupplierPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [selectedProduct, setSelectedProduct] = useState<string>("")
    const [associatedSuppliers, setAssociatedSuppliers] = useState<Supplier[]>([])
    const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([])

    useEffect(() => {
        fetchProducts()
        fetchSuppliers()
    }, [])

    useEffect(() => {
        if (selectedProduct) {
            fetchAssociatedSuppliers(selectedProduct)
        }
    }, [selectedProduct])

    const fetchProducts = async () => {
        const response = await fetch("http://localhost:3001/api/products")
        const data = await response.json()
        setProducts(data)
    }

    const fetchSuppliers = async () => {
        const response = await fetch("http://localhost:3001/api/suppliers")
        const data = await response.json()
        setSuppliers(data)
    }

    const fetchAssociatedSuppliers = async (productId: string) => {
        const response = await fetch(`http://localhost:3001/api/product-supplier/product/${productId}/suppliers`)
        const data = await response.json()
        setAssociatedSuppliers(data)
    }

    const handleAssociateSuppliers = async () => {
        if (!selectedProduct || selectedSuppliers.length === 0) return

        for (const supplierId of selectedSuppliers) {
            await fetch("http://localhost:3001/api/product-supplier", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product: Number(selectedProduct), supplier: Number(supplierId) }),
            })
        }

        fetchAssociatedSuppliers(selectedProduct)
        setSelectedSuppliers([])
    }

    const handleRemoveAssociation = async (supplierId: number) => {
        if (!selectedProduct) return

        await fetch("http://localhost:3001/api/product-supplier", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: Number(selectedProduct), supplierId }),
        })

        fetchAssociatedSuppliers(selectedProduct)
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Associar Fornecedores a Produtos</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <Label htmlFor="product-select">Selecione um Produto</Label>
                    <Select onValueChange={setSelectedProduct} value={selectedProduct}>
                        <SelectTrigger id="product-select">
                            <SelectValue placeholder="Selecione um produto" />
                        </SelectTrigger>
                        <SelectContent>
                            {products.map(product => (
                                <SelectItem key={product.id} value={String(product.id)}>
                                    {product.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {selectedProduct && (
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Fornecedores Associados</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {associatedSuppliers.map(supplier => (
                                        <li key={supplier.id} className="flex justify-between items-center">
                                            <span>{supplier.name}</span>
                                            <Button variant="destructive" size="sm" onClick={() => handleRemoveAssociation(supplier.id)}>
                                                Remover
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <div className="mt-4">
                            <Label htmlFor="supplier-select">Adicionar Fornecedores</Label>
                            <Select onValueChange={value => setSelectedSuppliers([value])}>
                                <SelectTrigger id="supplier-select">
                                    <SelectValue placeholder="Selecione um fornecedor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {suppliers
                                        .filter(s => !associatedSuppliers.some(as => as.id === s.id))
                                        .map(supplier => (
                                            <SelectItem key={supplier.id} value={String(supplier.id)}>
                                                {supplier.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <Button onClick={handleAssociateSuppliers} className="mt-2">Adicionar</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
