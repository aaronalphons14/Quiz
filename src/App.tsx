import { Quiz } from './components/Quiz';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-[#EC265F] to-[#26ECB4] bg-clip-text text-transparent">
            Interactive Quiz
          </h1>
        </div>
      </header>
      <main>
        <Quiz />
      </main>
    </div>
  );
}

export default App;
