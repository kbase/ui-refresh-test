import { FunctionComponent as FC } from 'react';
import classes from './Button.module.scss';

export const Button: FC<React.ComponentProps<'button'>> = (props) => {
  const className = [classes.button, props.className].join(' ');
  return <button className={className} type={undefined} {...props} />;
};
