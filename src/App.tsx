//import React from 'react'
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index.tsx";
function App() {
    return (
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
