import AppLayout from "../../components/layout/AppLayout";
import JoinTripForm from "./JoinTripForm";
import MyRequests from "./MyRequests";

const JoinTrip = () => {

    return (

        <AppLayout>

            <div className="max-w-5xl mx-auto space-y-8">

                <div>

                    <h1 className="text-5xl font-bold">

                        Join a Trip

                    </h1>

                    <p className="mt-3 text-zinc-500">

                        Enter your friend's Trip Code and send a join request.

                    </p>

                </div>

                <JoinTripForm />

                <MyRequests />

            </div>

        </AppLayout>

    );

};

export default JoinTrip;