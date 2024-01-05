import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GraphPage } from './pages/GraphPage';
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const queryClient = new QueryClient()

    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <Routes>
                  <Route path="*" element={<GraphPage />} />
            </Routes>
        </BrowserRouter>
      </ QueryClientProvider>
    )
}

export default App
