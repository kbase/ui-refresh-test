import { FunctionComponent as FC, MouseEventHandler } from 'react';
import classes from './KBaseButton.module.scss';

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
    <button className={classes.button} onClick={onclick} disabled={disabled}>
      {children}
    </button>
  );
};
