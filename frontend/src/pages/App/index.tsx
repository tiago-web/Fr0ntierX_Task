import { Toaster } from "react-hot-toast";
import Header from "../../components/Header";

import AccountProvider from "../../contexts/AccountContext";

import "./styles.css";

interface AppProps {
  children: React.ReactNode;
}

const App: React.FC<AppProps> = ({ children }) => {
  return (
    <AccountProvider>
      <Header />
      <div className="App">{children}</div>
      <Toaster />
    </AccountProvider>
  );
};

export default App;
