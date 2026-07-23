import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = ({ children }) => {

    return (

        <div className="min-h-screen bg-[#09090B] text-white flex">

            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">

                <Topbar />

                <main
                    className="
                        flex-1
                        overflow-y-auto
                        px-8
                        py-8
                        xl:px-10
                    "
                >

                    {children}

                </main>

            </div>

        </div>

    );

};

export default AppLayout;