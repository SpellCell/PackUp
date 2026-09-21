import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AppRoutes from "./routes/AppRoutes";

import { SocketProvider } from "./context/socketContext";

function App() {

    return (

        <BrowserRouter>

            <Toaster
                position="top-right"
            />

            <SocketProvider>

                <AppRoutes />

            </SocketProvider>

        </BrowserRouter>

    );

}

export default App;