import {Button} from "@/components/ui/button";

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
                <Button>Click me</Button>
            </div>
        </main>
    );
}