import { useCallback, useEffect, useState, useRef } from 'react'

import { debounce } from "debounce"

import './App.css'

import messages from './util/messages';
import placeholders from './util/placeholders';

import QuestionInput from './components/QuestionInput';

function App() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('Faça uma pergunta de "sim" ou "não".');
    const [placeholder, setPlaceholder] = useState('');
    const [wasQuestionAnswered, setIsQuestionAnswered] = useState(false);

    const inputRef = useRef(null);

    const options: { [key: string]: string } = {
        "yes": "Sim",
        "no": "Não",
        "maybe": "Talvez"
    }

    useEffect(() => {
        setPlaceholder(getPlaceholder());
    }, [])

    const getPlaceholder = () => placeholders[Math.floor(Math.random() * placeholders.length)];

    const handleAnswer = useCallback(debounce((newQuestion: string) => {
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
                    return response.json()
                }

                setAnswer(messages.CANNOT_ANSWER)
            })
            .then((data) => {
                setIsQuestionAnswered(true);
                setAnswer(options[(data.answer)])
                setPlaceholder(getPlaceholder());
            })
            .catch(_ => setAnswer(messages.CANNOT_ANSWER))
    }, 500), []);

    const handleQuestion = (newQuestion: string) => {
        setIsQuestionAnswered(false);

        const trimmedQuestion = newQuestion.trim();
        if (trimmedQuestion === question.trim()) return;

        setQuestion(newQuestion);
        setAnswer(messages.THINKING);
        handleAnswer(trimmedQuestion);
    }

    const doAnotherQuestion = () => {
        setQuestion('');
        setAnswer(messages.DO_A_QUESTION);
        setIsQuestionAnswered(false);
    }

    return <div className='container'>
        <div className='question-area' onClick={() => inputRef.current?.focus()}>
            <div className='question-wrapper'>
                <QuestionInput
                    ref={inputRef}
                    placeholder={placeholder}
                    value={question}
                    onChanged={handleQuestion}
                />
                {!question && <p className="tip">Aperte "Tab" para aceitar a sugestão.</p>}
                {wasQuestionAnswered &&
                    <button className='button' onClick={doAnotherQuestion}>
                        Fazer outra pergunta
                    </button>
                }
            </div>
        </div>
        <div className='answer-area'>
            <p className='answer'>{answer}</p>
        </div>
    </div>
}

export default App
