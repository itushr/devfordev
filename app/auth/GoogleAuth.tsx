"use client";

export default function GoogleLoginButton({
    children,
    className=""
}: {
    children: React.ReactNode;
    className: string
}) {
    function login() {
        const params = new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
            response_type: "code",
            scope: "openid email profile",
            access_type: "offline",
            prompt: "select_account",
        });

        window.location.href =
            `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    }

    return (
        <div
            onClick={login}
            role="button"
            className={className}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ")
                    login();
            }}
        >
            {children}
        </div>
    );
}