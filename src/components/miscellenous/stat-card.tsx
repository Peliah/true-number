import { TrendingUp } from "lucide-react"

interface StatsCardProps {
    title: string
    count: number
    icon: React.ReactNode
    description: string
    onClick: () => void
    loading?: boolean
    error?: string | null
    trend?: {
        value: number
        isPositive: boolean
    }
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    count,
    icon,
    description,
    onClick,
    loading = false,
    error = null,
    trend
}) => {
    return (
        <div
            onClick={onClick}
            className="group relative bg-card hover:bg-accent/50 border border-border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

            <div className="relative">
                {/* Header with icon */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-200">
                            {icon}
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                            {title}
                        </h3>
                    </div>
                    {trend && (
                        <div className={`flex items-center space-x-1 text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}>
                            <TrendingUp className={`w-3 h-3 ${trend.isPositive ? '' : 'rotate-180'}`} />
                            <span>{trend.value}%</span>
                        </div>
                    )}
                </div>

                {/* Count */}
                <div className="mb-2">
                    {loading ? (
                        <div className="h-8 bg-muted animate-pulse rounded w-20" />
                    ) : error ? (
                        <div className="text-red-500">
                            <p className="text-2xl font-bold">--</p>
                            <p className="text-xs text-red-400 mt-1">Error loading data</p>
                        </div>
                    ) : (
                        <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                            {count.toLocaleString()}
                        </p>
                    )}
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-200">
                    {description}
                </p>

                {/* Click indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                </div>
            </div>
        </div>
    )
}

export default StatsCard