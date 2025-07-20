import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/miscellenous/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (

        <SidebarProvider>
            <AppSidebar />
            <section className="flex flex-col w-full">
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:px-6 w-full">
                    <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors" />
                </header>

                <main className="space-y-6 px-4 lg:px-6 w-full">
                    {children}
                </main>
            </section>
        </SidebarProvider>
    )
}