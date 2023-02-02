export class Helpers {
    static checkTokenExpired(data) {
        if (data.data === "token expired") {
            alert("Token expired, please login again.");
            window.localStorage.clear();
            window.location.href = "./sign-in";
        }
    }
}
