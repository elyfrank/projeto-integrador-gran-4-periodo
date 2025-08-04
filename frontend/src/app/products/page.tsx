"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Category = {
    id: number
    name: string
}

type Product = {
    id: number
    name: string
    description: string
    barcode: string
    categoryId: number
    category: Category
    quantityInStock: number
    validityDate: string
    imageUrl: string
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [newProduct, setNewProduct] = useState({
        name: "",
        description: "",
        barcode: "",
        categoryId: 0,
        quantityInStock: 0,
        validityDate: "",
        imageUrl: "",
    })

    useEffect(() => {
        fetchProducts()
        fetchCategories()
    }, [])

    useEffect(() => {
        const results = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredProducts(results)
    }, [searchTerm, products])

    const fetchProducts = async () => {
        const response = await fetch("http://localhost:3001/api/products")
        const data = await response.json()
        setProducts(data)
        setFilteredProducts(data)
    }

    const fetchCategories = async () => {
        const response = await fetch("http://localhost:3001/api/categories")
        const data = await response.json()
        setCategories(data)
    }

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!newProduct.name) newErrors.name = "Nome é obrigatório"
        if (!newProduct.description) newErrors.description = "Descrição é obrigatória"
        if (!newProduct.categoryId) newErrors.categoryId = "Categoria é obrigatória"

        const existingProduct = products.find(p => p.barcode === newProduct.barcode && p.id !== selectedProduct?.id)
        if (existingProduct) {
            newErrors.barcode = "Este código de barras já está cadastrado."
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleCreateOrUpdateProduct = async () => {
        if (!validate()) return

        const method = selectedProduct ? "PUT" : "POST"
        const url = selectedProduct
            ? `http://localhost:3001/api/products/${selectedProduct.id}`
            : "http://localhost:3001/api/products"

        const productData = {
            ...newProduct,
            category: Number(newProduct.categoryId),
            quantityInStock: Number(newProduct.quantityInStock),
        };

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
        })

        if (response.ok) {
            fetchProducts()
            setIsDialogOpen(false)
            setSelectedProduct(null)
            setNewProduct({ name: "", description: "", barcode: "", categoryId: 0, quantityInStock: 0, validityDate: "", imageUrl: "" })
            setErrors({})
        }
    }

    const handleDeleteProduct = async (id: number) => {
        await fetch(`http://localhost:3001/api/products/${id}`, {
            method: "DELETE",
        })
        fetchProducts()
    }

    const openDialog = (product: Product | null = null) => {
        setSelectedProduct(product)
        setNewProduct(
            product
                ? { name: product.name, description: product.description, barcode: product.barcode, categoryId: product.categoryId, quantityInStock: product.quantityInStock, validityDate: product.validityDate, imageUrl: product.imageUrl }
                : { name: "", description: "", barcode: "", categoryId: 0, quantityInStock: 0, validityDate: "", imageUrl: "" }
        )
        setIsDialogOpen(true)
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Produtos</h1>
                <Button onClick={() => openDialog()}>Adicionar Produto</Button>
            </div>
            <div className="mb-4">
                <Input
                    placeholder="Pesquisar produtos..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Código de Barras</TableHead>
                        <TableHead>Quantidade em Estoque</TableHead>
                        <TableHead>Data de Validade</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.map(product => (
                        <TableRow key={product.id}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.description}</TableCell>
                            <TableCell>{product.category?.name}</TableCell>
                            <TableCell>{product.barcode}</TableCell>
                            <TableCell>{product.quantityInStock}</TableCell>
                            <TableCell>{new Date(product.validityDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" onClick={() => openDialog(product)}>
                                    Editar
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="ml-2"
                                >
                                    Excluir
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedProduct ? "Editar Produto" : "Adicionar Produto"}</DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes do produto abaixo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nome *
                            </Label>
                            <Input
                                id="name"
                                value={newProduct.name}
                                onChange={e => {
                                    setNewProduct({ ...newProduct, name: e.target.value })
                                    if (errors.name) setErrors({ ...errors, name: "" })
                                }}
                                className="col-span-3"
                            />
                            {errors.name && <span className="col-span-4 text-red-500 text-sm">{errors.name}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Descrição *
                            </Label>
                            <Textarea
                                id="description"
                                value={newProduct.description}
                                onChange={e => {
                                    setNewProduct({ ...newProduct, description: e.target.value })
                                    if (errors.description) setErrors({ ...errors, description: "" })
                                }}
                                className="col-span-3"
                            />
                            {errors.description && <span className="col-span-4 text-red-500 text-sm">{errors.description}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Categoria *
                            </Label>
                            <Select
                                value={newProduct.categoryId ? String(newProduct.categoryId) : ""}
                                onValueChange={value => {
                                    setNewProduct({ ...newProduct, categoryId: Number(value) })
                                    if (errors.categoryId) setErrors({ ...errors, categoryId: "" })
                                }}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map(category => (
                                        <SelectItem key={category.id} value={String(category.id)}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.categoryId && <span className="col-span-4 text-red-500 text-sm">{errors.categoryId}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="barcode" className="text-right">
                                Código de Barras
                            </Label>
                            <Input
                                id="barcode"
                                value={newProduct.barcode}
                                onChange={e => {
                                    setNewProduct({ ...newProduct, barcode: e.target.value })
                                    if (errors.barcode) setErrors({ ...errors, barcode: "" })
                                }}
                                className="col-span-3"
                            />
                            {errors.barcode && <span className="col-span-4 text-red-500 text-sm">{errors.barcode}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantityInStock" className="text-right">
                                Quantidade em Estoque
                            </Label>
                            <Input
                                id="quantityInStock"
                                type="number"
                                value={newProduct.quantityInStock}
                                onChange={e => setNewProduct({ ...newProduct, quantityInStock: Number(e.target.value) })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="validityDate" className="text-right">
                                Data de Validade
                            </Label>
                            <Input
                                id="validityDate"
                                type="date"
                                value={newProduct.validityDate}
                                onChange={e => setNewProduct({ ...newProduct, validityDate: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="imageUrl" className="text-right">
                                URL da Imagem
                            </Label>
                            <Input
                                id="imageUrl"
                                value={newProduct.imageUrl}
                                onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateOrUpdateProduct}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
