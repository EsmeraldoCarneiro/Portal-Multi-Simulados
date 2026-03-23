# 🎓 Portal Multi-Simulados

Repositório de uma aplicação web interativa desenvolvida em **React.js**, focada na preparação para o concurso da (Cargo: Profissional de Administração). O portal oferece uma experiência completa de simulado para múltiplas disciplinas em um único ambiente.

---

## 📚 Disciplinas Disponíveis

O portal conta com um banco de dados robusto de **190 questões**, distribuídas da seguinte forma:

* **⚖️ Conhecimentos Específicos:** 70 questões (Ética, Legislação, Redação Oficial e Adm. Pública).
* **💻 Noções de Informática:** 60 questões (Google Workspace, Microsoft 365 e Segurança).
* **✍️ Língua Portuguesa:** 30 questões (Vunesp - Gramática e Interpretação).
* **📊 Matemática & Raciocínio:** 30 questões (Lógica, Proporção, Porcentagem e Juros).

---

## ✨ Funcionalidades em Destaque

* **Navegação por Matérias:** Tela inicial com cards interativos para seleção de disciplina.
* **Double Shuffle Algorithm:** * As questões mudam de ordem a cada tentativa.
    * As alternativas (opções) dentro de cada questão também são embaralhadas para evitar a memorização por posição.
* **Correção por String Dinâmica:** Validação de acertos baseada no conteúdo textual, permitindo total aleatoriedade das alternativas sem comprometer o gabarito.
* **Cálculo de Nota Escalar (0-10):** Sistema de pontuação que converte automaticamente os acertos para a escala padrão educacional.
* **Revisão Pedagógica:** Após a conclusão, o usuário tem acesso a uma revisão detalhada com feedback visual (verde/vermelho) e o gabarito oficial sempre visível para reforço do aprendizado.
* **Interface Responsiva & UX:** * Rodapé fixo com contador de progresso.
    * Botões com efeitos de *hover* e transições suaves.
    * Navegação condicional que remove botões desnecessários na tela de resultados.

---

## 🛠️ Stack Tecnológica

* **Framework:** [React.js 18+](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Linguagem:** JavaScript (ES6+)
* **Estilização:** CSS-in-JS (Inline Styles com transições dinâmicas)

---

## 📂 Estrutura de Pastas (Escalabilidade)

O projeto foi estruturado para que novas matérias possam ser adicionadas sem alterar a lógica principal:

```text
src/
├── data/
│   ├── index.js          # Centralizador (Exporta todas as matérias)
│   ├── especificos.js    # Dados de Administração
│   ├── informatica.js    # Dados de TI
│   ├── portugues.js      # Dados de Gramática
│   └── matematica.js     # Dados de Lógica
├── App.jsx               # Lógica de Navegação, Estados e UI
└── main.jsx              # Entrada do React
```

---

## ⚙️ Como Executar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/Portal_Multi-Simulados.git
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Inicie o servidor local:**
    ```bash
    npm run dev
    ```

---

## 🧠 Desafios Técnicos Superados

* **Gerenciamento de Estado Único:** Controle de fluxo entre Menu -> Prova -> Resultado sem o uso de bibliotecas externas de rota (como React Router), mantendo o bundle leve.
* **UX Consistency:** Resolução de problemas de sobreposição de elementos em resoluções diferentes através de cálculos de `lineHeight` e `margin` dinâmicos.
* **Imutabilidade de Dados:** Garantia de que o embaralhamento não afetasse o banco de dados original através do uso de *spread operators* e cópias profundas de arrays.

---

**Desenvolvido por [Esmeraldo Junior]** *Focado em criar soluções que facilitam o aprendizado e a aprovação.* 🚀
