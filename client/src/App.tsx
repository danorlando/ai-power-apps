import { GPTPlus } from './modules'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PrimeReact from "primereact/api";

PrimeReact.ripple = true;

const queryClient = new QueryClient();

//theme
import "primereact/resources/themes/luna-blue/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";
//primeflex
import "primeflex/primeflex.css";
//custom css
import "./App.css";

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <GPTPlus />
    </QueryClientProvider>
  )
}

export default App
