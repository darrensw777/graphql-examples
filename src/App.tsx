import './App.css';
import UserLookup from './components/UserLookup';

function App() {
    return (
        <main className="app">
            <header className="app-header">
                <p className="eyebrow">React · TypeScript · GraphQL</p>
                <h1>GraphQL examples</h1>
                <p>Find a user, explore their posts and update their name.</p>
            </header>

            <div className="lookup-card">
                <UserLookup />
            </div>

            <aside className="demo-notes" aria-label="Demo information">
                <h2>Try it out</h2>
                <ul>
                    <li>Search for user 1 (Darren) or 2 (Sarah).</li>
                    <li>Search for 999 to see the missing-user state.</li>
                    <li>Edit a name to run a GraphQL mutation.</li>
                </ul>
                <p>Changes are stored in memory and reset when the backend restarts.</p>
            </aside>
        </main>
    );
}

export default App;
