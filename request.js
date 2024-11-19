const baseURL = "https://127.0.0.1:5000/qx";

// 从 localStorage 获取 token
const getToken = () => localStorage.getItem("token");

const request = async (url, method = "GET", data = {}, headers = {}) => {
    try {
        const token = getToken();
        const response = await fetch(baseURL + url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: token ? `Bearer ${token}` : "",
                ...headers,
            },
            body: method === "POST" ? JSON.stringify(data) : null,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Request Error:", error.message);
        return { error: error.message };
    }
};

export default request;
