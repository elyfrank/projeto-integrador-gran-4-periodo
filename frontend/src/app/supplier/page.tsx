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
import { toast } from "sonner";
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

type Supplier = {
    id: number
    name: string
    cnpj: string
    address: string
    phone: string
    email: string
    mainContact: string
}

export default function SuppliersPage() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([])
    const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
    const [newSupplier, setNewSupplier] = useState({
        name: "",
        cnpj: "",
        address: "",
        phone: "",
        email: "",
        mainContact: "",
    })

    useEffect(() => {
        fetchSuppliers()
    }, [])

    useEffect(() => {
        const results = suppliers.filter(supplier =>
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredSuppliers(results)
    }, [searchTerm, suppliers])

    const fetchSuppliers = async () => {
        const response = await fetch("http://localhost:3001/api/suppliers")
        const data = await response.json()
        setSuppliers(data)
        setFilteredSuppliers(data)
    }

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!newSupplier.name) newErrors.name = "Nome é obrigatório"
        if (!newSupplier.cnpj) newErrors.cnpj = "CNPJ é obrigatório"
        if (!newSupplier.address) newErrors.address = "Endereço é obrigatório"
        if (!newSupplier.phone) newErrors.phone = "Telefone é obrigatório"
        if (!newSupplier.email) newErrors.email = "Email é obrigatório"
        if (!newSupplier.mainContact) newErrors.mainContact = "Contato Principal é obrigatório"

        const existingSupplier = suppliers.find(s => s.cnpj === newSupplier.cnpj && s.id !== selectedSupplier?.id)
        if (existingSupplier) {
            newErrors.cnpj = "Este CNPJ já está cadastrado.";
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleCreateOrUpdateSupplier = async () => {
        if (!validate()) return

        const method = selectedSupplier ? "PUT" : "POST"
        const url = selectedSupplier
            ? `http://localhost:3001/api/suppliers/${selectedSupplier.id}`
            : "http://localhost:3001/api/suppliers"

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSupplier),
        })

        if (response.ok) {
            fetchSuppliers()
            setIsDialogOpen(false)
            setSelectedSupplier(null)
            setNewSupplier({ name: "", cnpj: "", address: "", phone: "", email: "", mainContact: "" })
            setErrors({})
            toast.success(`Fornecedor ${selectedSupplier ? "atualizado" : "cadastrado"} com sucesso!`);
        } else {
            toast.error(`Erro ao ${selectedSupplier ? "atualizar" : "cadastrar"} fornecedor.`);
        }
    }

    const handleDeleteSupplier = async (id: number) => {
        await fetch(`http://localhost:3001/api/suppliers/${id}`, {
            method: "DELETE",
        })
        fetchSuppliers()
    }

    const openDialog = (supplier: Supplier | null = null) => {
        setSelectedSupplier(supplier)
        setNewSupplier(
            supplier
                ? { name: supplier.name, cnpj: supplier.cnpj, address: supplier.address, phone: supplier.phone, email: supplier.email, mainContact: supplier.mainContact }
                : { name: "", cnpj: "", address: "", phone: "", email: "", mainContact: "" }
        )
        setIsDialogOpen(true)
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Fornecedores</h1>
                <Button onClick={() => openDialog()}>Adicionar Fornecedor</Button>
            </div>
            <div className="mb-4">
                <Input
                    placeholder="Pesquisar fornecedores..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>CNPJ</TableHead>
                        <TableHead>Endereço</TableHead>
                        <TableHead>Telefone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contato Principal</TableHead>
                        <TableHead>Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredSuppliers.map(supplier => (
                        <TableRow key={supplier.id}>
                            <TableCell>{supplier.name}</TableCell>
                            <TableCell>{supplier.cnpj}</TableCell>
                            <TableCell>{supplier.address}</TableCell>
                            <TableCell>{supplier.phone}</TableCell>
                            <TableCell>{supplier.email}</TableCell>
                            <TableCell>{supplier.mainContact}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" onClick={() => openDialog(supplier)}>
                                    Editar
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteSupplier(supplier.id)}
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
                        <DialogTitle>{selectedSupplier ? "Editar Fornecedor" : "Adicionar Fornecedor"}</DialogTitle>
                        <DialogDescription>
                            Preencha os detalhes do fornecedor abaixo.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Nome *
                            </Label>
                            <Input
                                id="name"
                                value={newSupplier.name}
                                onChange={e => {
                                    setNewSupplier({ ...newSupplier, name: e.target.value })
                                    if (errors.name) setErrors({ ...errors, name: "" })
                                }}
                                className="col-span-3"
                            />
                            {errors.name && <span className="col-span-4 text-red-500 text-sm">{errors.name}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cnpj" className="text-right">
                                CNPJ *
                            </Label>
                            <Input
                                id="cnpj"
                                value={newSupplier.cnpj}
                                onChange={e => {
                                    const formattedCnpj = e.target.value
                                        .replace(/\D/g, '')
                                        .replace(/^(\d{2})(\d)/, '$1.$2')
                                        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                                        .replace(/\.(\d{3})(\d)/, '.$1/$2')
                                        .replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
                                    setNewSupplier({ ...newSupplier, cnpj: formattedCnpj })
                                    if (errors.cnpj) setErrors({ ...errors, cnpj: "" })
                                }}
                                className="col-span-3"
                                placeholder="00.000.000/0000-00"
                            />
                            {errors.cnpj && <span className="col-span-4 text-red-500 text-sm">{errors.cnpj}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Endereço *
                            </Label>
                            <Textarea
                                id="address"
                                value={newSupplier.address}
                                onChange={e => {
                                    setNewSupplier({ ...newSupplier, address: e.target.value })
                                    if (errors.address) setErrors({ ...errors, address: "" })
                                }}
                                className="col-span-3"
                                placeholder="Insira o endereço completo da empresa"
                            />
                            {errors.address && <span className="col-span-4 text-red-500 text-sm">{errors.address}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                                Telefone *
                            </Label>
                            <Input
                                id="phone"
                                value={newSupplier.phone}
                                onChange={e => {
                                    const formattedPhone = e.target.value
                                        .replace(/\D/g, '')
                                        .replace(/^(\d{2})(\d)/, '($1) $2')
                                        .replace(/(\d{5})(\d)/, '$1-$2')
                                    setNewSupplier({ ...newSupplier, phone: formattedPhone })
                                    if (errors.phone) setErrors({ ...errors, phone: "" })
                                }}
                                className="col-span-3"
                                placeholder="(00) 00000-0000"
                            />
                            {errors.phone && <span className="col-span-4 text-red-500 text-sm">{errors.phone}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email *
                            </Label>
                            <Input
                                id="email"
                                value={newSupplier.email}
                                onChange={e => {
                                    setNewSupplier({ ...newSupplier, email: e.target.value })
                                    if (errors.email) setErrors({ ...errors, email: "" })
                                }}
                                className="col-span-3"
                                placeholder="exemplo@fornecedor.com"
                            />
                            {errors.email && <span className="col-span-4 text-red-500 text-sm">{errors.email}</span>}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="mainContact" className="text-right">
                                Contato Principal *
                            </Label>
                            <Input
                                id="mainContact"
                                value={newSupplier.mainContact}
                                onChange={e => {
                                    setNewSupplier({ ...newSupplier, mainContact: e.target.value })
                                    if (errors.mainContact) setErrors({ ...errors, mainContact: "" })
                                }}
                                className="col-span-3"
                                placeholder="Nome do contato principal"
                            />
                            {errors.mainContact && <span className="col-span-4 text-red-500 text-sm">{errors.mainContact}</span>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateOrUpdateSupplier}>Salvar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
