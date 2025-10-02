export default defineAppConfig({
    ui: {
        strategy: "merge",
        primary: "niagara",
        card: {
            base: "",
            ring: "",
            divide: "divide-y divide-gray-200 dark:divide-gray-700",
            header: { padding: "px-4 py-5 " },
            body: {
                padding: "py-2 px-4",
                base: "divide-y divide-gray-200 dark:divide-gray-700",
            },
            footer: { padding: "p-4" },
        },

        tooltip: {
            background: "bg-gray-900 dark:bg-gray-900",
            color: "text-white dark:text-white",
            ring: "ring-1 ring-gray-800 dark:ring-gray-800",
        },

        table: {
            th: { base: "w-fit" },
            td: { base: "!py-2.5 w-fit" },
            default: { checkbox: { color: "primary" as any } },
            base: "divide-y overflow-scroll border-t border-x-none divide-gray-200 dark:divide-gray-700",
            body: {
                base: "divide-y-2 divide-gray-200 dark:divide-gray-700",
            },

        },

        slideover: {
            width: "sm:max-w-3xl",
            footer: { base: "border-t border-gray-200 bg-gray-100" },
            overlay: {
                background: "bg-gray-900/20 backdrop-blur-sm",
            },
        },

        modal: {
            rounded: "rounded-none",
            base: "py-0",
            icon: { base: "text-red-500 dark:text-red-400" },
            overlay: { background: "bg-gray-900/20  backdrop-blur-sm" },
            footer: { base: "bg-gray-100" },
            width: "w-full sm:max-w-4xl",
            header: {
                base: "bg-gray-100 border-b  border-gray-200",
                inner: "py-0 h-full",
                padding: "py-2",
            },
        },
        

    },
});
