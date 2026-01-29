import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function AppOld() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

import TransactionForm from './services/firebase/TransactionForm';
import { signInWithGoogle ,logout} from '@/services/firebase/auth';
import { useAuth } from '@/services/firebase/useAuth';

// import Mas from './firebase/Form1'
const App = () => {
    const { user, loading } = useAuth();
    // if (loading) return <p>Loading...</p>;

  return (
    <div className="App">
      <h1></h1>
      {/* <ViewPager /> */}
        {user ? (
        <>
          <p>Welcome {user.displayName}</p>
          <img src={user.photoURL} width={40} />
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={signInWithGoogle}>
          Sign in with Google
        </button>
      )}
      <TransactionForm />
      {/* <MasterDetailForm /> */}
    </div>
  );
};

export default App;
