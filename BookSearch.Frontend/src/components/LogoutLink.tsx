import { useNavigate } from "react-router-dom";

function LogoutLink(props: { children: React.ReactNode }) {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        fetch("/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: "",
        })
            .then((response) => {
                if (response.ok) {
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