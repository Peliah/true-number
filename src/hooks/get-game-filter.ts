import { GameStatusFilter } from '@/type/types';
import { useState } from 'react';


export function useGamesFilter() {
    const [statusFilter, setStatusFilter] = useState<GameStatusFilter>('all');

    return {
        statusFilter,
        setStatusFilter,
        // Convert to query param (returns undefined for 'all')
        getQueryParam: () => statusFilter === 'all' ? undefined : statusFilter
    };
}