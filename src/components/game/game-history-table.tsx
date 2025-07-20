'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { GameResult } from '@/type/types';

interface GameHistoryTableProps {
    data: GameResult[];
    isLoading: boolean;
}

const columns: ColumnDef<GameResult>[] = [
    {
        accessorKey: 'result',
        header: 'Result',
        cell: ({ row }) => (
            <span className={`capitalize ${row.getValue('result') === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                {row.getValue('result')}
            </span>
        ),
    },
    {
        accessorKey: 'generatedNumber',
        header: 'Number',
    },
    {
        accessorKey: 'balanceChange',
        header: 'Points',
        cell: ({ row }) => (
            <span className={Number(row.getValue('balanceChange')) > 0 ? 'text-green-500' : 'text-red-500'}>
                {Number(row.getValue('balanceChange')) > 0 ? '+' : ''}{row.getValue('balanceChange')}
            </span>
        ),
    },
    {
        accessorKey: 'newBalance',
        header: 'Balance',
    },
    {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => new Date(row.getValue('date')).toLocaleString(),
    },
];

export function GameHistoryTable({ data, isLoading }: GameHistoryTableProps) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableHead key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                <div className="flex items-center justify-center space-x-4">
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && "selected"}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No recent games found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}