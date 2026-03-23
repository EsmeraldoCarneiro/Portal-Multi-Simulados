import { useState } from 'react';
import { allQuestions } from './data'; // Importa o objeto centralizador que contém as matérias (portugues, informatica, etc)

/**
 * FUNÇÃO DE EMBARALHAMENTO (Utility Function)
 * Aceita um array de questões e retorna um novo array misturado.
 * Também entra em cada questão e mistura as suas opções de resposta.
 */
const shuffleAll = (array) => {
  if (!array || array.length === 0) return [];
  
  // 1. Embaralha a ordem das questões usando o método sort com um valor randômico
  let newArray = [...array].sort(() => Math.random() - 0.5);

  // 2. Mapeia o array para embaralhar as alternativas dentro de cada objeto de questão
  newArray = newArray.map(q => ({
    ...q,
    options: [...q.options].sort(() => Math.random() - 0.5)
  }));
  
  return newArray;
};

export default function App() {
  // --- DEFINIÇÃO DE ESTADOS (Hooks) ---
  
  // currentSubject: Armazena o ID da matéria escolhida (ex: 'informatica'). Inicia como null para mostrar o menu.
  const [currentSubject, setCurrentSubject] = useState(null); 
  
  // questions: Armazena a lista de questões que serão exibidas (já embaralhadas).
  const [questions, setQuestions] = useState([]);
  
  // answers: Objeto que guarda as escolhas do usuário. Chave é o ID da questão, valor é o texto da opção.
  const [answers, setAnswers] = useState({});
  
  // submitted: Booleano que controla se o usuário terminou a prova (mostra questões ou resultado).
  const [submitted, setSubmitted] = useState(false);

  // --- DICIONÁRIO DE TÍTULOS ---
  // Mapeia os IDs técnicos (chaves) para os nomes que o usuário verá no título do cabeçalho.
  const subjectTitles = {
    especificos: "Conhecimentos Específicos",
    informatica: "Noções de Informática",
    portugues: "Língua Portuguesa",
    matematica: "Matemática & Raciocínio"
  };

  // --- FUNÇÕES DE LÓGICA ---

  /**
   * startSimulado: Prepara a aplicação para iniciar uma matéria.
   * @param {string} subjectKey - O ID da matéria clicada no menu.
   */
  const startSimulado = (subjectKey) => {
    const data = allQuestions[subjectKey]; // Busca os dados no arquivo centralizador
    if (data) {
      setQuestions(shuffleAll(data)); // Alimenta o estado com questões misturadas
      setCurrentSubject(subjectKey);   // Define a matéria ativa
      setAnswers({});                  // Reseta as respostas
      setSubmitted(false);             // Garante que o modo resultado está desligado
      window.scrollTo(0, 0);           // Volta a tela para o topo
    }
  };

  /**
   * handleSelect: Salva a opção clicada pelo usuário.
   */
  const handleSelect = (questionId, optionText) => {
    setAnswers({ ...answers, [questionId]: optionText });
  };

  /**
   * calculateScore: Percorre as questões e compara a resposta dada com o gabarito.
   */
  const calculateScore = () => {
    return questions.reduce((acc, curr) => {
      // Se a resposta no estado 'answers' for igual ao campo 'answer' do objeto, soma 1
      return acc + (answers[curr.id] === curr.answer ? 1 : 0);
    }, 0);
  };

  /**
   * handleRestart: Reinicia a mesma matéria, gerando uma nova ordem de perguntas.
   */
  const handleRestart = () => {
    setAnswers({});
    setSubmitted(false);
    setQuestions(shuffleAll(allQuestions[currentSubject]));
    window.scrollTo(0, 0);
  };

  // Variáveis calculadas para facilitar o uso no JSX
  const score = calculateScore();
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  // =========================================================================
  // --- RENDERIZAÇÃO 1: MENU PRINCIPAL (Se não houver matéria selecionada) ---
  // =========================================================================
  if (!currentSubject) {
    return (
      <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ color: '#003366', fontSize: '2.8rem', fontWeight: '900' }}>PORTAL MULTI-SIMULADOS</h1>
            <p style={{ color: '#4a5568' }}>Selecione uma disciplina para iniciar o treinamento</p>
          </header>

          {/* Grid que organiza os cards das matérias */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
            {[
              { id: 'especificos', title: 'Conhecimentos Específicos', icon: '⚖️' },
              { id: 'informatica', title: 'Noções de Informática', icon: '💻' },
              { id: 'portugues', title: 'Língua Portuguesa', icon: '✍️' },
              { id: 'matematica', title: 'Matemática & Raciocínio', icon: '📊' },
            ].map((sub) => (
              <div 
                key={sub.id}
                onClick={() => startSimulado(sub.id)} // Dispara a função de início ao clicar no card
                style={{
                  backgroundColor: '#fff', padding: '40px 20px', borderRadius: '20px', cursor: 'pointer',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.08)', borderBottom: '6px solid #ffc107',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>{sub.icon}</div>
                <h3 style={{ color: '#003366' }}>{sub.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // --- RENDERIZAÇÃO 2: ÁREA DO SIMULADO (Prova ou Resultado) ---
  // =========================================================================
  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', paddingBottom: '120px' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', fontFamily: 'Segoe UI, sans-serif' }}>
        
        {/* BOTÃO VOLTAR: Só aparece se a prova NÃO foi finalizada (submitted === false) */}
        {!submitted && (
          <button 
            onClick={() => setCurrentSubject(null)} 
            style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#003366', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ← VOLTAR AO MENU PRINCIPAL
          </button>
        )}

        {/* --- MODO PROVA --- */}
        {!submitted ? (
          <main>
            {/* Cabeçalho dinâmico usando o dicionário subjectTitles */}
            <header style={{ backgroundColor: '#003366', borderRadius: '15px', padding: '30px', textAlign: 'center', color: '#fff', marginBottom: '30px', borderBottom: '6px solid #ffc107' }}>
              <h1 style={{ margin: 0, textTransform: 'uppercase', fontSize: '1.8rem' }}>
                {subjectTitles[currentSubject]}
              </h1>
              <p style={{ margin: '10px 0 0', color: '#ffc107', fontWeight: 'bold' }}>SIMULADO</p>
            </header>

            {/* Loop que desenha cada questão na tela */}
            {questions.map((item, index) => (
              <section key={item.id} style={{ marginBottom: '25px', padding: '25px', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', borderLeft: `8px solid ${answers[item.id] ? '#003366' : '#cbd5e0'}` }}>
                <p style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
                  {index + 1}. {item.q}
                </p>
                
                {/* Loop das alternativas */}
                {item.options.map((opt) => {
                  const isSelected = answers[item.id] === opt;
                  return (
                    <label key={opt} style={{ 
                      display: 'flex', alignItems: 'center', padding: '14px', margin: '10px 0', borderRadius: '10px', 
                      cursor: 'pointer', border: '2px solid #003366',
                      backgroundColor: isSelected ? '#003366' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#003366',
                      transition: '0.2s ease'
                    }}>
                      <input type="radio" name={`q-${item.id}`} checked={isSelected} onChange={() => handleSelect(item.id, opt)} style={{ marginRight: '15px', accentColor: '#ffc107' }} />
                      <span style={{ fontWeight: '500' }}>{opt}</span>
                    </label>
                  );
                })}
              </section>
            ))}
            
            {/* Rodapé fixo para controle de progresso */}
            <footer style={{ position: 'fixed', bottom: '0', left: '0', right: '0', backgroundColor: '#fff', padding: '15px 30px', zIndex: '1000', boxShadow: '0 -5px 20px rgba(0,0,0,0.05)' }}>
              <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: '700', color: '#4a5568' }}>
                  Respondidas: {answeredCount} / {totalQuestions}
                </span>
                <button 
                  onClick={() => { if(confirm("Deseja finalizar agora?")) { window.scrollTo(0,0); setSubmitted(true); } }}
                  style={{ padding: '12px 35px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '50px', fontSize: '1.1rem', fontWeight: '800', cursor: 'pointer' }}
                >
                  Finalizar Simulado
                </button>
              </div>
            </footer>
          </main>
        ) : (
          /* --- MODO RESULTADO --- */
          <aside>
            <div style={{ backgroundColor: '#fff', padding: '50px 40px', borderRadius: '20px', border: '2px solid #003366', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 style={{ color: '#003366', fontSize: '2.5rem', margin: '0' }}>RESULTADO</h2>
              
              {/* Cálculo da nota (Regra de 3 para escala 0-10) */}
              <div style={{ fontSize: '6rem', fontWeight: '800', color: '#003366', lineHeight: '1.1', margin: '15px 0' }}>
                {((score / totalQuestions) * 10).toFixed(1)}
              </div>
              
              <p style={{ fontSize: '1.4rem', color: '#4a5568', marginBottom: '30px' }}>
                Você acertou <strong>{score}</strong> de <strong>{totalQuestions}</strong> questões.
              </p>
              
              {/* Botões de fluxo após o término */}
              <div style={{ display: 'flex', gap: '15px' }}>
                <button onClick={handleRestart} style={{ padding: '15px 30px', borderRadius: '30px', background: '#003366', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Tentar Novamente</button>
                <button onClick={() => setCurrentSubject(null)} style={{ padding: '15px 30px', borderRadius: '30px', background: '#4a5568', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Mudar Matéria</button>
              </div>
            </div>

            {/* Revisão das questões: Comparação final */}
            <h3 style={{ color: '#003366', marginTop: '40px' }}>Revisão Detalhada:</h3>
            {questions.map((item) => {
              const isCorrect = answers[item.id] === item.answer;
              return (
                <div key={item.id} style={{ padding: '20px', marginBottom: '15px', borderRadius: '12px', backgroundColor: '#fff', borderLeft: `10px solid ${isCorrect ? '#48bb78' : '#f56565'}` }}>
                  <p style={{ fontWeight: 'bold', margin: '0' }}>{item.q}</p>
                  <p style={{ margin: '10px 0 5px 0', color: isCorrect ? '#2f855a' : '#c53030', fontWeight: 'bold' }}>
                    {isCorrect ? '✓ Acertou!' : '✗ Errou!'}
                  </p>
                  {/* Gabarito que aparece sempre para reforçar o aprendizado */}
                  <p style={{ margin: '0', fontSize: '1rem', color: '#4a5568' }}>
                    <strong>Resposta correta:</strong> {item.answer}
                  </p>
                </div>
              );
            })}
          </aside>
        )}
      </div>
    </div>
  );
}