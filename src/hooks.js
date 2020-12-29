import { useContext, useState, useEffect, useCallback, useRef, useReducer } from 'react';
import HamsterContext from './HamsterContext';

export function usePromiseCallback(promiseCallback) {
  const [isWaiting, setIsWaiting] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const promiseRef = useRef(null);

  useEffect(() => {
    setIsWaiting(true);
    setData(null);
    setError(null);

    const promise = promiseRef.current = promiseCallback();

    Promise.resolve(promise)
      .then(result => {
        if (promise !== promiseRef.current) { return; }

        setData(result);
        setIsWaiting(false);
      })
      .catch(err => {
        if (promise !== promiseRef.current) { return; }

        setError(err);
        setIsWaiting(false);
      })
    ;

    return () => {
      promiseRef.current = null;
    };
  }, [promiseCallback]);

  const result = [isWaiting, error, data];

  result.isWaiting = isWaiting;
  result.error = error;
  result.data = data;

  return result;
}

export function useContainer() {
  return useContext(HamsterContext);
}

export function useContainerItem(name) {
  const container = useContainer();

  return container.get(name);
}

export function useEntitiesByIds(typeName, ids) {
  const store = useContainerItem('store');

  const [forcedReload, forceReload] = useReducer(r => r + 1, 0); // аналогично useSelector из react-redux

  const loadEntities = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    forcedReload; // make react-hooks/exhaustive-deps happy
    return store.findEntitiesByIds(typeName, ids);
  }, [store, typeName, ids, forcedReload]);

  useEffect(() => {
    return store.subscribe(typeName, (updatedIds, action) => {
      const currentIds = new Set(ids.map(id => String(id)));

      if (updatedIds.some(id => currentIds.has(String(id)))) {
        setTimeout(() => {
          forceReload();
        });
      }
    });
  }, [store, typeName, ids]);

  return usePromiseCallback(loadEntities);
}
