import API from "./axios";

export const getChatHistory = (

    tripId,

    page = 1

) =>

    API.get(

        `/chat/${tripId}/history?page=${page}`

    );