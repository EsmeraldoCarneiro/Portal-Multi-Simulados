import { useState } from 'react';
import { allQuestions } from './data';
import './App.css'; // Importação obrigatória do arquivo de estilo

/**
 * FUNÇÃO DE EMBARALHAMENTO
 */
const shuffleAll = (array) => {
  if (!array || array.length === 0) return [];
  let newArray = [...array].sort(() => Math.random() - 0.5);
  newArray = newArray.map(q => ({
    ...q,
    options: [...q.options].sort(() => Math.random() - 0.5)
  }));
  return newArray;
};

export default function App() {
  // --- ESTADOS ---
  const [currentSubject, setCurrentSubject] = useState(null); 
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // --- TRADUTOR DE TÍTULOS ---
  const subjectTitles = {
    especificos: "Conhecimentos Específicos",
    informatica: "Noções de Informática",
    portugues: "Língua Portuguesa",
    matematica: "Matemática & Raciocínio"
  };

  // --- FUNÇÕES ---
  const startSimulado = (subjectKey) => {
    const data = allQuestions[subjectKey];
    if (data) {
      setQuestions(shuffleAll(data));
      setCurrentSubject(subjectKey);
      setAnswers({});
      setSubmitted(false);
      window.scrollTo(0, 0);
    }
  };

  const handleSelect = (questionId, optionText) => {
    setAnswers({ ...answers, [questionId]: optionText });
  };

  const calculateScore = () => {
    return questions.reduce((acc, curr) => acc + (answers[curr.id] === curr.answer ? 1 : 0), 0);
  };

  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
    setQuestions(shuffleAll(allQuestions[currentSubject]));
    window.scrollTo(0, 0);
  };

  const score = calculateScore();
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  // =========================================================================
  // --- TELA 1: MENU PRINCIPAL ---
  // =========================================================================
  if (!currentSubject) {
    return (
      <div className="portal-container">
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <header style={{ marginBottom: '40px' }}>
            <h1 className="portal-title">Portal Multi-Simulados</h1>
            <p style={{ color: '#4a5568', fontSize: '1.1rem' }}>Selecione uma disciplina para o treinamento UNICAMP</p>
          </header>

          <div className="subjects-grid">
            {[
              { id: 'especificos', title: 'Conhecimentos Específicos', icon: '⚖️' },
              { id: 'informatica', title: 'Noções de Informática', icon: '💻' },
              { id: 'portugues', title: 'Língua Portuguesa', icon: '✍️' },
              { id: 'matematica', title: 'Matemática & Raciocínio', icon: '📊' },
            ].map((sub) => (
              <div key={sub.id} className="subject-card" onClick={() => startSimulado(sub.id)}>
                <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>{sub.icon}</div>
                <h3 style={{ color: '#003366', fontSize: '1.2rem', margin: 0 }}>{sub.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- TELA 2: ÁREA DO SIMULADO ---
  // =========================================================================
  return (
    <div className="portal-container" style={{ paddingBottom: '120px' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
        
        {/* Botão Voltar: Desaparece no modo resultado */}
        {!submitted && (
          <button onClick={() => setCurrentSubject(null)} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#003366', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            ← VOLTAR AO MENU PRINCIPAL
          </button>
        )}

        {!submitted ? (
          <main>
            <header style={{ backgroundColor: '#003366', borderRadius: '15px', padding: '30px', textAlign: 'center', color: '#fff', marginBottom: '30px', borderBottom: '6px solid #ffc107' }}>
              <h1 style={{ margin: 0, textTransform: 'uppercase', fontSize: 'clamp(1.2rem, 5vw, 1.8rem)' }}>
                {subjectTitles[currentSubject]}
              </h1>
              <p style={{ margin: '10px 0 0', color: '#ffc107', fontWeight: 'bold' }}>SIMULADO UNICAMP</p>
            </header>

            {questions.map((item, index) => (
              <section key={item.id} className="question-section" style={{ borderLeft: `8px solid ${answers[item.id] ? '#003366' : '#cbd5e0'}` }}>
                <p style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>{index + 1}. {item.q}</p>
                {item.options.map((opt) => {
                  const isSelected = answers[item.id] === opt;
                  return (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', padding: '14px', margin: '10px 0', borderRadius: '10px', cursor: 'pointer', border: '2px solid #003366', backgroundColor: isSelected ? '#003366' : '#ffffff', color: isSelected ? '#ffffff' : '#003366', transition: '0.2s ease' }}>
                      <input type="radio" name={`q-${item.id}`} checked={isSelected} onChange={() => handleSelect(item.id, opt)} style={{ marginRight: '15px', accentColor: '#ffc107' }} />
                      <span style={{ fontWeight: '500' }}>{opt}</span>
                    </label>
                  );
                })}
              </section>
            ))}
            
            <footer style={{ position: 'fixed', bottom: '0', left: '0', right: '0', backgroundColor: '#fff', padding: '15px 30px', zIndex: '1000', boxShadow: '0 -5px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1rem', fontWeight: '700', color: '#4a5568' }}>Respondidas: {answeredCount}/{totalQuestions}</span>
                <button onClick={() => { if(confirm("Deseja finalizar agora?")) { window.scrollTo(0,0); setSubmitted(true); } }} style={{ padding: '12px 25px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '50px', fontWeight: '800', cursor: 'pointer' }}>Finalizar</button>
              </div>
            </footer>
          </main>
        ) : (
          /* MODO RESULTADO */
          <aside>
            <div style={{ backgroundColor: '#fff', padding: '50px 20px', borderRadius: '20px', border: '2px solid #003366', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ color: '#003366', fontSize: '2rem', margin: '0' }}>RESULTADO</h2>
              
              <div className="score-display">
                {((score / totalQuestions) * 10).toFixed(1)}
              </div>
              
              <p style={{ fontSize: '1.3rem', color: '#4a5568', marginBottom: '30px' }}>Você acertou <strong>{score}</strong> de <strong>{totalQuestions}</strong>.</p>
              
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button onClick={handleRestart} style={{ padding: '15px 30px', borderRadius: '30px', background: '#003366', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Refazer</button>
                <button onClick={() => setCurrentSubject(null)} style={{ padding: '15px 30px', borderRadius: '30px', background: '#e2e8f0', color: '#003366', border: '2px solid #003366', fontWeight: 'bold', cursor: 'pointer' }}>Mudar Matéria</button>
              </div>
            </div>

            <h3 style={{ color: '#003366', marginTop: '40px', marginBottom: '20px' }}>Revisão Detalhada:</h3>
            {questions.map((item) => {
              const isCorrect = answers[item.id] === item.answer;
              return (
                <div key={item.id} className="question-section" style={{ borderLeft: `10px solid ${isCorrect ? '#48bb78' : '#f56565'}` }}>
                  <p style={{ fontWeight: 'bold', margin: '0' }}>{item.q}</p>
                  <p style={{ margin: '10px 0 5px 0', color: isCorrect ? '#2f855a' : '#c53030', fontWeight: 'bold' }}>{isCorrect ? '✓ Acertou!' : '✗ Errou!'}</p>
                  <p style={{ margin: '0', fontSize: '1rem', color: '#4a5568' }}><strong>Gabarito:</strong> {item.answer}</p>
                </div>
              );
            })}
          </aside>
        )}
      </div>
    </div>
  );
}