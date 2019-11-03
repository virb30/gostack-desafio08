import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as CartActions from '../../store/ducks/cart';
import { formatPrice } from '../../util/format';

import colors from '../../styles/colors';
import {
  Container,
  Products,
  Product,
  ProductInfo,
  ProductTitle,
  ProductPrice,
  ProductImage,
  ProductDetails,
  ProductDelete,
  ProductAmount,
  ProductActions,
  ProductActionButton,
  ProductSubtotal,
  TotalContainer,
  TotalAmount,
  TotalText,
  OrderText,
  Order,
  EmptyContainer,
  EmptyText,
} from './styles';

export default function Cart() {
  const products = useSelector(state =>
    state.cart.map(product => ({
      ...product,
      subtotal: formatPrice(product.price * product.amount),
      priceFormatted: formatPrice(product.price),
    }))
  );

  const total = useSelector(state =>
    formatPrice(
      state.cart.reduce(
        (totalSum, product) => totalSum + product.price * product.amount,
        0
      )
    )
  );

  const dispatch = useDispatch();

  function increment(product) {
    dispatch(CartActions.updateAmountRequest(product.id, product.amount + 1));
  }

  function decrement(product) {
    dispatch(CartActions.updateAmountRequest(product.id, product.amount - 1));
  }

  return (
    <Container>
      {products.length ? (
        <>
          <Products>
            {products.map(product => (
              <Product key={String(product.id)}>
                <ProductInfo>
                  <ProductImage source={{ uri: product.image }} />
                  <ProductDetails>
                    <ProductTitle>{product.title}</ProductTitle>
                    <ProductPrice>{product.priceFormatted}</ProductPrice>
                  </ProductDetails>
                  <ProductDelete
                    onPress={() =>
                      dispatch(CartActions.removeFromCart(product.id))
                    }
                  >
                    <Icon
                      color={colors.primary}
                      name="delete-forever"
                      size={24}
                    />
                  </ProductDelete>
                </ProductInfo>
                <ProductActions>
                  <ProductActionButton onPress={() => decrement(product)}>
                    <Icon
                      name="remove-circle-outline"
                      color={colors.primary}
                      size={20}
                    />
                  </ProductActionButton>
                  <ProductAmount>{product.amount}</ProductAmount>
                  <ProductActionButton onPress={() => increment(product)}>
                    <Icon
                      name="add-circle-outline"
                      color={colors.primary}
                      size={20}
                    />
                  </ProductActionButton>
                  <ProductSubtotal>{product.subtotal}</ProductSubtotal>
                </ProductActions>
              </Product>
            ))}
          </Products>
          <TotalContainer>
            <TotalText>TOTAL</TotalText>
            <TotalAmount>{total}</TotalAmount>
            <Order>
              <OrderText>FINALIZAR PEDIDO</OrderText>
            </Order>
          </TotalContainer>
        </>
      ) : (
        <EmptyContainer>
          <Icon size={64} name="remove-shopping-cart" color="#DDD" />
          <EmptyText>Carrinho Vazio</EmptyText>
        </EmptyContainer>
      )}
    </Container>
  );
}
