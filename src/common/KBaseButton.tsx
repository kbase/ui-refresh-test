import { FunctionComponent as FC, MouseEventHandler } from 'react';

interface KBaseComponentProps {
  disabled?: boolean;
  onclick?: MouseEventHandler;
}

export const KBaseButton: FC<KBaseComponentProps> = ({
  children,
  disabled,
  onclick,
}) => {
  return (
    <button onClick={onclick} disabled={disabled}>
      {children}
    </button>
  );
};
