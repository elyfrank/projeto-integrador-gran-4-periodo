// app/page.tsx ou qualquer componente React
"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

type Item = {
    id: number
    name: string
}

export default function MinimalistFormAndList() {
    const [input, setInput] = useState("")
    const [items, setItems] = useState<Item[]>([])

    useEffect(() => {
        // Simula uma chamada à API
        const fetchItems = async () => {
            const response = await fetch('http://localhost:3001/api/products')
            const data = await response.json()
            setItems(data)
        }
        fetchItems()
    }, [])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        // Aqui você faria a chamada para salvar no backend
        setItems(prev => [...prev, { id: Date.now(), name: input }])
        setInput("")
    }

    return (
        <div className="max-w-xl mx-auto p-4 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <div className="flex gap-2">
                    <Input
                        id="name"
                        placeholder="Digite um nome"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="submit">Adicionar</Button>
                </div>
            </form>

            <div className="space-y-2">
                {items.map((item) => (
                    <Card key={item.id}>
                        <CardContent className="p-4">{item.name}</CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}