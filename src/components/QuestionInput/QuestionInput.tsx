import React, { forwardRef, useEffect } from 'react';

import './QuestionInput.scss';

interface QuestionInputProps {
  placeholder?: string;
  value: string;
  onChanged?: (newValue: string) => void;
}

function QuestionInput({ placeholder, value, onChanged }: QuestionInputProps, ref: any) {
  useEffect(() => {
    if (ref.current) {
      ref.current.innerText = value;

      if (ref.current.innerText !== '') handleCursor();
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (value === '' && e.code === 'Tab') {
      e.preventDefault();
      ref.current.innerText = placeholder;
    } else if (value !== '' && e.ctrlKey && e.code === 'KeyR') {
      e.preventDefault();
      ref.current.innerText = '';
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onChanged) return;
    onChanged((e.target as HTMLDivElement).innerText);
  };

  const handleCursor = () => {
    const range = new Range();
    range.setStart(ref.current.firstChild, ref.current.innerText.length);
    document.getSelection()?.removeAllRanges();
    document.getSelection()?.addRange(range);
  };

  return (
    <div
      ref={ref}
      className="input"
      contentEditable
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      placeholder={placeholder}
    ></div>
  );
}

export default forwardRef(QuestionInput);
