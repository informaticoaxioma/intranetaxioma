import React from "react";

export default function RootLayout({
    children
}) {

    return (

        <div
            className="
                font-sans
                antialiased
                min-h-screen
                bg-[#F5F1EB]
            "
        >

            {children}

        </div>
    );
}