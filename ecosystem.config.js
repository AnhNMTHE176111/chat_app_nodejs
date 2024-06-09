module.exports = {
    apps: [
        {
            name: "chat-app",
            script: "./bin/www",
            watch: true,
            autorestart: true,
            ignore_watch: ["node_modules", "logs"],
            instances: "max",
            exec_mode: "cluster",
            env: {
                NODE_ENV: "development",
            },
            env_production: {
                NODE_ENV: process.env.NODE_ENV || "production",
                PM2_PUBLIC_KEY: process.env.PM2_PUBLIC_KEY,
                PM2_SECRET_KEY: process.env.PM2_SECRET_KEY,
            },
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
