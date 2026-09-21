import API from "./axios";

export const getTripSettlements = (
    tripId
) =>
    API.get(
        `/settlements/${tripId}`
    );

export const markSettlementPaid = (
    tripId,
    settlementId
) =>
    API.put(
        `/settlements/${tripId}/${settlementId}/pay`
    );