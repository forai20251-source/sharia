import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { getDefaultTextsMap, DEFAULT_UI_TEXTS, UiTextDefinition } from '../data/defaultUiTexts';

interface TextContextType {
  texts: Record<string, string>;
  t: (key: string, fallback?: string) => string;
  setUiText: (key: string, value: string) => void;
  deleteUiText: (key: string) => void;
  resetUiTexts: () => void;
  definitions: UiTextDefinition[];
}

const TextContext = createContext<TextContextType>({
  texts: getDefaultTextsMap(),
  t: (key: string, fallback?: string) => fallback || key,
  setUiText: () => {},
  deleteUiText: () => {},
  resetUiTexts: () => {},
  definitions: DEFAULT_UI_TEXTS,
});

export const TextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [texts, setTexts] = useState<Record<string, string>>(() => storageService.getUiTexts());

  useEffect(() => {
    // Initial sync from storage/database
    const current = storageService.getUiTexts();
    setTexts(current);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      if (texts && key in texts && texts[key] !== undefined && texts[key] !== '') {
        return texts[key];
      }
      const defaultMap = getDefaultTextsMap();
      if (key in defaultMap) {
        return defaultMap[key];
      }
      return fallback || key;
    },
    [texts]
  );

  const setUiText = useCallback((key: string, value: string) => {
    storageService.saveUiText(key, value);
    setTexts(prev => ({ ...prev, [key]: value }));
  }, []);

  const deleteUiText = useCallback((key: string) => {
    storageService.deleteUiText(key);
    const defaultMap = getDefaultTextsMap();
    setTexts(prev => {
      const next = { ...prev };
      if (key in defaultMap) {
        next[key] = defaultMap[key];
      } else {
        delete next[key];
      }
      return next;
    });
  }, []);

  const resetUiTexts = useCallback(() => {
    storageService.resetUiTexts();
    setTexts(getDefaultTextsMap());
  }, []);

  return (
    <TextContext.Provider
      value={{
        texts,
        t,
        setUiText,
        deleteUiText,
        resetUiTexts,
        definitions: DEFAULT_UI_TEXTS,
      }}
    >
      {children}
    </TextContext.Provider>
  );
};

export const useText = () => useContext(TextContext);
