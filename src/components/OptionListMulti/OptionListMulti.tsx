import React, { useEffect, useState } from 'react';
import {
  OptionListAddOtherButton,
  OptionListCheck, OptionListInput,
  OptionListInputContainer,
  OptionListItem,
  OptionListItemLabel,
} from './style';

interface OptionListItemProps {
  value: string;
  label: string;
  excludable?: boolean;
}
interface OptionListValue {
  selected: string[];
  other?: string;
}

interface OptionListProps {
  value?: OptionListValue;
  items: OptionListItemProps[];
  excludableValues?: string[];
  onChange?: (value: OptionListValue) => void;
  allowAddOther?: boolean;
  addOtherLabel?: string;
  enableOther?: boolean;
  otherPlaceholder?: string;
  isCheckbox?: boolean;
}
const defaultValue = { selected: [], other: '' };
const OptionListMulti = ({
  value = defaultValue, items, excludableValues, isCheckbox,
  onChange, allowAddOther, addOtherLabel, enableOther, otherPlaceholder,
}: OptionListProps) => {
  const [showOtherInput, setShowOtherInput] = useState(false);

  useEffect(() => {
    setShowOtherInput(!!enableOther || !!value?.other);
  }, [value, enableOther]);

  const selectItem = (selectedItem: OptionListItemProps) => {
    const { selected, other } = value;
    let newSelected: string[];
    let newOtherValue: string | undefined;

    const index = selected[0] ? selected[0].indexOf(selectedItem.value) : -1;

    if (index >= 0) { // already present in the selected array, remove
      newSelected = [...selected.flat().slice(0, index), ...selected.flat().slice(index + 1)];
      newOtherValue = other;
    } else if (excludableValues?.includes(selectedItem.value)
    || (excludableValues && selected.some(item => excludableValues.includes(item)))) {
      newSelected = [selectedItem.value];
      newOtherValue = undefined;
    } else { // add new value
      newSelected = [...selected, selectedItem.value].flat();
      newOtherValue = other;
    }

    if (onChange) {
      onChange({
        selected: newSelected,
        other: newOtherValue,
      });
    }
  };

  const otherChangeHandler = (newOtherVaue: string) => {
    const { selected } = value;
    let newSelected: string[];

    if (excludableValues && selected.some(item => excludableValues.includes(item))) {
      newSelected = [];
    } else {
      newSelected = selected;
    }

    if (onChange) {
      onChange({
        selected: newSelected,
        other: newOtherVaue,
      });
    }

    if (!newOtherVaue) {
      setShowOtherInput(false);
    }
  };

  const addOtherClickHandler = () => {
    setShowOtherInput(true);
  };

  return (
    <>
      {items.map((item, index) => {
        const isSelected = value?.selected?.flat().includes(item.value);
        return (
          <OptionListItem
            key={item.value}
            lastItem={items.length === index + 1 && !allowAddOther && !enableOther}
            onClick={() => selectItem(item)}
            isSelected={isSelected}
          >
            <OptionListItemLabel>
              {item.label}
            </OptionListItemLabel>
            <OptionListCheck isSelected={isSelected} checkbox={isCheckbox} />
          </OptionListItem>
        );
      })}
      {allowAddOther && !showOtherInput && (
        <OptionListAddOtherButton onClick={addOtherClickHandler} lastItem>
          {addOtherLabel}
        </OptionListAddOtherButton>
      )}
      {showOtherInput && (
        <OptionListInputContainer>
          <OptionListInput
            placeholder={otherPlaceholder}
            value={value?.other || ''}
            isSelected={!!(value?.other)}
            onChange={e => otherChangeHandler(e.target.value)}
          />
          {!!(value?.other) && (
            <OptionListCheck />
          )}
        </OptionListInputContainer>
      )}
    </>
  );
};

OptionListMulti.defaultProps = {
  value: defaultValue,
  excludableValues: undefined,
  onChange: undefined,
  allowAddOther: false,
  addOtherLabel: '',
  enableOther: false,
  otherPlaceholder: '',
};

export default React.memo(OptionListMulti);
