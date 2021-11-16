import { KBaseButton } from '../../common/components';
import {
  useAppSelector,
  useAppDispatch,
  usePageTitle,
} from '../../common/hooks';
import { countStatus, increment } from '../count/countSlice';

const Counter = () => {
  const currentCount = useAppSelector(countStatus);
  return <>{currentCount}</>;
};

export default function Count() {
  usePageTitle('Count');
  const dispatch = useAppDispatch();
  const doIncrement = () => {
    dispatch(increment());
  };
  return (
    <section>
      <h2>
        The count is: <Counter />
      </h2>
      <KBaseButton onclick={() => doIncrement()}>Add</KBaseButton>
    </section>
  );
}
