
interface GameHeaderProps {
    balance: number;
}

export function GameHeader({ balance }: GameHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-8">
            <div className="text-2xl font-bold">
                Balance: <span className={balance >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {balance} points
                </span>
            </div>
        </div>
    );
}