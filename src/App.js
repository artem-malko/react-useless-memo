import './App.css';
import { createContext, useContext, useState, memo, useCallback, useEffect } from 'react';

function App() {
  const [contextCount, setContextCount] = useState(0);
  const [selfCount, setSelfCount] = useState(0);
  const [maxDeep, setMaxDeep] = useState(5);
  const [selectedComp, setSelectedComp] = useState('smart');
  const [elCount, setElCount] = useState(0);

  useEffect(() => {
    setElCount(document.querySelectorAll('button').length);
  }, [maxDeep]);

  return (
    <div className="App">
      <div className="Padding">
        <div className="Padding">
          <button onClick={() => setContextCount((c) => c + 1)}>increase context count</button>
        </div>
        <div className="Padding">
          <button onClick={() => setSelfCount((c) => c + 1)}>increase self count</button>&nbsp;selfCount:
          &nbsp;
          {selfCount}
        </div>
        <div className="Padding">
          <select
            onChange={(e) => {
              setSelectedComp(e.target.value);
            }}
            defaultValue={selectedComp}
          >
            <option value="smart">Мемо без лишних useCallback</option>
            <option value="not_smart">Мемо с лишним useCallback</option>
            <option value="dumb">Вообще без мемозиации</option>
          </select>
        </div>
        <div className="Padding">
          <input type="number" onChange={(e) => setMaxDeep(parseInt(e.target.value))} value={maxDeep} />
        </div>

        <h4>Elements count: {elCount}</h4>
      </div>

      <CountContext.Provider value={contextCount}>
        <div className="Flex">
          {selectedComp === 'smart' && <SmartMemo level={1} maxLevel={maxDeep} />}
          {selectedComp === 'not_smart' && <NotSmartMemo level={1} maxLevel={maxDeep} />}
          {selectedComp === 'dumb' && <Dumb level={1} maxLevel={maxDeep} />}
        </div>
      </CountContext.Provider>
    </div>
  );
}

export default App;

const CountContext = createContext(0);

/**
 * Умный memo. Мемозиируем примитиные пропсы
 * Внутри к button не используем useCallback
 */
const SmartMemo = memo(({ level, maxLevel }) => {
  const count = useContext(CountContext);

  return (
    <div className="Padding" datalevel={level}>
      <strong>I'm smart!</strong>
      <div className="Padding">
        <button
          onClick={() => {
            console.log('@: ', level);
          }}
        >
          Just a button
        </button>
        &nbsp;
        {count}
      </div>
      <div className="Flex">
        {level <= maxLevel &&
          new Array(level)
            .fill('')
            .map((_, i) => <SmartMemo level={level + 1} maxLevel={maxLevel} key={i} />)}
      </div>
    </div>
  );
});

/**
 * Не такой умный memo =) Мемозиируем примитиные пропсы
 * Внутри к button используем useCallback, который многие считают бесполезным
 */
const NotSmartMemo = memo(({ level, maxLevel }) => {
  const count = useContext(CountContext);

  const onClick = useCallback(() => {
    console.log('@: ', level);
  }, [level]);

  return (
    <div className="Padding" datalevel={level}>
      <strong>I'm not smart!</strong>
      <div className="Padding">
        <button onClick={onClick}>Just a button</button>
        &nbsp;
        {count}
      </div>
      <div className="Flex">
        {level <= maxLevel &&
          new Array(level)
            .fill('')
            .map((_, i) => <NotSmartMemo level={level + 1} maxLevel={maxLevel} key={i} />)}
      </div>
    </div>
  );
});

/**
 * Никакой мемозиации вообще
 */
const Dumb = ({ level, maxLevel }) => {
  const count = useContext(CountContext);

  return (
    <div className="Padding" datalevel={level}>
      <strong>I'm DUMB!</strong>
      <div className="Padding">
        <button
          onClick={() => {
            console.log('@: ', level);
          }}
        >
          Just a button
        </button>
        &nbsp;
        {count}
      </div>
      <div className="Flex">
        {level <= maxLevel &&
          new Array(level).fill('').map((_, i) => <Dumb level={level + 1} maxLevel={maxLevel} key={i} />)}
      </div>
    </div>
  );
};
