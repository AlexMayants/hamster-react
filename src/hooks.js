import { useContext, useState, useEffect, useCallback, useRef, useReducer } from 'react';
import HamsterContext from './HamsterContext';

export function usePromiseCallback(promiseCallback) {
  // We use single state value, because async state updates are (as of React 16) not batched (see https://stackoverflow.com/a/53048903).
  // With separate state values we are going to end up with inconsistent state in the middle of promise resolution/rejection.
  const [[isWaiting, error, data], setState] = useState([true, null, null]);

  const promiseRef = useRef(null);

  useEffect(() => {
    setState([true, null, null]);

    const promise = promiseRef.current = promiseCallback();

    Promise.resolve(promise)
      .then(result => {
        if (promise !== promiseRef.current) { return; }

        setState([false, null, result]);
      })
      .catch(err => {
        if (promise !== promiseRef.current) { return; }

        setState([false, err, null]);
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

  const [forcedReload, forceReload] = useReducer(r => r + 1, 0); // similar to useSelector from react-redux

  const loadEntities = useCallback(() => {
    // eslint-disable-next-line no-unused-expressions
    forcedReload; // make react-hooks/exhaustive-deps happy
    return store.findEntitiesByIds(typeName, ids);
  }, [store, typeName, ids, forcedReload]);

  useEffect(() => {
    return store.subscribe(typeName, updatedIds => {
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
