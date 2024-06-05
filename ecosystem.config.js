module.exports = {
    apps: [
        {
            name: "chat-app",
            script: "npm",
            args: "start",
            watch: true,
            autorestart: true,
            ignore_watch: ["node_modules", "logs"],
            instances: "max",
            exec_mode: "fork",
        },
    ],

    deploy: {
        production: {
            user: "SSH_USERNAME",
            host: "SSH_HOSTMACHINE",
            ref: "origin/master",
            repo: "GIT_REPOSITORY",
            path: "DESTINATION_PATH",
            "pre-deploy-local": "",
            "post-deploy":
                "npm install && pm2 reload ecosystem.config.js --env production",
            "pre-setup": "",
        },
    },
};
