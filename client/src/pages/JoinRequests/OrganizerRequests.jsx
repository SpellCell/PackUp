import AppLayout from "../../components/layout/AppLayout";
import PendingRequests from "./PendingRequests";

const OrganizerRequests = () => {

    return (

        <AppLayout>

            <div className="max-w-6xl mx-auto">

                <h1 className="text-5xl font-bold mb-10">

                    Join Requests

                </h1>

                <PendingRequests />

            </div>

        </AppLayout>

    );

};

export default OrganizerRequests;