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
      <div className="app-container">{children}</div>
      <Toaster
        containerStyle={{
          top: "5rem",
        }}
      />
    </AccountProvider>
  );
};

export default App;
