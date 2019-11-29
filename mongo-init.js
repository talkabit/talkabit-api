db.createUser(
        {
            user: "tab",
            pwd: "sereno",
            roles: [
                {
                    role: "readWrite",
                    db: "tab"
                }
            ]
        }
);