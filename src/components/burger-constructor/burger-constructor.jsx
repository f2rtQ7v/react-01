import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import { getIngredients, getTotal, addIngredient, resetConstructor } from '../../services/burger-constructor/slice.js';
import { getOrderState, resetOrder } from '../../services/order/slice.js';
import { createOrder } from '../../services/order/actions.js';
import { CurrencyIcon, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import IngredientsList from './ingredients-list/ingredients-list.jsx';
import IngredientItemBun from './ingredient-item/ingredient-item-bun.jsx';
import IngredientItemFilling from './ingredient-item/ingredient-item-filling.jsx';
import Modal from '../modal/modal.jsx';
import OrderDetails from '../order-details/order-details.jsx';
import LoadingScreen from '../screens/loading-screen/loading-screen.jsx';
import ErrorScreen from '../screens/error-screen/error-screen.jsx';
import styles from './burger-constructor.module.css';

function BurgerConstructor() {
  const dispatch = useDispatch();

  const { bun, fillings } = useSelector(getIngredients);
  const total = useSelector(getTotal);
  const { order, orderCreateRequest, orderCreateError } = useSelector(getOrderState);

  const [ { canDrop }, dropRef ] = useDrop(() => ({
    accept: 'ingredient',
    drop(ingredient) {
      dispatch(addIngredient(ingredient));
    },
    collect: monitor => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  const onCreateOrderClick = useCallback(() => {
    dispatch(createOrder([ bun, ...fillings, bun ].map(n => n._id)));
  }, [ dispatch, bun, fillings ]);

  const onCloseOrderModalClick = useCallback(() => {
    dispatch(resetConstructor());
    dispatch(resetOrder());
  }, [ dispatch ]);

  return (
    <section className={`${styles.container} ${canDrop ? styles.drop : ''}`} ref={dropRef}>

      <IngredientsList>
        <IngredientItemBun ingredient={bun} type="top" />
      </IngredientsList>
      <IngredientsList>
        {!fillings.length && <IngredientItemFilling />}
        {fillings.map((n, i) => <IngredientItemFilling key={n.id} ingredient={n} index={i} />)}
      </IngredientsList>
      <IngredientsList>
        <IngredientItemBun ingredient={bun} type="bottom" />
      </IngredientsList>

      <div className={styles.footer}>
        <span className={styles.total}>
          {total}
          <CurrencyIcon />
        </span>
        <Button
          htmlType="button"
          type="primary"
          size="medium"
          disabled={!bun}
          onClick={onCreateOrderClick}
        >
          Оформить заказ
        </Button>
      </div>

      {(order || orderCreateRequest || orderCreateError) && (
        <Modal onClose={onCloseOrderModalClick}>
          <div className={styles.modalContent}>
            {orderCreateRequest && (
              <LoadingScreen>
                <span>Создание заказа</span>
                <span>Ждите</span>
              </LoadingScreen>
            )}
            {orderCreateError && (
              <ErrorScreen>
                <span>Не удалось создать заказ</span>
                <span>{orderCreateError}</span>
              </ErrorScreen>
            )}
            {order && <OrderDetails orderId={order.id} />}
          </div>
        </Modal>
      )}

    </section>
  );
}

export default BurgerConstructor;
