import { useNavigate } from "react-router-dom";

function LogoutLink(props: { children: React.ReactNode }) {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        // Make the logout request to the backend
        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: "",
        })
            .then((response) => {
                if (response.ok) {
                    // Once logged out, we can ensure session is cleared on client-side as well
                    // You may clear cookies, localStorage, etc.
                    // localStorage.removeItem("userSession"); // If you're using localStorage
                    // document.cookie = 'sessionCookie=; Max-Age=0'; // Clear cookies if used

                    // After successful logout, navigate the user to the login page
                    navigate("/Login", { replace: true });
                } else {
                    console.error("Logout failed", response);
                }
            })
            .catch((error) => {
                console.error("Error logging out:", error);
            });
    };

    return (
        <>
            <a href="#" onClick={handleSubmit}>{props.children}</a>
        </>
    );
}

export default LogoutLink;