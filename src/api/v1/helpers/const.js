const API_VERSION = "/api/v1";
const SALT_ROUNDS = 10;
const PASSWORD_RESET_TOKEN_TIME_TO_LIVE_MINUTES = 5;

const JWT_TTL = process.env.JWT_TTL;
const JWT_REFRESH_TTL = process.env.JWT_REFRESH_TTL;
const CLIENT_URL = process.env.CLIENT_URL;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

/** COMMON CONSTANTS */
const SINGLE_CONVERSATION = "single";
const GROUP_CONVERSATION = "group";
const NOTIFICATION_ON = "on";
const NOTIFICATION_OFF = "ff";

/** SOCKET CONSTANT */
const SOCKET_EVENT = {
    READ_MESSAGE: "read-message",
    SEND_MESSAGE: "send-message",
    GET_ONLINE_USERS: "get-online-users",
    SOCKET_CONNECTION: "connection",
    SOCKET_DISCONNECT: "disconnect",
    JOIN_ROOM: "join-room",
    LEAVE_ROOM: "leave-room",
};

const MESSAGE_TYPE = {
    VOICE: "voice",
    TEXT: "text",
    IMAGE: "image",
    FILE: "file",
};

module.exports = {
    API_VERSION,
    SALT_ROUNDS,
    CLIENT_URL,
    PASSWORD_RESET_TOKEN_TIME_TO_LIVE_MINUTES,
    JWT_TTL,
    JWT_REFRESH_TTL,
    COOKIE_SECRET,
    JWT_SECRET,
    SINGLE_CONVERSATION,
    GROUP_CONVERSATION,
    NOTIFICATION_ON,
    NOTIFICATION_OFF,
    SOCKET_EVENT,
    MESSAGE_TYPE
};
