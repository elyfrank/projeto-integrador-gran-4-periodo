import {Button} from "@/components/ui/button";
import {createPost} from "@/app/lib/actions";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

type User = {
    id: number;
    name: string;
};

export default async function Home() {
    const users:User[] = await fetch('http://localhost:3001/api/users')
        .then((res) => res.json())

    return (
        <main style={{ padding: 20 }}>
            <h1>Usuários</h1>
            <ul>
                {users.map((u) => (
                    <li key={u.id}>{u.name}</li>
                ))}
            </ul>
            <div>
                <Button onClick={createPost}>Click me</Button>
            </div>
        </main>
    );
}