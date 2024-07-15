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
    REACT_MESSAGE: "react-message",
    DELETE_MESSAGE: "delete-message",
    DELETED_MESSAGE: "deleted-message",
    GET_ONLINE_USERS: "get-online-users",
    SOCKET_CONNECTION: "connection",
    SOCKET_DISCONNECT: "disconnect",

    /** CALL */
    JOIN_ROOM: "join-room",
    LEAVE_ROOM: "leave-room",
    PARTICIPANT_JOINED: "participant-joined",
    PARTICIPANT_LEFT: "participant-left",
    CALL_USER: "call-user",
    CALL_MADE: "call-made",
    MAKE_ANSWER: "make-answer",
    ANSWER_MADE: "answer-made",
    CANDIDATE: "candidate",
    CALLING_OFFER: "calling-offer",
    CALLING_DISCONNECT: "disconnect",
    START_CALL: "start-call",
    RECEIVE_CALL: "receive-call",
    END_CALL: "end-call",
    IS_IN_ANOTHER_CALL: "is-in-another-call",
    ALREADY_MADE_ANSWER: "already-made-answer",
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
    MESSAGE_TYPE,
};
