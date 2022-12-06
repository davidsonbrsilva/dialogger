import { useCallback, useEffect, useState, useRef } from 'react';

import { debounce } from 'debounce';

import './App.scss';

import messages from './shared/messages';
import placeholders from './shared/placeholders';

import QuestionInput from './components/QuestionInput';

function App() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(messages.DO_A_QUESTION);
  const [placeholder, setPlaceholder] = useState('');
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);

  const inputRef = useRef(null);

  const options: { [key: string]: string } = {
    yes: 'Sim',
    no: 'Não',
    maybe: 'Talvez',
  };

  useEffect(() => {
    setPlaceholder(getPlaceholder());
    inputRef.current?.focus();
  }, []);

  const getPlaceholder = () => placeholders[Math.floor(Math.random() * placeholders.length)];

  const handleAnswer = useCallback(
    debounce((newQuestion: string) => {
      if (newQuestion === '') {
        setAnswer(messages.DO_A_QUESTION);
        return;
      }

      if (!newQuestion.endsWith('?')) {
        setAnswer(messages.QUESTIONS_ENDS_WITH_QUESTION_MARK);
        return;
      }

      fetch('https://yesno.wtf/api')
        .then((response) => {
          if (response.ok) {
            return response.json();
          }

          setAnswer(messages.CANNOT_ANSWER);
        })
        .then((data) => {
          setIsQuestionAnswered(true);
          setAnswer(options[data.answer]);
          setPlaceholder(getPlaceholder());
        })
        .catch((_) => setAnswer(messages.CANNOT_ANSWER));
    }, 500),
    []
  );

  const handleQuestion = (newQuestion: string) => {
    setIsQuestionAnswered(false);

    const trimmedQuestion = newQuestion.trim();
    if (trimmedQuestion === question.trim()) return;

    setQuestion(newQuestion);
    setAnswer(messages.THINKING);
    handleAnswer(trimmedQuestion);
  };

  const doAnotherQuestion = () => {
    setQuestion('');
    setAnswer(messages.DO_A_QUESTION);
    setIsQuestionAnswered(false);
  };

  const acceptSuggestion = () => {
    handleQuestion(placeholder);
  };

  return (
    <main className="app">
      <section className="question" onClick={() => inputRef.current?.focus()}>
        <div className="wrapper">
          <QuestionInput ref={inputRef} placeholder={placeholder} value={question} onChanged={handleQuestion} />
          {!question && (
            <div className="controls">
              <button className="button" onClick={acceptSuggestion}>
                Aceitar sugestão
              </button>
              <p className="tip">
                Aperte <code>Tab</code> para aceitar a sugestão.
              </p>
            </div>
          )}
          {isQuestionAnswered && (
            <div className="controls">
              <button className="button" onClick={doAnotherQuestion}>
                Fazer outra pergunta
              </button>
              <p className="tip">
                Aperte <code>Ctrl</code> + <code>R</code> para fazer outra pergunta.
              </p>
            </div>
          )}
        </div>
      </section>
      <section className="answer">
        <p className="content">{answer}</p>
      </section>
    </main>
  );
}

export default App;
