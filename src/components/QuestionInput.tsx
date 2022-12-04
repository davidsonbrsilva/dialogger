import React, { forwardRef, useEffect, useRef, useState } from 'react';
import './QuestionInput.css';

interface QuestionInputProps {
    placeholder?: string,
    value: string,
    onChanged: (newValue: string) => void
}

function QuestionInput({ placeholder, value, onChanged }: QuestionInputProps, ref: any) {

    useEffect(() => {
        if (value === '') {
            if (ref.current) {
                ref.current.innerText = '';
                console.log(ref)

                ref.current.focus();
            }
        }
    }, [value])

    const autoCompleteWithPlaceholder = (e: React.KeyboardEvent<HTMLDivElement>) => {

        if (ref.current.innerText === '' && e.code === 'Tab') {
            e.preventDefault();
            ref.current.innerText = placeholder;

            const range = new Range();
            range.setStart(ref.current.firstChild, ref.current.innerText.length)

            document.getSelection()?.removeAllRanges();
            document.getSelection()?.addRange(range);
        }
    }

    return (
        <div
            ref={ref}
            className="input"
            contentEditable
            onKeyDown={autoCompleteWithPlaceholder}
            onKeyUp={e => onChanged((e.target as HTMLDivElement).innerText)}
            placeholder={placeholder} >
        </div >
    )
}

export default forwardRef(QuestionInput)
