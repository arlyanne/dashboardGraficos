import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SelectionContextType {
  selectedItem: string | undefined;
  setSelectedItem: React.Dispatch<React.SetStateAction<string | undefined>>;
  dataItemFilter: any;
  setDataItemFilter: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const SelectionContext = createContext<SelectionContextType | undefined>(undefined);

export const useSelection = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error('useSelection must be used within a SelectionProvider');
  }
  return context;
};

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedItem, setSelectedItem] = useState<string | undefined>(undefined);
  const [dataItemFilter, setDataItemFilter] = useState<any>();


  return (
    <SelectionContext.Provider value={{ selectedItem, setSelectedItem, dataItemFilter, setDataItemFilter }}>
      {children}
    </SelectionContext.Provider>
  );
};
