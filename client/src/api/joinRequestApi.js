import API from "./axios";

export const sendJoinRequest = (tripCode) =>

    API.post(

        "/join-request",

        {

            tripCode

        }

    );

export const getMyJoinRequests = () =>

    API.get(

        "/join-request/my"

    );

export const getPendingRequests = () =>

    API.get(

        "/join-request/pending"

    );

export const acceptRequest = (id) =>

    API.put(

        `/join-request/${id}/accept`

    );

export const rejectRequest = (id) =>

    API.put(

        `/join-request/${id}/reject`

    );