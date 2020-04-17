exports.module = {
    sessionCheck: function (body) {
        if (session) {
            redirect("/dashboard");
        } else {
            redirect("/");
        }
    }
}